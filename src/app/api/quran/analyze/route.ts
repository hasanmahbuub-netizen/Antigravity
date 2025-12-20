import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai-service'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const audioFile = formData.get('audio') as Blob | null
        const surah = parseInt(formData.get('surah') as string)
        const ayah = parseInt(formData.get('ayah') as string)

        if (!surah || !ayah) {
            return NextResponse.json(
                { error: 'Surah and Ayah are required' },
                { status: 400 }
            )
        }

        // Get user session
        const authHeader = request.headers.get('authorization')
        const supabase = createClient(supabaseUrl, supabaseKey)

        let userId = null
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '')
            const { data: { user } } = await supabase.auth.getUser(token)
            userId = user?.id
        }

        console.log(`🎤 Analyzing recitation for Surah ${surah}, Ayah ${ayah}`)

        // Upload audio to Supabase Storage if provided
        let audioUrl = null
        if (audioFile && userId) {
            try {
                const fileName = `${userId}/${surah}_${ayah}_${Date.now()}.webm`
                const arrayBuffer = await audioFile.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('quran-recordings')
                    .upload(fileName, buffer, {
                        contentType: audioFile.type || 'audio/webm',
                        upsert: false
                    })

                if (!uploadError && uploadData) {
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('quran-recordings')
                        .getPublicUrl(fileName)
                    audioUrl = publicUrl
                    console.log('📁 Audio uploaded:', audioUrl)
                }
            } catch (uploadErr) {
                console.error('Failed to upload audio:', uploadErr)
                // Continue even if upload fails
            }
        }

        // Analyze recitation using Gemini AI
        const feedback = await aiService.analyzeRecitation(audioFile, surah, ayah)

        // Store attempt in database if user is authenticated
        if (userId) {
            try {
                await supabase
                    .from('recitation_attempts')
                    .insert({
                        user_id: userId,
                        surah: surah,
                        ayah: ayah,
                        feedback: feedback as any,
                        audio_url: audioUrl,
                        score: feedback.score
                    } as any)
                console.log('✅ Recitation attempt saved to database')
            } catch (dbError) {
                console.error('Failed to save to database:', dbError)
            }
        }

        return NextResponse.json({
            success: true,
            transcription: null, // Would come from Whisper API
            accuracy: feedback.score,
            feedback: {
                score: feedback.score,
                positives: feedback.positives,
                improvements: feedback.improvements,
                details: feedback.details
            },
            audioUrl: audioUrl
        })

    } catch (error: any) {
        console.error('❌ Quran analyze API error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze recitation', details: error.message },
            { status: 500 }
        )
    }
}
