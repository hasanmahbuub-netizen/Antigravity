/**
 * Whisper Provider - Arabic Speech-to-Text via Groq
 * Uses Whisper-v3 for accurate Arabic transcription
 */

interface WhisperResult {
    text: string;
    words: WhisperWord[];
    language: string;
    duration: number;
}

interface WhisperWord {
    word: string;
    start: number;
    end: number;
    confidence: number;
}

/**
 * Transcribe Arabic audio using Groq's Whisper API
 */
export async function transcribeArabic(
    audioBase64: string,
    mimeType: string
): Promise<WhisperResult | null> {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        console.error('GROQ_API_KEY not configured for Whisper');
        return null;
    }

    try {
        // Convert base64 to blob for form data
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        const blob = new Blob([audioBuffer], { type: mimeType });

        // Create form data
        const formData = new FormData();
        formData.append('file', blob, 'audio.webm');
        formData.append('model', 'whisper-large-v3');
        formData.append('language', 'ar'); // Arabic
        formData.append('response_format', 'verbose_json');
        formData.append('timestamp_granularities[]', 'word');

        console.log('🎙️ Sending audio to Whisper for transcription...');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Whisper API error:', response.status, error);
            return null;
        }

        const data = await response.json();
        console.log('✅ Whisper transcription complete:', data.text?.substring(0, 50));

        return {
            text: data.text || '',
            words: data.words || [],
            language: data.language || 'ar',
            duration: data.duration || 0,
        };
    } catch (error) {
        console.error('Whisper transcription failed:', error);
        return null;
    }
}

/**
 * Normalize Arabic text for comparison
 * Removes diacritics (tashkeel) for word matching
 */
export function normalizeArabic(text: string): string {
    // Remove Arabic diacritics
    const diacritics = /[\u064B-\u065F\u0670]/g;
    // Remove tatweel (kashida)
    const tatweel = /\u0640/g;
    // Normalize alef variations
    const alefVariations = /[\u0622\u0623\u0625\u0627]/g;

    return text
        .replace(diacritics, '')
        .replace(tatweel, '')
        .replace(alefVariations, 'ا')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Extract words from Arabic text
 */
export function extractArabicWords(text: string): string[] {
    const normalized = normalizeArabic(text);
    return normalized.split(/\s+/).filter(word => word.length > 0);
}
