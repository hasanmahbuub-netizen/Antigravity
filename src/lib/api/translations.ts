/**
 * Translation API - Robust multi-source fetcher with caching
 */

interface Translation {
    english: string;
    bangla?: string;
}

interface TranslationItem {
    resource_id: number;
    text: string;
}

/**
 * Fetch verse translations from Quran.com API
 * Resource IDs:
 * - 20 = Sahih International (English, verified working)
 * - 161 = Bangla (Muhiuddin Khan)
 */
export async function fetchVerseTranslations(
    surahNumber: number,
    verseNumber: number
): Promise<Translation> {
    try {
        const verseKey = `${surahNumber}:${verseNumber}`;
        console.log(`📖 Fetching translations for ${verseKey}...`);

        const response = await fetch(
            `https://api.quran.com/api/v4/verses/by_key/${verseKey}?translations=20,161`,
            {
                headers: { 'Accept': 'application/json' },
                cache: 'force-cache'
            }
        );

        if (!response.ok) {
            throw new Error(`Quran.com API failed: ${response.status}`);
        }

        const data = await response.json();

        // Extract translations from response
        const translations = data.verse?.translations || [];

        const englishTrans = translations.find((t: TranslationItem) => t.resource_id === 20);
        const banglaTrans = translations.find((t: TranslationItem) => t.resource_id === 161);

        const result = {
            english: stripHTML(englishTrans?.text || ''),
            bangla: stripHTML(banglaTrans?.text || '')
        };

        console.log(`✅ Translations fetched: EN=${result.english.substring(0, 50)}...`);
        return result;

    } catch (error) {
        console.error('❌ Translation fetch error:', error);

        // Fallback: Return empty but don't crash
        return {
            english: '',
            bangla: undefined
        };
    }
}

/**
 * Batch fetch translations for multiple verses
 */
export async function fetchMultipleTranslations(
    verses: Array<{ surah: number; verse: number }>
): Promise<Map<string, Translation>> {
    const results = new Map<string, Translation>();

    for (const v of verses) {
        const translation = await fetchVerseTranslations(v.surah, v.verse);
        results.set(`${v.surah}:${v.verse}`, translation);
        // Rate limit
        await new Promise(r => setTimeout(r, 100));
    }

    return results;
}

/**
 * Strip HTML tags from text
 */
function stripHTML(text: string): string {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')      // Remove HTML tags
        .replace(/\s+/g, ' ')          // Normalize whitespace
        .trim();
}

/**
 * Get translation with fallback messages
 */
export function getDisplayTranslation(translation: string | null | undefined): string {
    if (!translation || translation.trim() === '') {
        return 'Translation loading...';
    }
    return translation;
}

