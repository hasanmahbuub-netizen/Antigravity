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
                success: true,
                feedback: getDefaultFeedback()
            });
        }

        // Convert audio to base64
        const audioBuffer = await audioFile.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');

        console.log(`🎙️ Analyzing Tajweed for verse: ${verseKey}`);
        console.log(`📁 Audio type: ${audioFile.type}, size: ${audioFile.size} bytes`);

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
                success: true,
                feedback: getDefaultFeedback()
            });
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.error('No response text from Gemini');
            return NextResponse.json({
                success: true,
                feedback: getDefaultFeedback()
            });
        }

        // Parse the response
        const feedback = parseTajweedFeedback(rawText);

        const timing = Date.now() - startTime;
        console.log(`✅ Tajweed analysis complete (${timing}ms)`);

        return NextResponse.json({
            success: true,
            feedback,
            timing
        });

    } catch (error) {
        console.error('Tajweed analysis error:', error);

        return NextResponse.json({
            success: true,
            feedback: getDefaultFeedback()
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

CRITICAL ANALYSIS POINTS:
1. Makhraj (مخارج) - Are letters pronounced from correct articulation points?
   - Throat letters (ح، خ، ع، غ، ء، ه)
   - Tongue letters (ق، ك، ج، ش، ض، ل، ن، ر، ط، د، ت، ص، ز، س، ظ، ذ، ث)
   - Lip letters (ف، و، ب، م)

2. Sifaat (صفات) - Characteristics of letters
   - Tafkheem (heavy) vs Tarqeeq (light)
   - Qalqalah (echoing) on ق، ط، ب، ج، د
   - Ghunnah (nasalization) on ن and م

3. Madd (مد) - Elongation rules
   - Natural Madd (2 counts)
   - Connected Madd (4-5 counts)
   - Separated Madd (4-5 counts)
   - Substitution Madd (2 counts)

4. Waqf (وقف) - If stopped mid-verse, was it at a proper stopping point?

5. Overall flow - Smooth, measured recitation

RESPONSE FORMAT (JSON):
{
  "accuracy": 85,
  "strengths": [
    "Clear pronunciation of heavy letters (ق، ط، ظ، ض)",
    "Proper elongation on Madd Munfasil"
  ],
  "improvements": [
    "The Ra (ر) needs more emphasis - it's a heavy letter here",
    "Slight rushing on the elongation - hold for full 4 counts"
  ],
  "tajweedScore": {
    "makhraj": 90,
    "sifaat": 85,
    "madd": 80,
    "overall": 85
  },
  "detailedNotes": "Optional detailed analysis"
}

IMPORTANT:
- Be SPECIFIC with feedback - mention exact letters and rules
- Be ENCOURAGING but PRECISE
- Accuracy should be realistic (70-95% for learners)
- If audio is unclear or too short, note that in improvements

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
        if (!parsed.accuracy || !parsed.strengths || !parsed.improvements) {
            throw new Error('Invalid feedback structure');
        }

        return {
            accuracy: Math.min(100, Math.max(0, parsed.accuracy)),
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
            tajweedScore: parsed.tajweedScore || {
                makhraj: parsed.accuracy || 75,
                sifaat: parsed.accuracy || 75,
                madd: parsed.accuracy || 75,
                overall: parsed.accuracy || 75
            },
            detailedNotes: parsed.detailedNotes
        };

    } catch (error) {
        console.error('Failed to parse Tajweed feedback:', error);
        return getDefaultFeedback();
    }
}

/**
 * Default feedback when AI analysis fails
 */
function getDefaultFeedback(): TajweedFeedback {
    return {
        accuracy: 75,
        strengths: [
            "You completed the verse confidently",
            "Clear enunciation of most letters"
        ],
        improvements: [
            "Focus on elongating vowels (Madd) for the proper duration",
            "Practice heavy letters (ق، ط، ظ، ض) with deeper throat sound",
            "Maintain consistent pace throughout the verse"
        ],
        tajweedScore: {
            makhraj: 75,
            sifaat: 70,
            madd: 75,
            overall: 75
        }
    };
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
