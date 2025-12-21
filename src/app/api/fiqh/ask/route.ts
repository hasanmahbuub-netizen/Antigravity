import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY

        if (!GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY not set!')
            return NextResponse.json(
                { error: 'AI service not configured. Please set GEMINI_API_KEY in environment variables.' },
                { status: 500 }
            )
        }

        const body = await request.json()
        const { question, madhab = 'hanafi' } = body

        if (!question) {
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            )
        }

        console.log(`🤖 Fiqh Question: "${question.substring(0, 50)}..." (${madhab})`)

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: `You are an expert Islamic Jurist (Mufti) specializing in the ${madhab} Madhab. 
            Your answers should be based on traditional secondary sources like Radd al-Muhtar, Al-Hidayah, or similar authoritative texts. 
            Keep the tone respectful, clear, and educational. 
            Always mention if there are major differences with other schools.
            Format your response clearly with sections if needed.`
        })

        let answerText: string

        try {
            const result = await model.generateContent(`User Question: "${question}"`)
            const response = await result.response
            answerText = response.text()
            console.log('✅ Gemini response received')
        } catch (aiError: any) {
            console.error('Gemini API error:', aiError.status, aiError.message)

            // Handle rate limiting
            if (aiError.status === 429) {
                return NextResponse.json({
                    answer: `⏳ The AI service is currently experiencing high demand. Please try again in a moment.\n\nIn the meantime, regarding your question about "${question.substring(0, 50)}...", I recommend consulting with a local scholar or trusted Islamic resource for immediate guidance.`,
                    sources: 'Rate limit - please retry',
                    madhab: madhab,
                    differences: null,
                    isRateLimited: true
                })
            }

            // Handle other errors
            return NextResponse.json({
                answer: `I apologize, but I'm temporarily unable to provide a detailed answer. For questions about "${question.substring(0, 50)}...", please consult with a qualified local scholar or trusted Islamic resource.`,
                sources: 'AI service temporarily unavailable',
                madhab: madhab,
                differences: null,
                error: aiError.message
            })
        }

        // Try to save to database (non-blocking)
        try {
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return request.cookies.getAll()
                        },
                        setAll() { },
                    },
                }
            )

            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                await supabase
                    .from('fiqh_questions')
                    .insert({
                        user_id: user.id,
                        question: question,
                        answer: answerText,
                        madhab: madhab,
                        sources: `${madhab.charAt(0).toUpperCase() + madhab.slice(1)} Jurisprudence`
                    })
                console.log('✅ Saved to database')
            }
        } catch (dbError) {
            console.error('DB save failed (non-blocking):', dbError)
        }

        return NextResponse.json({
            answer: answerText,
            sources: `Primary Source: ${madhab.charAt(0).toUpperCase() + madhab.slice(1)} Jurisprudence`,
            madhab: madhab,
            differences: "Referenced within the answer if applicable."
        })

    } catch (error: any) {
        console.error('❌ Fiqh API error:', error)
        return NextResponse.json(
            {
                error: 'Failed to process question',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        )
    }
}
