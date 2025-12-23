import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import {
    FIQH_SYSTEM_PROMPT,
    buildFiqhPrompt,
    parseFiqhResponse,
    getFallbackStructuredAnswer,
    FiqhStructuredAnswer
} from '@/lib/prompts/fiqh-system'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { question } = body

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

        // Get user's madhab preference
        let madhab = 'Hanafi'
        if (user) {
            const { data: profile } = await (supabase
                .from('profiles')
                .select('madhab')
                .eq('id', user.id)
                .single() as any)

            if (profile?.madhab) {
                madhab = profile.madhab
            }
        }

        // Check cache first
        const { data: cached } = await supabase
            .from('fiqh_questions')
            .select('answer')
            .ilike('question', question.trim())
            .eq('madhab', madhab)
            .limit(1)
            .maybeSingle()

        if (cached?.answer) {
            console.log('✅ Returning cached answer')
            try {
                const parsedAnswer = typeof cached.answer === 'string'
                    ? JSON.parse(cached.answer)
                    : cached.answer

                return NextResponse.json({
                    success: true,
                    data: parsedAnswer,
                    madhab,
                    cached: true
                })
            } catch {
                // Old format, continue to fetch new
            }
        }

        // Call Gemini with JSON mode
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY
        let structuredAnswer: FiqhStructuredAnswer | null = null

        if (GEMINI_API_KEY) {
            const systemPrompt = FIQH_SYSTEM_PROMPT.replace(/{MADHAB}/g, madhab)
            const userPrompt = buildFiqhPrompt(question, madhab)

            // Retry logic
            for (let attempt = 0; attempt < 3; attempt++) {
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
                                    temperature: 0.3,
                                    maxOutputTokens: 2048,
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
                            structuredAnswer = parseFiqhResponse(rawText)
                            console.log('✅ Gemini JSON response parsed')
                            break
                        }
                    }

                    console.log(`⚠️ Gemini attempt ${attempt + 1} failed: ${response.status}`)
                    if (attempt < 2) {
                        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
                    }

                } catch (error) {
                    console.error(`Gemini attempt ${attempt + 1} error:`, error)
                    if (attempt < 2) {
                        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
                    }
                }
            }
        }

        // Use fallback if Gemini failed
        if (!structuredAnswer) {
            console.log('⚠️ Using fallback structured answer')
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

        return NextResponse.json({
            success: true,
            data: structuredAnswer,
            madhab
        })

    } catch (error: any) {
        console.error('❌ Fiqh API error:', error)

        // NEVER return an error - always provide helpful content
        const fallback = getFallbackStructuredAnswer('general', 'Hanafi')
        return NextResponse.json({
            success: true,
            data: fallback,
            madhab: 'Hanafi'
        })
    }
}
