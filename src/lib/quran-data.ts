/**
 * Quran Data Utilities
 * Fetches and manages Quran data from api.quran.com
 */

const QURAN_API_BASE = 'https://api.quran.com/api/v4';

export interface Surah {
    id: number;
    name_arabic: string;
    name_english: string;
    name_transliteration: string;
    revelation_place: string;
    total_verses: number;
}

export interface Verse {
    surah: number;
    ayah: number;
    text_arabic: string;
    text_transliteration?: string;
    text_english?: string;
    text_bangla?: string;
    audio_url?: string;
}

/**
 * Fetch all 114 surahs from Quran API
 */
export async function fetchAllSurahs(): Promise<Surah[]> {
    try {
        const response = await fetch(`${QURAN_API_BASE}/chapters`);
        if (!response.ok) {
            throw new Error('Failed to fetch surahs');
        }

        const data = await response.json();

        return data.chapters.map((chapter: any) => ({
            id: chapter.id,
            name_arabic: chapter.name_arabic,
            name_english: chapter.name_simple,
            name_transliteration: chapter.name_complex,
            revelation_place: chapter.revelation_place,
            total_verses: chapter.verses_count
        }));
    } catch (error) {
        console.error('Error fetching surahs:', error);
        return [];
    }
}

/**
 * Fetch verses for a specific surah
 */
export async function fetchSurahVerses(surahId: number): Promise<Verse[]> {
    try {
        // Fetch Arabic text
        const arabicResponse = await fetch(`${QURAN_API_BASE}/quran/verses/uthmani?chapter_number=${surahId}`);
        const arabicData = await arabicResponse.json();

        // Fetch English translation
        const translationResponse = await fetch(`${QURAN_API_BASE}/quran/translations/131?chapter_number=${surahId}`);
        const translationData = await translationResponse.json();

        const verses: Verse[] = [];

        for (let i = 0; i < arabicData.verses.length; i++) {
            const arabicVerse = arabicData.verses[i];
            const translationVerse = translationData.verses[i];

            verses.push({
                surah: surahId,
                ayah: arabicVerse.verse_number,
                text_arabic: arabicVerse.text_uthmani,
                text_english: translationVerse?.text || '',
                // Audio URL pattern from Quran.com
                audio_url: `https://verses.quran.com/Alafasy/mp3/00${String(surahId).padStart(3, '0')}${String(arabicVerse.verse_number).padStart(3, '0')}.mp3`
            });
        }

        return verses;
    } catch (error) {
        console.error(`Error fetching verses for surah ${surahId}:`, error);
        return [];
    }
}

/**
 * Get a single verse
 */
export async function getVerse(surahId: number, ayahNumber: number): Promise<Verse | null> {
    try {
        const verses = await fetchSurahVerses(surahId);
        return verses.find(v => v.ayah === ayahNumber) || null;
    } catch (error) {
        console.error(`Error getting verse ${surahId}:${ayahNumber}:`, error);
        return null;
    }
}

/**
 * Sample Quran data for development (first 5 surahs)
 */
export const SAMPLE_SURAHS: Surah[] = [
    {
        id: 1,
        name_arabic: "الفاتحة",
        name_english: "Al-Fatihah",
        name_transliteration: "The Opening",
        revelation_place: "makkah",
        total_verses: 7
    },
    {
        id: 2,
        name_arabic: "البقرة",
        name_english: "Al-Baqarah",
        name_transliteration: "The Cow",
        revelation_place: "madinah",
        total_verses: 286
    },
    {
        id: 3,
        name_arabic: "آل عمران",
        name_english: "Ali 'Imran",
        name_transliteration: "Family of Imran",
        revelation_place: "madinah",
        total_verses: 200
    },
    {
        id: 4,
        name_arabic: "النساء",
        name_english: "An-Nisa",
        name_transliteration: "The Women",
        revelation_place: "madinah",
        total_verses: 176
    },
    {
        id: 5,
        name_arabic: "المائدة",
        name_english: "Al-Ma'idah",
        name_transliteration: "The Table Spread",
        revelation_place: "madinah",
        total_verses: 120
    }
];

