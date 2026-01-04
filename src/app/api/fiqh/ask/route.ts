import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { askGroqFiqh, FiqhResponse } from '@/lib/providers/groq'
import { askOpenAIFiqh } from '@/lib/providers/openai'
import { getFallbackStructuredAnswer } from '@/lib/prompts/fiqh-system'
import { checkRateLimit, getClientIP, sanitizeInput, isValidQuestion } from '@/lib/security'
import { getSupabaseUrl, getSupabaseAnonKey, hasAIProvider, getAIApiKey } from '@/lib/env'

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // Rate limiting check
        const clientIP = getClientIP(request);
        const rateLimitResult = checkRateLimit(clientIP, { maxRequests: 20, windowMs: 60 * 1000 });

        if (!rateLimitResult.success) {
            console.log(`⚠️ Rate limited: ${clientIP}`);
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please wait before asking another question.' },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitResult.resetInMs / 1000)) } }
            );
        }

        const body = await request.json()
        const { question: rawQuestion, madhab: requestMadhab } = body

        // Validate question
        const validation = isValidQuestion(rawQuestion);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            )
        }

        // Sanitize input to prevent prompt injection
        const question = sanitizeInput(rawQuestion, 1000);

        console.log(`🤖 Fiqh Question: "${question.substring(0, 50)}..."`, { ip: clientIP })

        // Create Supabase client with validated env vars
        const supabaseUrl = getSupabaseUrl();
        const supabaseAnonKey = getSupabaseAnonKey();

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('❌ Supabase not configured');
            return NextResponse.json(
                { success: false, error: 'Service temporarily unavailable' },
                { status: 503 }
            );
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() { return request.cookies.getAll() },
                    setAll() { },
                },
            }
        )

        // Get user
        const { data: { user } } = await supabase.auth.getUser()

        // Get user's madhab preference
        let madhab = requestMadhab || 'Hanafi'

        if (user) {
            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('madhab')
                    .eq('id', user.id)
                    .single<{ madhab?: string }>()

                if (profile?.madhab) {
                    madhab = profile.madhab
                    console.log(`✅ User madhab: ${madhab}`)
                }
            } catch (e) {
                console.warn(`⚠️ Failed to fetch user madhab:`, e);
                // Continue with default madhab
            }
        }

        console.log(`📚 Using madhab: ${madhab}`)

        // Check cache first
        const { data: cached } = await supabase
            .from('fiqh_questions')
            .select('answer, created_at')
            .ilike('question', question.trim())
            .eq('madhab', madhab)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (cached?.answer) {
            console.log(`✅ Cache hit (${Date.now() - startTime}ms)`)
            try {
                const parsedAnswer = typeof cached.answer === 'string'
                    ? JSON.parse(cached.answer)
                    : cached.answer

                return NextResponse.json({
                    success: true,
                    data: parsedAnswer,
                    madhab,
                    provider: 'cache',
                    cached: true,
                    timing: Date.now() - startTime
                })
            } catch (parseError) {
                console.warn('⚠️ Failed to parse cached answer:', parseError);
                // Continue to fetch fresh answer
            }
        }

        // API FALLBACK CHAIN: Groq → Gemini → OpenAI → Static
        let fiqhResponse: FiqhResponse | null = null;
        let provider = 'none';

        // 1️⃣ PRIMARY: Groq (Llama 3.3 70B) - Fastest, no filters
        if (process.env.GROQ_API_KEY) {
            try {
                console.log(`📤 [1] Trying Groq (Llama 3.3)...`)
                fiqhResponse = await askGroqFiqh(question, madhab);
                provider = 'groq';
                console.log(`✅ Groq response (${Date.now() - startTime}ms)`)
            } catch (error) {
                console.error('❌ Groq failed:', error instanceof Error ? error.message : error);
            }
        }

        // 2️⃣ FALLBACK: Gemini 2.5 Flash
        if (!fiqhResponse && process.env.GEMINI_API_KEY) {
            try {
                console.log(`📤 [2] Trying Gemini 2.5 Flash...`)

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                role: 'user',
                                parts: [{ text: buildGeminiPrompt(question, madhab) }]
                            }],
                            generationConfig: {
                                temperature: 0.3,
                                maxOutputTokens: 2000,
                                responseMimeType: "application/json"
                            },
                            safetySettings: [
                                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
                            ]
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (rawText) {
                        fiqhResponse = parseGeminiResponse(rawText, madhab);
                        provider = 'gemini';
                        console.log(`✅ Gemini response (${Date.now() - startTime}ms)`)
                    }
                } else {
                    console.log(`⚠️ Gemini returned ${response.status}`)
                }
            } catch (error) {
                console.error('❌ Gemini failed:', error);
            }
        }

        // 3️⃣ FALLBACK: OpenAI GPT-4o-mini
        if (!fiqhResponse && process.env.OPENAI_API_KEY) {
            try {
                console.log(`📤 [3] Trying OpenAI GPT-4o-mini...`)
                fiqhResponse = await askOpenAIFiqh(question, madhab);
                provider = 'openai';
                console.log(`✅ OpenAI response (${Date.now() - startTime}ms)`)
            } catch (error) {
                console.error('❌ OpenAI failed:', error);
            }
        }

        // 4️⃣ LAST RESORT: Static fallback
        if (!fiqhResponse) {
            console.log(`⚠️ All APIs failed, using static fallback`)
            const fallback = getFallbackStructuredAnswer(question, madhab);
            // Add verified field to citations
            const citationsWithVerified = fallback.citations.map(c => ({
                ...c,
                verified: true
            }));
            fiqhResponse = {
                directAnswer: fallback.directAnswer,
                reasoning: fallback.reasoning,
                otherSchools: fallback.otherSchools,
                citations: citationsWithVerified,
                sourceVerification: {
                    primarySourcesUsed: false,
                    hallucinationRisk: 'N/A - Static fallback',
                    confidenceLevel: 'Low (40%)'
                }
            };
            provider = 'fallback';
        }

        // Cache the answer
        if (user && fiqhResponse) {
            const timing = Date.now() - startTime;
            (async () => {
                try {
                    await supabase.from('fiqh_questions').insert({
                        user_id: user.id,
                        question: question.trim(),
                        madhab: madhab,
                        answer: JSON.stringify(fiqhResponse),
                        response_time_ms: timing,
                        hallucination_risk: fiqhResponse.sourceVerification?.hallucinationRisk,
                        confidence_level: fiqhResponse.sourceVerification?.confidenceLevel
                    });
                } catch (cacheError) {
                    console.warn('⚠️ Failed to cache Fiqh response:', cacheError);
                }
            })();
        }

        const timing = Date.now() - startTime
        console.log(`✅ Fiqh response ready (${timing}ms) via ${provider}`)

        return NextResponse.json({
            success: true,
            data: fiqhResponse,
            madhab,
            provider,
            timing,
            sourceVerification: fiqhResponse!.sourceVerification
        })

    } catch (error: unknown) {
        console.error('❌ Fiqh API error:', error)

        const fallback = getFallbackStructuredAnswer('general', 'Hanafi')
        return NextResponse.json({
            success: true,
            data: {
                ...fallback,
                sourceVerification: {
                    primarySourcesUsed: false,
                    hallucinationRisk: 'N/A - Error fallback',
                    confidenceLevel: 'Low (40%)'
                }
            },
            madhab: 'Hanafi',
            provider: 'fallback',
            timing: Date.now() - startTime
        })
    }
}

