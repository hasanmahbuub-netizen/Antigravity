import { NextRequest, NextResponse } from 'next/server';

/**
 * Tajweed Audio Analysis Endpoint
 * Uses Gemini 2.5 Flash for multimodal audio analysis
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

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not configured');
            return NextResponse.json({
                success: false,
                error: 'AI analysis not available',
                feedback: null
            });
        }

        // Convert audio to base64
        const audioBuffer = await audioFile.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');
        const audioSize = audioFile.size;

        console.log(`🎙️ Analyzing Tajweed for verse: ${verseKey}`);
        console.log(`📁 Audio type: ${audioFile.type}, size: ${audioSize} bytes`);

        // CRITICAL: Validate audio is not empty/silent
        // WebM files with no real audio are typically very small
        const MIN_AUDIO_SIZE = 5000; // 5KB minimum for real speech

        if (audioSize < MIN_AUDIO_SIZE) {
            console.log(`⚠️ Audio too small (${audioSize} bytes) - likely silence`);
            return NextResponse.json({
                success: false,
                error: 'Recording too short or silent. Please recite the verse and try again.',
                feedback: null
            });
        }

        const prompt = buildTajweedPrompt(expectedText, verseKey);

        // Call Gemini with audio
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [
                            {
                                inlineData: {
                                    data: audioBase64,
                                    mimeType: audioFile.type || 'audio/webm'
                                }
                            },
                            { text: prompt }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 1500,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        if (!response.ok) {
            console.error(`Gemini returned ${response.status}`);
            const errorData = await response.text();
            console.error('Error details:', errorData);

            return NextResponse.json({
                success: false,
                error: 'AI analysis temporarily unavailable. Please try again.',
                feedback: null
            });
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.error('No response text from Gemini');
            return NextResponse.json({
                success: false,
                error: 'Could not analyze the recording. Please try again.',
                feedback: null
            });
        }

        // Parse the response
        const feedback = parseTajweedFeedback(rawText);

        // Additional validation: if AI detected silence or no speech
        if (feedback.accuracy < 20 || feedback.strengths.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No clear recitation detected. Please speak clearly and try again.',
                feedback: null
            });
        }

        const timing = Date.now() - startTime;
        console.log(`✅ Tajweed analysis complete (${timing}ms), accuracy: ${feedback.accuracy}%`);

        return NextResponse.json({
            success: true,
            feedback,
            timing
        });

    } catch (error) {
        console.error('Tajweed analysis error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to analyze recording. Please try again.',
            feedback: null
        });
    }
}

/**
 * Build the Tajweed analysis prompt
 */
function buildTajweedPrompt(expectedText: string, verseKey: string): string {
    return `
You are an expert Tajweed (Quranic recitation) analyst. 

TASK: Analyze this audio recording against the expected Quranic verse for phonetic accuracy.

Expected verse (Uthmani script):
"${expectedText}"

Verse reference: ${verseKey}

CRITICAL FIRST STEP:
- FIRST, determine if there is ACTUAL SPEECH in this audio
- If the audio is SILENT, contains only noise, or has NO CLEAR SPEECH, you MUST return accuracy: 0 and note this in improvements
- Do NOT give high scores to silence or noise

ANALYSIS POINTS (only if speech is detected):
1. Makhraj (مخارج) - Are letters pronounced from correct articulation points?
2. Sifaat (صفات) - Characteristics of letters (Tafkheem, Tarqeeq, Qalqalah, Ghunnah)
3. Madd (مد) - Elongation rules (Natural, Connected, Separated)
4. Overall flow - Smooth, measured recitation

RESPONSE FORMAT (JSON):
{
  "accuracy": 0,
  "strengths": [],
  "improvements": ["No speech detected in the recording. Please recite the verse clearly."],
  "tajweedScore": {
    "makhraj": 0,
    "sifaat": 0,
    "madd": 0,
    "overall": 0
  },
  "detailedNotes": "Audio was silent or contained no recognizable speech"
}

IF SPEECH IS DETECTED, provide actual feedback with realistic scores (60-95% for learners).

IMPORTANT:
- Be HONEST - silence = 0 accuracy
- Be SPECIFIC with feedback when speech IS present
- Accuracy should reflect ACTUAL performance

Output valid JSON only.
  `.trim();
}

/**
 * Parse Tajweed feedback from Gemini response
 */
function parseTajweedFeedback(rawText: string): TajweedFeedback {
    try {
        // Clean up JSON
        let cleanText = rawText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        // Extract JSON
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanText = jsonMatch[0];
        }

        const parsed = JSON.parse(cleanText);

        // Validate structure
        if (parsed.accuracy === undefined) {
            throw new Error('Invalid feedback structure');
        }

        return {
            accuracy: Math.min(100, Math.max(0, parsed.accuracy)),
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Please try recording again'],
            tajweedScore: parsed.tajweedScore || {
                makhraj: parsed.accuracy || 0,
                sifaat: parsed.accuracy || 0,
                madd: parsed.accuracy || 0,
                overall: parsed.accuracy || 0
            },
            detailedNotes: parsed.detailedNotes
        };

    } catch (error) {
        console.error('Failed to parse Tajweed feedback:', error);
        return {
            accuracy: 0,
            strengths: [],
            improvements: ['Could not analyze the recording. Please try again.'],
            tajweedScore: { makhraj: 0, sifaat: 0, madd: 0, overall: 0 }
        };
    }
}

interface TajweedFeedback {
    accuracy: number;
    strengths: string[];
    improvements: string[];
    tajweedScore: {
        makhraj: number;
        sifaat: number;
        madd: number;
        overall: number;
    };
    detailedNotes?: string;
}
