import { NextRequest, NextResponse } from 'next/server';
import { transcribeArabic, normalizeArabic } from '@/lib/providers/whisper';
import { calculateWER, werToAccuracy, type WERResult } from '@/lib/analysis/wer';

/**
 * Phonetic Blueprint Architecture - Precision Tajweed Analysis
 * 
 * Flow:
 * 1. Whisper-v3 transcription → get actual words spoken
 * 2. WER calculation → correctness score (0-50%)
 * 3. Gemini strict analysis → pronunciation + tajweed (50-100%)
 * 4. Combined score with specific rule violations
 */
export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;
        const expectedText = formData.get('expectedText') as string;
        const verseKey = formData.get('verseKey') as string;

        if (!audioFile || !expectedText) {
            return NextResponse.json(
                { error: 'Missing required fields: audio, expectedText' },
                { status: 400 }
            );
        }

        // Convert audio to base64
        const audioBuffer = await audioFile.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');
        const audioSize = audioFile.size;

        console.log(`🎙️ [PHONETIC] Analyzing verse: ${verseKey}`);
        console.log(`📁 Audio size: ${audioSize} bytes`);

        // STEP 0: Validate audio is not empty
        const MIN_AUDIO_SIZE = 3000; // 3KB minimum
        if (audioSize < MIN_AUDIO_SIZE) {
            return NextResponse.json({
                success: false,
                error: 'Recording too short or silent. Please recite the verse clearly.',
                feedback: null
            });
        }

        // STEP 1: Whisper Transcription
        console.log('📝 [STEP 1] Transcribing with Whisper-v3...');
        const transcription = await transcribeArabic(audioBase64, audioFile.type || 'audio/webm');

        if (!transcription || !transcription.text || transcription.text.trim().length === 0) {
            console.log('⚠️ No speech detected by Whisper');
            return NextResponse.json({
                success: false,
                error: 'No clear speech detected. Please speak louder and try again.',
                feedback: null
            });
        }

        console.log(`✅ Transcribed: "${transcription.text.substring(0, 50)}..."`);

        // STEP 2: Calculate Word Error Rate
        console.log('📊 [STEP 2] Calculating WER...');
        const wer = calculateWER(expectedText, transcription.text);
        const werAccuracy = werToAccuracy(wer.wer);

        console.log(`📈 WER: ${wer.wer}% | Matched: ${wer.matchedWords}/${wer.totalExpected}`);

        // STEP 3: Determine if word-level correctness is too low
        let maxPossibleScore = 100;
        let wordLevelDeduction = 0;

        if (wer.wer > 50) {
            // More than half the words wrong - severe penalty
            maxPossibleScore = 30;
            wordLevelDeduction = 70;
        } else if (wer.wer > 20) {
            // WER > 20% caps score at 50%
            maxPossibleScore = 50;
            wordLevelDeduction = 50;
        } else if (wer.wer > 10) {
            maxPossibleScore = 70;
            wordLevelDeduction = 30;
        }

        // STEP 4: Gemini Strict Tajweed Analysis
        console.log('🔬 [STEP 3] Gemini strict Tajweed analysis...');
        const tajweedAnalysis = await analyzeWithGemini(
            audioBase64,
            audioFile.type || 'audio/webm',
            expectedText,
            transcription.text,
            wer,
            verseKey
        );

        // STEP 5: Calculate final score
        const baseScore = werAccuracy; // 0-50% from word correctness
        const tajweedScore = tajweedAnalysis.tajweedScore; // 0-50% from Tajweed rules
        let finalScore = Math.round(baseScore + tajweedScore);

        // Apply cap based on WER
        finalScore = Math.min(finalScore, maxPossibleScore);

        // Apply specific deductions
        for (const violation of tajweedAnalysis.violations) {
            finalScore = Math.max(0, finalScore - violation.deduction);
        }

        const timing = Date.now() - startTime;
        console.log(`✅ [COMPLETE] Final score: ${finalScore}% (${timing}ms)`);

        return NextResponse.json({
            success: true,
            feedback: {
                accuracy: finalScore,
                wer: wer.wer,
                transcribedText: transcription.text,
                matchedWords: wer.matchedWords,
                totalWords: wer.totalExpected,
                strengths: tajweedAnalysis.strengths,
                improvements: tajweedAnalysis.improvements,
                violations: tajweedAnalysis.violations,
                tajweedScore: {
                    makhraj: tajweedAnalysis.makhraj,
                    madd: tajweedAnalysis.madd,
                    ghunnah: tajweedAnalysis.ghunnah,
                    overall: finalScore
                },
                detailedNotes: tajweedAnalysis.detailedNotes
            },
            timing
        });

    } catch (error) {
        console.error('Tajweed analysis error:', error);
        return NextResponse.json({
            success: false,
            error: 'Analysis failed. Please try again.',
            feedback: null
        });
    }
}

