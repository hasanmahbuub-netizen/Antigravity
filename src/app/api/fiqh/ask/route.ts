import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { FIQH_SYSTEM_PROMPT, buildFiqhPrompt, getFallbackAnswer } from '@/lib/prompts/fiqh-system'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { question, madhab = 'Hanafi' } = body

        if (!question || question.trim().length < 3) {
            return NextResponse.json(
                { error: 'Please enter a valid question' },
                { status: 400 }
            )
        }

        console.log(`🤖 Fiqh Question: "${question.substring(0, 50)}..." (${madhab})`)

        // Create Supabase client for auth and caching
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

        // Get user for personalization
        const { data: { user } } = await supabase.auth.getUser()

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
            return NextResponse.json({
                answer: cached.answer,
                madhab,
                cached: true
            })
        }

        // No cache hit - call Gemini with invisible prompt engineering
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY

        let answer: string = ''

        if (GEMINI_API_KEY) {
            // Prepare system prompt with madhab
            const systemPrompt = FIQH_SYSTEM_PROMPT.replace(/{MADHAB}/g, madhab)
            const userPrompt = buildFiqhPrompt(question, madhab)

            // Retry logic with exponential backoff
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const response = await fetch(
                        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                systemInstruction: {
                                    parts: [{ text: systemPrompt }]
                                },
                                contents: [{
                                    role: 'user',
                                    parts: [{ text: userPrompt }]
                                }],
                                generationConfig: {
                                    temperature: 0.4,
                                    maxOutputTokens: 2048,
                                    topP: 0.9,
                                    topK: 40
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
                        answer = data.candidates?.[0]?.content?.parts?.[0]?.text

                        if (answer && answer.length > 100) {
                            console.log('✅ Gemini response received (' + answer.length + ' chars)')
                            break
                        }
                    }

                    // Rate limited or error - retry with backoff
                    const status = response.status
                    console.log(`⚠️ Gemini attempt ${attempt + 1} failed: ${status}`)

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

        // If no answer from Gemini, use intelligent fallback
        if (!answer || answer.length < 100) {
            console.log('⚠️ Using fallback answer')
            answer = getFallbackAnswer(question, madhab)
        }

        // Cache the answer (fire-and-forget)
        if (user) {
            supabase.from('fiqh_questions').insert({
                user_id: user.id,
                question: question.trim(),
                madhab: madhab,
                answer: answer,
                sources: `${madhab} Jurisprudence`
            }).catch(() => { })
        }

        return NextResponse.json({
            answer,
            madhab,
            sources: `${madhab} Islamic Jurisprudence`,
            cached: false
        })

    } catch (error: any) {
        console.error('❌ Fiqh API error:', error)

        // NEVER return an error to user - always provide helpful content
        const fallback = getFallbackAnswer('general question', 'Hanafi')
        return NextResponse.json({
            answer: fallback,
            madhab: 'Hanafi',
            sources: 'Islamic Tradition'
        })
    }
}
