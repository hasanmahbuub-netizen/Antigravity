const QURAN_COM_API_ROOT = "https://api.quran.com/api/v4";

export const quranApi = {
    /**
     * Fetch verse data (text and translation)
     * Fields: text_uthmani (Madani script), text_indopak (Indopak script)
     * Translation: 131 (Saheeh International)
     */
    async getVerseData(surah: number, ayah: number) {
        const verseKey = `${surah}:${ayah}`;
        const response = await fetch(
            `${QURAN_COM_API_ROOT}/verses/by_key/${verseKey}?translations=131&fields=text_uthmani`
        );
        const data = await response.json();
        const verse = data.verse;

        return {
            arabic: verse.text_uthmani,
            translation: verse.translations?.[0]?.text.replace(/<[^>]*>?/gm, ""), // Clean HTML tags
            verseKey: verse.verse_key
        };
    },

    /**
     * Fetch Teacher's Recitation audio from Quran.com
     */
    async getTeacherRecitation(surah: number, ayah: number, reciterId: number = 7) {
        const verseKey = `${surah}:${ayah}`;
        const response = await fetch(
            `${QURAN_COM_API_ROOT}/recitations/${reciterId}/by_ayah/${verseKey}`
        );
        const data = await response.json();
        const audioFile = data.audio_files?.[0];

        // Ensure the URL is absolute
        let audioUrl = audioFile.url;
        if (audioUrl && !audioUrl.startsWith('http')) {
            audioUrl = `https://download.quranicaudio.com/quran/mishari_rashid_al_afasi/${audioUrl}`;
        }

        return {
            audio_url: audioUrl
        };
    }
};
