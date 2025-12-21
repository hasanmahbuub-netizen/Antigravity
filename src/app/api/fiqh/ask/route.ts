import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY

        const body = await request.json()
        const { question, madhab = 'hanafi' } = body

        if (!question) {
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            )
        }

        console.log(`🤖 Fiqh Question: "${question.substring(0, 50)}..." (${madhab})`)

        let answerText: string
        let sources: string
        let differences: string | null = null

        // Try Gemini AI first
        if (GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

                // Shorter prompt for faster response
                const prompt = `You are a ${madhab} Islamic scholar. Answer briefly (max 80 words):

"${question}"

Give a practical answer based on ${madhab} sources.`

                const result = await model.generateContent(prompt)
                answerText = result.response.text()
                sources = `${madhab.charAt(0).toUpperCase() + madhab.slice(1)} Jurisprudence`
                console.log('✅ Gemini response received')

            } catch (aiError: any) {
                console.error('Gemini error:', aiError.status || aiError.message)

                // Fallback for rate limiting or errors
                const fallback = generateFallbackAnswer(question, madhab)
                answerText = fallback.answer
                sources = fallback.sources
            }
        } else {
            // No API key - use fallback
            const fallback = generateFallbackAnswer(question, madhab)
            answerText = fallback.answer
            sources = fallback.sources
        }

        // Fire-and-forget database save
        try {
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

            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                supabase.from('fiqh_questions').insert({
                    user_id: user.id,
                    question: question,
                    answer: answerText,
                    madhab: madhab,
                    sources: sources
                }).catch(() => { }) // Fire and forget
            }
        } catch { }

        return NextResponse.json({
            answer: answerText,
            sources: sources,
            madhab: madhab,
            differences: differences
        })

    } catch (error: any) {
        console.error('❌ Fiqh API error:', error)

        // Always return a helpful response, never error
        const fallback = generateFallbackAnswer('general question', 'hanafi')
        return NextResponse.json({
            answer: fallback.answer,
            sources: fallback.sources,
            madhab: 'hanafi',
            differences: null
        })
    }
}

/**
 * Generate fallback answer when AI is unavailable
 */
function generateFallbackAnswer(question: string, madhab: string) {
    const topic = question.toLowerCase()

    // Common Islamic topics with default answers
    if (topic.includes('prayer') || topic.includes('salah') || topic.includes('namaz')) {
        return {
            answer: `In the ${madhab} school, prayer (Salah) is performed five times daily at prescribed times. Each prayer has specific number of units (raka'at). For detailed rulings on specific aspects of prayer, consulting with a qualified scholar is recommended.`,
            sources: `${madhab} Fiqh - Prayer chapter`
        }
    }

    if (topic.includes('wudu') || topic.includes('ablution')) {
        return {
            answer: `According to ${madhab} jurisprudence, wudu (ablution) is a prerequisite for prayer. The obligatory acts include washing the face, arms up to elbows, wiping the head, and washing feet. Anything that breaks wudu requires fresh ablution before prayer.`,
            sources: `${madhab} Fiqh - Purification chapter`
        }
    }

    if (topic.includes('fast') || topic.includes('ramadan') || topic.includes('sawm')) {
        return {
            answer: `In ${madhab} fiqh, fasting during Ramadan is obligatory for every sane adult Muslim. Fasting begins at Fajr and ends at Maghrib. Eating, drinking, and marital relations break the fast during these hours.`,
            sources: `${madhab} Fiqh - Fasting chapter`
        }
    }

    if (topic.includes('zakat')) {
        return {
            answer: `Zakat is obligatory when wealth reaches the nisab (minimum threshold) and one lunar year passes. In the ${madhab} school, 2.5% of savings is given annually. Recipients include the poor, needy, and other categories mentioned in Quran.`,
            sources: `${madhab} Fiqh - Zakat chapter`
        }
    }

    // Default fallback
    return {
        answer: `This is an important question in Islamic jurisprudence. The ${madhab} school has detailed guidance on such matters based on Quran and Sunnah. For specific rulings, consulting with a qualified Islamic scholar who can assess your particular situation is recommended.`,
        sources: `${madhab} Islamic Jurisprudence`
    }
}
