/**
 * MEEK - Populate Quran Translations
 * Fetches all verses with translations from Quran.com API and stores in database
 * Run: npx tsx scripts/sync-translations.ts
 */

const SUPABASE_ACCESS_TOKEN = 'sbp_e1e4033eb3da092d8cdad2e5d73a85c913a89a38';
const PROJECT_REF = 'lvysvebakhwidqxztrvd';

// Translation IDs from Quran.com
const ENGLISH_TRANSLATION_ID = 131; // Dr. Mustafa Khattab - The Clear Quran
const BANGLA_TRANSLATION_ID = 161;  // Muhiuddin Khan

interface Verse {
    surah_number: number;
    verse_number: number;
    arabic_text: string;
    translation_english: string;
    translation_bangla: string;
    transliteration: string;
    audio_url: string;
}

async function fetchVersesFromQuran(surahNumber: number): Promise<Verse[]> {
    console.log(`   📖 Fetching Surah ${surahNumber} from Quran.com...`);

    const url = `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?translations=${ENGLISH_TRANSLATION_ID},${BANGLA_TRANSLATION_ID}&fields=text_uthmani&per_page=286`;

    const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const verses: Verse[] = [];

    for (const v of data.verses) {
        const [surah, ayah] = v.verse_key.split(':').map(Number);

        const translations = v.translations || [];
        const englishTrans = translations.find((t: any) => t.resource_id === ENGLISH_TRANSLATION_ID);
        const banglaTrans = translations.find((t: any) => t.resource_id === BANGLA_TRANSLATION_ID);

        // Clean HTML tags from translations
        const cleanText = (text: string) => text?.replace(/<[^>]*>/g, '')?.trim() || '';

        // Generate audio URL
        const paddedSurah = String(surah).padStart(3, '0');
        const paddedAyah = String(ayah).padStart(3, '0');

        verses.push({
            surah_number: surah,
            verse_number: ayah,
            arabic_text: v.text_uthmani || '',
            translation_english: cleanText(englishTrans?.text || ''),
            translation_bangla: cleanText(banglaTrans?.text || ''),
            transliteration: '', // Will be fetched separately if needed
            audio_url: `https://verses.quran.com/Alafasy/mp3/${paddedSurah}${paddedAyah}.mp3`
        });
    }

    console.log(`   ✅ Fetched ${verses.length} verses`);
    return verses;
}

async function upsertVerses(verses: Verse[]): Promise<void> {
    console.log(`   💾 Saving ${verses.length} verses to database...`);

    // Build SQL for upsert
    const values = verses.map(v =>
        `(${v.surah_number}, ${v.verse_number}, '${v.arabic_text.replace(/'/g, "''")}', '${v.translation_english.replace(/'/g, "''")}', '${v.translation_bangla.replace(/'/g, "''")}', '${v.transliteration.replace(/'/g, "''")}', '${v.audio_url}')`
    ).join(',\n');

    const sql = `
        INSERT INTO quran_verses (surah_number, verse_number, arabic_text, translation_english, translation_bangla, transliteration, audio_url)
        VALUES ${values}
        ON CONFLICT (surah_number, verse_number) 
        DO UPDATE SET 
            arabic_text = EXCLUDED.arabic_text,
            translation_english = EXCLUDED.translation_english,
            translation_bangla = EXCLUDED.translation_bangla,
            audio_url = EXCLUDED.audio_url;
    `;

    const response = await fetch(
        `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Database error: ${error}`);
    }

    console.log(`   ✅ Saved to database`);
}

async function main() {
    console.log('🗃️ MEEK Translation Sync');
    console.log('========================\n');

    // Sync commonly used surahs first
    const prioritySurahs = [1, 2, 112, 113, 114, 36]; // Al-Fatiha, Al-Baqarah (partial), Last 3 surahs, Ya-Sin

    for (const surah of prioritySurahs) {
        try {
            console.log(`\n📗 Processing Surah ${surah}...`);
            const verses = await fetchVersesFromQuran(surah);
            await upsertVerses(verses);

            // Rate limit to avoid API throttling
            await new Promise(r => setTimeout(r, 500));
        } catch (error: any) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }

    console.log('\n========================');
    console.log('✅ Translation sync complete!');
}

main().catch(console.error);
