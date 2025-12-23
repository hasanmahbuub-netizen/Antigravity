import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { FIQH_SYSTEM_PROMPT, FIQH_EDUCATIONAL_PREFACE, getFallbackAnswer } from '@/lib/prompts/fiqh-system'

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

        // Check cache first (hash by question + madhab)
        const cacheKey = `${question.toLowerCase().trim().replace(/\s+/g, '_')}_${madhab}`.substring(0, 200)

        // Try to find cached answer
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

        let answer: string

        if (GEMINI_API_KEY) {
            // Prepare system prompt with madhab
            const systemPrompt = FIQH_SYSTEM_PROMPT.replace(/{MADHAB}/g, madhab)
            const educationalQuery = FIQH_EDUCATIONAL_PREFACE(question, madhab)

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
                                    parts: [{ text: educationalQuery }]
                                }],
                                generationConfig: {
                                    temperature: 0.3,
                                    maxOutputTokens: 1000,
                                    topP: 0.8
                                },
                                safetySettings: [
                                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
                                ]
                            })
                        }
                    )

                    if (response.ok) {
                        const data = await response.json()
                        answer = data.candidates?.[0]?.content?.parts?.[0]?.text

                        if (answer) {
                            console.log('✅ Gemini response received')
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
        if (!answer!) {
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
        return NextResponse.json({
            answer: `Thank you for your question about Islamic guidance.

Based on traditional Islamic scholarship, this topic has been discussed by scholars throughout history. The general principle in Islam is to seek knowledge and act upon what is clearly established in the Quran and Sunnah.

**Recommended Actions**:
1. Consult with a qualified local scholar or imam
2. Visit reputable Islamic knowledge websites
3. Refer to classical fiqh texts in your madhab

📚 This is educational information based on classical Islamic scholarship. For personal religious guidance, please consult a qualified scholar in your community.`,
            madhab: 'General',
            sources: 'Islamic Tradition'
        })
    }
}
