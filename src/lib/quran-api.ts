/**
 * MEEK Quran API - Enhanced with multi-language translations
 */

const QURAN_COM_API_ROOT = "https://api.quran.com/api/v4";

// Translation resource IDs from Quran.com
const TRANSLATION_IDS = {
    english: 131,   // Dr. Mustafa Khattab - The Clear Quran
    bangla: 161     // Muhiuddin Khan
};

export const quranApi = {
    /**
     * Fetch verse data with multiple translations
     */
    async getVerseData(surah: number, ayah: number) {
        const verseKey = `${surah}:${ayah}`;

        try {
            console.log(`📖 Fetching verse ${verseKey}...`);

            // Fetch with both English and Bangla translations
            const response = await fetch(
                `${QURAN_COM_API_ROOT}/verses/by_key/${verseKey}?translations=${TRANSLATION_IDS.english},${TRANSLATION_IDS.bangla}&fields=text_uthmani`,
                {
                    cache: 'no-store',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const verse = data.verse;

            if (!verse) {
                throw new Error('No verse data returned');
            }

            // Extract translations
            const translations = verse.translations || [];
            const englishTrans = translations.find((t: any) => t.resource_id === TRANSLATION_IDS.english);
            const banglaTrans = translations.find((t: any) => t.resource_id === TRANSLATION_IDS.bangla);

            console.log(`✅ Verse ${verseKey} loaded with translations`);

            return {
                arabic: verse.text_uthmani || '',
                translation: stripHTML(englishTrans?.text || "Translation not available"),
                translation_english: stripHTML(englishTrans?.text || ""),
                translation_bangla: stripHTML(banglaTrans?.text || ""),
                verseKey: verse.verse_key
            };
        } catch (error) {
            console.error(`❌ Failed to fetch verse ${verseKey}:`, error);
            // Return fallback data
            return {
                arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
                translation: "In the name of Allah, the Most Gracious, the Most Merciful",
                translation_english: "In the name of Allah, the Most Gracious, the Most Merciful",
                translation_bangla: "",
                verseKey: verseKey
            };
        }
    },

    /**
     * Fetch Teacher's Recitation audio from Quran.com
     */
    async getTeacherRecitation(surah: number, ayah: number, reciterId: number = 7) {
        const verseKey = `${surah}:${ayah}`;

        try {
            console.log(`🎵 Fetching audio for ${verseKey}...`);
            const response = await fetch(
                `${QURAN_COM_API_ROOT}/recitations/${reciterId}/by_ayah/${verseKey}`,
                {
                    cache: 'no-store',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const audioFile = data.audio_files?.[0];

            if (!audioFile?.url) {
                throw new Error('No audio file returned');
            }

            // Ensure the URL is absolute and properly formatted
            let audioUrl = audioFile.url;
            if (!audioUrl.startsWith('http')) {
                // Use the Quran.com CDN format
                const paddedSurah = String(surah).padStart(3, '0');
                const paddedAyah = String(ayah).padStart(3, '0');
                audioUrl = `https://verses.quran.com/Alafasy/mp3/${paddedSurah}${paddedAyah}.mp3`;
            }

            console.log(`✅ Audio URL: ${audioUrl}`);
            return {
                audio_url: audioUrl
            };
        } catch (error) {
            console.error(`❌ Failed to fetch audio for ${verseKey}:`, error);
            // Return fallback audio URL using Quran.com CDN direct format
            const paddedSurah = String(surah).padStart(3, '0');
            const paddedAyah = String(ayah).padStart(3, '0');
            return {
                audio_url: `https://verses.quran.com/Alafasy/mp3/${paddedSurah}${paddedAyah}.mp3`
            };
        }
    },

    /**
     * Get word-by-word data for a verse
     */
    async getWordByWord(surah: number, ayah: number) {
        const verseKey = `${surah}:${ayah}`;

        try {
            const response = await fetch(
                `${QURAN_COM_API_ROOT}/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,transliteration&translations=${TRANSLATION_IDS.english}&audio=7`,
                { headers: { 'Accept': 'application/json' } }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.verse?.words || [];
        } catch (error) {
            console.error(`❌ Failed to fetch word-by-word for ${verseKey}:`, error);
            return [];
        }
    }
};

/**
 * Strip HTML tags from translation text
 */
function stripHTML(text: string): string {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')      // Remove HTML tags
        .replace(/\s+/g, ' ')          // Normalize whitespace
        .trim();
}

