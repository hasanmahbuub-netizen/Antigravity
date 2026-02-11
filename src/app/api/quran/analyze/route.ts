import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/lib/security'
import { transcribeArabic } from '@/lib/providers/whisper'
import { calculateWER, werToAccuracy, type WERResult } from '@/lib/analysis/wer'

/**
 * Quran Recitation Analyzer
 * 
 * When GROQ_API_KEY + GEMINI_API_KEY are configured:
 *   1. Whisper transcription → what the user actually said
 *   2. WER calculation → word-level accuracy
 *   3. Gemini Tajweed analysis → pronunciation quality
 *   4. Combined score with specific feedback
 * 
 * When AI keys are NOT configured:
 *   Falls back to lightweight encouragement-based feedback
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now()

    try {
        // Rate limiting check
        const clientIP = getClientIP(request)
        const rateLimitResult = checkRateLimit(clientIP, { maxRequests: 30, windowMs: 60 * 1000 })

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait before submitting again.' },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitResult.resetInMs / 1000)) } }
            )
        }

        const formData = await request.formData()
        const audioFile = formData.get('audio') as File | null
        const surahStr = formData.get('surah') as string
        const ayahStr = formData.get('ayah') as string
        const verseText = (formData.get('verseText') as string) || ''

        const surah = parseInt(surahStr)
        const ayah = parseInt(ayahStr)

        console.log(`🎤 Analyzing recitation: Surah ${surah}, Ayah ${ayah}, Audio size: ${audioFile?.size || 0}`)

        if (!surah || !ayah) {
            return NextResponse.json(
                { success: false, error: 'Surah and Ayah are required' },
                { status: 400 }
            )
        }

        // ─── AI-POWERED ANALYSIS ────────────────────────────────────
        // Attempt real analysis when audio + API keys are available
        const hasAudio = audioFile && audioFile.size > 3000 // minimum 3KB
        const hasGroqKey = !!process.env.GROQ_API_KEY
        const hasGeminiKey = !!process.env.GEMINI_API_KEY

        if (hasAudio && hasGroqKey && verseText) {
            try {
                console.log('🔬 [AI] Starting real Tajweed analysis...')

                // Step 1: Whisper transcription
                const audioBuffer = await audioFile.arrayBuffer()
                const audioBase64 = Buffer.from(audioBuffer).toString('base64')
                const transcription = await transcribeArabic(audioBase64, audioFile.type || 'audio/webm')

                if (transcription?.text?.trim()) {
                    console.log(`✅ Transcribed: "${transcription.text.substring(0, 50)}..."`)

                    // Step 2: WER calculation
                    const wer = calculateWER(verseText, transcription.text)
                    const werAccuracy = werToAccuracy(wer.wer)

                    console.log(`📈 WER: ${wer.wer}% | Matched: ${wer.matchedWords}/${wer.totalExpected}`)

                    // Step 3: WER-based score cap
                    let maxPossibleScore = 100
                    if (wer.wer > 50) maxPossibleScore = 30
                    else if (wer.wer > 20) maxPossibleScore = 50
                    else if (wer.wer > 10) maxPossibleScore = 70

                    // Step 4: Gemini Tajweed analysis (if available)
                    let tajweedScore = wer.wer < 20 ? 30 : wer.wer < 50 ? 20 : 10
                    let strengths: string[] = wer.matchedWords > 0 ? ['Words recognized correctly'] : []
                    let improvements: string[] = ['Speak more clearly for better analysis']
                    let detailedNotes = 'Automated score based on word recognition'

                    if (hasGeminiKey) {
                        try {
                            const geminiResult = await analyzeWithGemini(
                                audioBase64,
                                audioFile.type || 'audio/webm',
                                verseText,
                                transcription.text,
                                wer,
                                `${surah}:${ayah}`
                            )
                            tajweedScore = geminiResult.tajweedScore
                            strengths = geminiResult.strengths
                            improvements = geminiResult.improvements
                            detailedNotes = geminiResult.detailedNotes
                        } catch (geminiError) {
                            console.warn('⚠️ Gemini analysis failed, using WER-only scoring:', geminiError)
                        }
                    }

                    // Step 5: Final combined score
                    let finalScore = Math.round(werAccuracy + tajweedScore)
                    finalScore = Math.min(finalScore, maxPossibleScore)
                    finalScore = Math.max(0, finalScore)

                    const timing = Date.now() - startTime
                    console.log(`✅ [AI] Final score: ${finalScore}% (${timing}ms)`)

                    return NextResponse.json({
                        success: true,
                        feedback: {
                            score: finalScore,
                            positives: strengths.length > 0 ? strengths : ['Recitation attempt detected'],
                            improvements: improvements.length > 0 ? improvements : ['Continue practicing'],
                            details: detailedNotes || 'Analysis complete.'
                        },
                        transcription: transcription.text,
                        wer: wer.wer,
                        matchedWords: wer.matchedWords,
                        totalWords: wer.totalExpected,
                        audioSize: audioFile.size,
                        aiPowered: true,
                        timing
                    })
                } else {
                    console.log('⚠️ No speech detected by Whisper, falling back to practice mode')
                }
            } catch (aiError) {
                console.warn('⚠️ AI analysis failed, falling back to practice mode:', aiError instanceof Error ? aiError.message : aiError)
            }
        }

        // ─── FALLBACK: PRACTICE MODE ────────────────────────────────
        // Used when: no audio, no API keys, or AI analysis failed
        const feedback = generateLightweightFeedback(verseText, surah, ayah)

        console.log('✅ Practice mode feedback generated:', feedback.score)

        return NextResponse.json({
            success: true,
            feedback,
            audioSize: audioFile?.size || 0,
            practiceMode: true,
            disclaimer: hasGroqKey
                ? 'Audio could not be analyzed. Showing practice feedback.'
                : 'AI analysis not configured. Showing practice feedback.',
            timing: Date.now() - startTime
        })

    } catch (error) {
        console.error('❌ Quran analyze API error:', error instanceof Error ? error.message : error)

        return NextResponse.json(
            { success: false, error: 'Analysis failed. Please try again.' },
            { status: 500 }
        )
    }
}

/**
 * Gemini Tajweed Analysis — strict examiner scoring
 */
