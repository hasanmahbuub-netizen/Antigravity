const QURAN_COM_API_ROOT = "https://api.quran.com/api/v4";

export const quranApi = {
    /**
     * Fetch verse data (text and translation)
     */
    async getVerseData(surah: number, ayah: number) {
        const verseKey = `${surah}:${ayah}`;

        try {
            console.log(`📖 Fetching verse ${verseKey}...`);
            const response = await fetch(
                `${QURAN_COM_API_ROOT}/verses/by_key/${verseKey}?translations=131&fields=text_uthmani`,
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

            console.log(`✅ Verse ${verseKey} loaded`);
            return {
                arabic: verse.text_uthmani || '',
                translation: verse.translations?.[0]?.text?.replace(/<[^>]*>?/gm, "") || "Translation not available",
                verseKey: verse.verse_key
            };
        } catch (error) {
            console.error(`❌ Failed to fetch verse ${verseKey}:`, error);
            // Return fallback data
            return {
                arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
                translation: "In the name of Allah, the Most Gracious, the Most Merciful",
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
    }
};
