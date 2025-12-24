/**
 * MEEK Tafsir API
 * Fetches verse-by-verse understanding from quran-api
 */

interface TafsirData {
    english: string;
    source: string;
    verseKey: string;
}

/**
 * Fetch Tafsir from Quran CDN API
 */
export async function fetchTafsir(
    surahNumber: number,
    verseNumber: number
): Promise<TafsirData | null> {
    try {
        const verseKey = `${surahNumber}:${verseNumber}`;

        // Try QuranCDN API for tafsir
        const response = await fetch(
            `https://api.qurancdn.com/api/v4/tafsirs/169/by_ayah/${verseKey}`,
            {
                cache: 'force-cache',
                next: { revalidate: 86400 } // Cache for 24 hours
            }
        );

        if (!response.ok) {
            console.error(`Tafsir API error: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (!data.tafsir) {
            // Fallback to translations API
            return await fetchTranslationAsTafsir(surahNumber, verseNumber);
        }

        // Clean HTML tags from tafsir text
        const englishTafsir = data.tafsir.text
            ? stripHtml(data.tafsir.text)
            : '';

        return {
            english: englishTafsir,
            source: data.tafsir.resource_name || 'Ibn Kathir',
            verseKey
        };

    } catch (error) {
        console.error('Tafsir fetch error:', error);
        return null;
    }
}

/**
 * Fallback: Fetch translation if tafsir not available
 */
async function fetchTranslationAsTafsir(
    surahNumber: number,
    verseNumber: number
): Promise<TafsirData | null> {
    try {
        const verseKey = `${surahNumber}:${verseNumber}`;

        const response = await fetch(
            `https://api.qurancdn.com/api/v4/quran/translations/131?verse_key=${verseKey}`,
            { cache: 'force-cache' }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const translation = data.translations?.[0];

        if (!translation?.text) {
            return null;
        }

        return {
            english: stripHtml(translation.text),
            source: 'Dr. Mustafa Khattab (Clear Quran)',
            verseKey
        };

    } catch (error) {
        console.error('Translation fetch error:', error);
        return null;
    }
}

/**
 * Get Tafsir with caching via Supabase
 */
export async function getTafsirCached(
    surahNumber: number,
    verseNumber: number,
    supabase: any
): Promise<TafsirData | null> {

    // Check cache first
    const { data: cached } = await supabase
        .from('quran_tafsir')
        .select('*')
        .eq('surah_number', surahNumber)
        .eq('verse_number', verseNumber)
        .maybeSingle();

    if (cached?.tafsir_english) {
        return {
            english: cached.tafsir_english,
            source: cached.source || 'Quran Commentary',
            verseKey: `${surahNumber}:${verseNumber}`
        };
    }

    // Fetch fresh
    const tafsir = await fetchTafsir(surahNumber, verseNumber);

    // Cache for future use
    if (tafsir) {
        await supabase.from('quran_tafsir').upsert({
            surah_number: surahNumber,
            verse_number: verseNumber,
            tafsir_english: tafsir.english,
            source: tafsir.source
        }).catch(() => {
            // Ignore cache errors
        });
    }

    return tafsir;
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

export type { TafsirData };