function buildGeminiPrompt(question: string, madhab: string): string {
    return `You are an expert Islamic scholar AI. You MUST give SPECIFIC RULINGS, not vague answers.

Question: "${question}"
Madhab: ${madhab.toUpperCase()}

═══════════════════════════════════════════════════════════════
MANDATORY: YOU MUST FOLLOW THESE RULES
═══════════════════════════════════════════════════════════════

1. YOUR FIRST SENTENCE MUST BE A CLEAR RULING using one of these:
   - "In the ${madhab} school, [X] is PERMISSIBLE (halal) because..."
   - "In the ${madhab} school, [X] is PROHIBITED (haram) because..."
   - "In the ${madhab} school, [X] is MAKRUH (disliked) because..."
   - "In the ${madhab} school, [X] is OBLIGATORY (wajib/fard) because..."
   - "In the ${madhab} school, [X] is RECOMMENDED (mustahab/sunnah) because..."

2. BANNED RESPONSES - NEVER SAY THESE:
   ❌ "This is addressed through examination of Quran and Hadith..."
   ❌ "The methodology prioritizes evidences..."
   ❌ "Scholars have different opinions..." (give ruling FIRST!)
   ❌ "Consult a scholar..."

3. YOUR ANSWER MUST INCLUDE:
   - The ruling: halal/haram/permissible/makruh/obligatory
   - At least ONE condition or exception
   - At least ONE Quran verse OR hadith
   - Practical guidance

EXAMPLES OF CORRECT ANSWERS:
✅ "In the ${madhab} school, stock trading is PERMISSIBLE (halal) with conditions: (1) The company's business must be halal..."
✅ "In the ${madhab} school, keeping a dog as a pet is PROHIBITED unless for guarding, herding, or hunting..."
✅ "In the ${madhab} school, cryptocurrency is PERMISSIBLE with conditions: (1) No gambling/speculation..."

Output JSON only:
{
  "directAnswer": "In the ${madhab} school, [CLEAR RULING with halal/haram/permissible]... [50+ words with conditions]",
  "reasoning": "[200-300 words explaining WHY with Quran/Hadith evidence]",
  "otherSchools": [{"madhab": "Name", "position": "Their view if different"}],
  "citations": [{"source": "Quran/Hadith/Scholar", "reference": "Specific ref", "text": "Quote", "verified": true}],
  "sourceVerification": {"primarySourcesUsed": true, "hallucinationRisk": "Low", "confidenceLevel": "High (95%)"}
}`;
}

function parseGeminiResponse(rawText: string, madhab: string): FiqhResponse {
    try {
        let cleanText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleanText = jsonMatch[0];

        const parsed = JSON.parse(cleanText);

        if (!parsed.directAnswer?.toLowerCase().includes(madhab.toLowerCase())) {
            parsed.directAnswer = `In the ${madhab} school, ` + (parsed.directAnswer || '');
        }

        return {
            directAnswer: parsed.directAnswer || '',
            reasoning: parsed.reasoning || '',
            otherSchools: parsed.otherSchools || [],
            citations: parsed.citations || [],
            sourceVerification: parsed.sourceVerification || {
                primarySourcesUsed: true,
                hallucinationRisk: 'Unknown',
                confidenceLevel: 'Unknown'
            }
        };
    } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        throw error;
    }
}
