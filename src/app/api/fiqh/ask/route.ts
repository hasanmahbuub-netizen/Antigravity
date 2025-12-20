import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai-service'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { question, madhab = 'hanafi' } = body

        if (!question) {
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            )
        }

        // Get user session from authorization header
        const authHeader = request.headers.get('authorization')
        const supabase = createClient(supabaseUrl, supabaseKey)

        let userId = null
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '')
            const { data: { user } } = await supabase.auth.getUser(token)
            userId = user?.id
        }

        // Call AI service to get answer
        console.log(`🤖 Consulting Fiqh AI for question: "${question.substring(0, 50)}..."`)
        const result = await aiService.consultFiqh(question, madhab)

        // Store question and answer in database
        if (userId) {
            try {
                await supabase
                    .from('fiqh_questions')
                    .insert({
                        user_id: userId,
                        question: question,
                        answer: result.answer,
                        madhab: madhab,
                        sources: result.context || ''
                    })
                console.log('✅ Saved to database')
            } catch (dbError) {
                console.error('Failed to save to database:', dbError)
                // Continue even if DB save fails
            }
        }

        return NextResponse.json({
            answer: result.answer,
            sources: result.context,
            madhab: madhab,
            differences: result.differences || null
        })

    } catch (error: any) {
        console.error('❌ Fiqh API error:', error)
        return NextResponse.json(
            { error: 'Failed to process question', details: error.message },
            { status: 500 }
        )
    }
}
