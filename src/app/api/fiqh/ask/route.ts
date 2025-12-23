import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import {
    getFiqhSystemPrompt,
    buildFiqhPrompt,
    parseFiqhResponse,
    getFallbackStructuredAnswer,
    FiqhStructuredAnswer
} from '@/lib/prompts/fiqh-system'

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

        // Check cache first - but only use recent entries (since prompt V5 deployment)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: cached } = await supabase
            .from('fiqh_questions')
            .select('answer, created_at')
            .ilike('question', question.trim())
            .eq('madhab', madhab)
            .gte('created_at', oneDayAgo) // Only use cache from last 24 hours
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

        // Call Gemini with explicit madhab prompts
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY
        let structuredAnswer: FiqhStructuredAnswer | null = null

        if (GEMINI_API_KEY) {
            const systemPrompt = getFiqhSystemPrompt(madhab)
            const userPrompt = buildFiqhPrompt(question, madhab)

            console.log(`📤 Calling Gemini with ${madhab} prompts...`)

            // Single attempt with faster model
            try {
                const response = await fetch(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemInstruction: { parts: [{ text: systemPrompt }] },
                            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                            generationConfig: {
                                temperature: 0.3,       // Slightly higher for more natural responses
                                maxOutputTokens: 2000,  // Increased for detailed Arabic text + citations
                                topP: 0.95,
                                topK: 40,
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
                )

                if (response.ok) {
                    const data = await response.json()
                    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

                    if (rawText) {
                        structuredAnswer = parseFiqhResponse(rawText, madhab)
                        console.log(`✅ Gemini response parsed (${Date.now() - startTime}ms)`)

                        // Validate madhab mention
                        if (!structuredAnswer.directAnswer.toLowerCase().includes(madhab.toLowerCase())) {
                            console.warn(`⚠️ Answer missing ${madhab}, prepending...`)
                            structuredAnswer.directAnswer = `In the ${madhab} school, ` + structuredAnswer.directAnswer
                        }
                    }
                } else {
                    console.log(`⚠️ Gemini returned ${response.status}`)
                }

            } catch (error) {
                console.error(`❌ Gemini error:`, error)
            }
        }

        // Use fallback if Gemini failed
        if (!structuredAnswer) {
            console.log(`⚠️ Using fallback for ${madhab}`)
            structuredAnswer = getFallbackStructuredAnswer(question, madhab)
        }

        // Cache the answer (fire-and-forget)
        if (user) {
            (async () => {
                try {
                    await supabase.from('fiqh_questions').insert({
                        user_id: user.id,
                        question: question.trim(),
                        madhab: madhab,
                        answer: JSON.stringify(structuredAnswer)
                    });
                } catch { }
            })();
        }

        const timing = Date.now() - startTime
        console.log(`✅ Fiqh response ready (${timing}ms)`)

        return NextResponse.json({
            success: true,
            data: structuredAnswer,
            madhab,
            timing
        })

    } catch (error: any) {
        console.error('❌ Fiqh API error:', error)

        // NEVER return an error - always provide helpful content
        const fallback = getFallbackStructuredAnswer('general', 'Hanafi')
        return NextResponse.json({
            success: true,
            data: fallback,
            madhab: 'Hanafi',
            timing: Date.now() - startTime
        })
    }
}
