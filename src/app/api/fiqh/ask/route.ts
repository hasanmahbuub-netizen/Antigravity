import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { askGroqFiqh, FiqhResponse } from '@/lib/providers/groq'
import { getFallbackStructuredAnswer } from '@/lib/prompts/fiqh-system'

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const body = await request.json()
        const { question, madhab: requestMadhab } = body

        if (!question || question.trim().length < 3) {
            return NextResponse.json(
                { success: false, error: 'Please enter a valid question' },
                { status: 400 }
            )
        }

        console.log(`🤖 Fiqh Question: "${question.substring(0, 50)}..."`)

        // Create Supabase client
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return request.cookies.getAll() },
                    setAll() { },
                },
            }
        )

        // Get user
        const { data: { user } } = await supabase.auth.getUser()

        // Get user's madhab preference - CRITICAL for correct answers
        let madhab = requestMadhab || 'Hanafi'

        if (user) {
            try {
                const { data: profile } = await (supabase
                    .from('profiles')
                    .select('madhab')
                    .eq('id', user.id)
                    .single() as any)

                if (profile?.madhab) {
                    madhab = profile.madhab
                    console.log(`✅ User madhab from profile: ${madhab}`)
                }
            } catch (e) {
                console.log(`⚠️ Could not fetch profile, using default: ${madhab}`)
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
            console.log(`✅ Returning cached answer (${Date.now() - startTime}ms)`)
            try {
                const parsedAnswer = typeof cached.answer === 'string'
                    ? JSON.parse(cached.answer)
                    : cached.answer

                return NextResponse.json({
                    success: true,
                    data: parsedAnswer,
                    madhab,
                    cached: true,
                    timing: Date.now() - startTime
                })
            } catch {
                // Old format, continue to fetch new
            }
        }

        // PRIMARY: Try Groq (Llama 3.3 70B) - Fast, no filters
        let fiqhResponse: FiqhResponse | null = null;
        let provider = 'none';

        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        if (GROQ_API_KEY) {
            try {
                console.log(`📤 Calling Groq (Llama 3.3) with ${madhab} prompts...`)
                fiqhResponse = await askGroqFiqh(question, madhab);
                provider = 'groq';
                console.log(`✅ Groq response received (${Date.now() - startTime}ms)`)
            } catch (error) {
                console.error('❌ Groq error:', error)
            }
        }

        // FALLBACK: Try Gemini if Groq fails
        if (!fiqhResponse) {
            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

            if (GEMINI_API_KEY) {
                console.log(`📤 Falling back to Gemini...`)

                try {
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{
                                    role: 'user',
                                    parts: [{
                                        text: buildGeminiPrompt(question, madhab)
                                    }]
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
                            console.log(`✅ Gemini response parsed (${Date.now() - startTime}ms)`)
                        }
                    } else {
                        console.log(`⚠️ Gemini returned ${response.status}`)
                    }
                } catch (error) {
                    console.error('❌ Gemini error:', error);
                }
            }
        }

        // LAST RESORT: Use fallback structured answer
        if (!fiqhResponse) {
            console.log(`⚠️ Using local fallback for ${madhab}`)
            const fallback = getFallbackStructuredAnswer(question, madhab);
            fiqhResponse = {
                ...fallback,
                sourceVerification: {
                    primarySourcesUsed: false,
                    hallucinationRisk: 'N/A - Static fallback',
                    confidenceLevel: 'Low (40%)'
                }
            };
            provider = 'fallback';
        }

        // Cache the answer
        if (user) {
            const timing = Date.now() - startTime;
            (async () => {
                try {
                    await supabase.from('fiqh_questions').insert({
                        user_id: user.id,
                        question: question.trim(),
                        madhab: madhab,
                        answer: JSON.stringify(fiqhResponse),
                        response_time_ms: timing,
                        hallucination_risk: fiqhResponse?.sourceVerification?.hallucinationRisk,
                        confidence_level: fiqhResponse?.sourceVerification?.confidenceLevel
                    });
                } catch { }
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
            sourceVerification: fiqhResponse.sourceVerification
        })

    } catch (error: any) {
        console.error('❌ Fiqh API error:', error)

        // NEVER return an error - always provide helpful content
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

/**
 * Build prompt for Gemini fallback
 */
function buildGeminiPrompt(question: string, madhab: string): string {
    return `You are an Islamic scholar. Answer this question from the ${madhab} school perspective.

Question: "${question}"

REQUIREMENTS:
1. Start with "In the ${madhab} school..."
2. Provide clear, specific answer
3. Include reasoning with evidence
4. Cite Quran, Hadith, and scholars

Output valid JSON only:
{
  "directAnswer": "In the ${madhab} school, [answer]",
  "reasoning": "[200-300 words with evidence]",
  "otherSchools": [{"madhab": "Name", "position": "Their view if different"}],
  "citations": [{"source": "Quran/Hadith/Scholar", "reference": "Specific ref", "text": "Quote", "verified": true}],
  "sourceVerification": {"primarySourcesUsed": true, "hallucinationRisk": "Medium", "confidenceLevel": "Medium (70%)"}
}`;
}

/**
 * Parse Gemini response into FiqhResponse format
 */
function parseGeminiResponse(rawText: string, madhab: string): FiqhResponse {
    try {
        // Clean up JSON
        let cleanText = rawText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        // Extract JSON
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanText = jsonMatch[0];
        }

        const parsed = JSON.parse(cleanText);

        // Validate madhab mention
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