async function analyzeWithGemini(
    audioBase64: string,
    mimeType: string,
    expectedText: string,
    transcribedText: string,
    wer: WERResult,
    verseKey: string
): Promise<{ tajweedScore: number; strengths: string[]; improvements: string[]; detailedNotes: string }> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured')
    }

    const prompt = `
You are a STRICT Tajweed examiner. You have received:
- EXPECTED Arabic verse: "${expectedText}"
- Whisper TRANSCRIBED from user audio: "${transcribedText}"
- Word Error Rate: ${wer.wer}% (${wer.matchedWords}/${wer.totalExpected} words correct)
- Verse: ${verseKey}

Analyze the AUDIO for Tajweed quality. Be STRICT and HONEST.

SCORING (0-50 points for Tajweed):
1. MAKHRAJ (0-20): Correct articulation points for each letter
2. MADD (0-15): Proper elongation (2-5 harakah counts)
3. GHUNNAH & QALQALAH (0-15): Nasal sounds and echoing

OUTPUT JSON ONLY:
{
  "tajweedScore": 35,
  "strengths": ["Clear pronunciation of heavy letters"],
  "improvements": ["Hold the Madd on رَحِيم for 4 counts"],
  "detailedNotes": "Overall decent recitation with minor timing issues"
}

If WER is high (>${wer.wer}%), the user said wrong words — tajweedScore should be lower.
Output JSON only.`.trim()

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [
                        { inlineData: { data: audioBase64, mimeType } },
                        { text: prompt }
                    ]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 1500,
                    responseMimeType: "application/json"
                }
            })
        }
    )

    if (!response.ok) {
        throw new Error(`Gemini returned ${response.status}`)
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) {
        throw new Error('Empty Gemini response')
    }

    // Parse JSON response
    let cleanText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (jsonMatch) cleanText = jsonMatch[0]

    const parsed = JSON.parse(cleanText)

    return {
        tajweedScore: Math.min(50, Math.max(0, parsed.tajweedScore || 25)),
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || ['Continue practicing'],
        detailedNotes: parsed.detailedNotes || ''
    }
}

/**
 * Lightweight practice mode feedback (no AI required)
 * Deterministic scores based on verse for consistency
 */
function generateLightweightFeedback(verseText: string, surah: number, ayah: number) {
    const baseScore = 75 + ((surah * 7 + ayah * 3) % 20)

    const allPositives = [
        'Clear articulation of Arabic letters',
        'Good breathing control between phrases',
        'Consistent rhythm maintained throughout',
        'Proper pronunciation of heavy letters (مفخمة)',
        'Good voice modulation and pace',
        'Correct stopping and starting points'
    ]

    const allImprovements = [
        'Practice Qalqalah (echoing) for letters ق ط ب ج د',
        'Focus on Makharij (articulation points) for throat letters',
        'Work on proper elongation (Madd) rules',
        'Pay attention to Ghunnah (nasal sound) in noon and meem',
        'Practice Idgham (merging) rules for smooth transitions',
        'Review Ikhfa (hiding) rules for noun sakinah'
    ]

    const encouragements = [
        'MashaAllah! Your dedication to learning the Quran is inspiring.',
        'Beautiful effort! Keep practicing and you will see great improvement.',
        'May Allah bless your journey in learning His Book.',
        'Every recitation is a step towards perfection. Keep going!',
        'Your commitment to Tajweed is commendable. Stay consistent!'
    ]

    const posIndex1 = (surah + ayah) % allPositives.length
    const posIndex2 = (surah * 2 + ayah) % allPositives.length
    const impIndex = (surah + ayah * 2) % allImprovements.length
    const encIndex = (surah * ayah) % encouragements.length

    // Suppress unused variable warning — verseText reserved for future text-based scoring
    void verseText

    return {
        score: Math.min(95, Math.max(70, baseScore)),
        positives: [
            allPositives[posIndex1],
            allPositives[posIndex2 !== posIndex1 ? posIndex2 : (posIndex1 + 1) % allPositives.length]
        ],
        improvements: [
            allImprovements[impIndex]
        ],
        details: encouragements[encIndex]
    }
}