/**
 * Strict Gemini Tajweed Analysis
 */
async function analyzeWithGemini(
    audioBase64: string,
    mimeType: string,
    expectedText: string,
    transcribedText: string,
    wer: WERResult,
    verseKey: string
): Promise<TajweedAnalysis> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return getDefaultAnalysis(wer);
    }

    const prompt = buildStrictPrompt(expectedText, transcribedText, wer, verseKey);

    try {
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
        );

        if (!response.ok) {
            console.error('Gemini error:', response.status);
            return getDefaultAnalysis(wer);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            return getDefaultAnalysis(wer);
        }

        return parseGeminiResponse(rawText, wer);

    } catch (error) {
        console.error('Gemini analysis failed:', error);
        return getDefaultAnalysis(wer);
    }
}

/**
 * Build strict examiner prompt
 */
function buildStrictPrompt(
    expectedText: string,
    transcribedText: string,
    wer: WERResult,
    verseKey: string
): string {
    return `
You are a STRICT Tajweed examiner. You have received:
- The EXPECTED Arabic verse: "${expectedText}"
- What Whisper-v3 TRANSCRIBED from the user's audio: "${transcribedText}"
- Word Error Rate (WER): ${wer.wer}% (${wer.matchedWords}/${wer.totalExpected} words correct)
- Verse: ${verseKey}

Now analyze the AUDIO for Tajweed quality. You must be STRICT and HONEST.

SCORING RUBRIC (you can only award 0-50 points for Tajweed, the other 50 comes from WER):

1. MAKHRAJ (0-20 points):
   - Are letters pronounced from correct articulation points?
   - Deduct 15 points for each letter SUBSTITUTION (e.g., س instead of ص)
   - Common errors: ح/ه, ع/ء, ق/ك, ط/ت, ض/د

2. MADD (0-15 points):
   - Natural Madd: 2 harakah (counts)
   - Connected/Separated Madd: 4-5 harakah
   - Deduct 10 points if Madd is cut short

3. GHUNNAH & QALQALAH (0-15 points):
   - Ghunnah on نّ and مّ: 2 harakah nasal sound
   - Qalqalah on ق ط ب ج د: Slight bounce at stop
   - Deduct 5 points for each missing

OUTPUT FORMAT (JSON only):
{
  "tajweedScore": 35,
  "makhraj": 18,
  "madd": 10,
  "ghunnah": 7,
  "violations": [
    {"rule": "Madd cut short", "timestamp": "0:02", "deduction": 10}
  ],
  "strengths": ["Clear pronunciation of heavy letters"],
  "improvements": ["Hold the Madd on رَحِيم for 4 counts"],
  "detailedNotes": "Overall decent recitation with minor timing issues"
}

BE STRICT. If WER is high (>${wer.wer}%), the user said wrong words - tajweedScore should be lower.
If audio sounds rushed or unclear, deduct points. Output JSON only.
`.trim();
}

/**
 * Parse Gemini response
 */
function parseGeminiResponse(rawText: string, wer: WERResult): TajweedAnalysis {
    try {
        let cleanText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleanText = jsonMatch[0];

        const parsed = JSON.parse(cleanText);

        return {
            tajweedScore: Math.min(50, Math.max(0, parsed.tajweedScore || 25)),
            makhraj: parsed.makhraj || 10,
            madd: parsed.madd || 10,
            ghunnah: parsed.ghunnah || 5,
            violations: parsed.violations || [],
            strengths: parsed.strengths || [],
            improvements: parsed.improvements || ['Continue practicing'],
            detailedNotes: parsed.detailedNotes || ''
        };
    } catch {
        return getDefaultAnalysis(wer);
    }
}

/**
 * Default analysis when AI fails
 */
function getDefaultAnalysis(wer: WERResult): TajweedAnalysis {
    const baseScore = wer.wer < 20 ? 30 : wer.wer < 50 ? 20 : 10;
    return {
        tajweedScore: baseScore,
        makhraj: baseScore * 0.4,
        madd: baseScore * 0.3,
        ghunnah: baseScore * 0.3,
        violations: [],
        strengths: wer.matchedWords > 0 ? ['Words recognized correctly'] : [],
        improvements: ['Speak more clearly for better analysis'],
        detailedNotes: 'Automated score based on word recognition'
    };
}

interface TajweedAnalysis {
    tajweedScore: number;
    makhraj: number;
    madd: number;
    ghunnah: number;
    violations: Array<{ rule: string; timestamp?: string; deduction: number }>;
    strengths: string[];
    improvements: string[];
    detailedNotes: string;
}
