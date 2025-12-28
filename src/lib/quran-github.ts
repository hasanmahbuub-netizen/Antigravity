/**
 * Quran.com API Integration
 * Fetches Quran data from public API and syncs to Supabase
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const QURAN_API = 'https://api.quran.com/api/v4'
const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy'

// Lazy-loaded admin client
let _adminSupabase: SupabaseClient | null = null

function getAdminSupabase(): SupabaseClient {
    if (!_adminSupabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables')
        }

        _adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })
    }
    return _adminSupabase
}

export interface QuranSurah {
    id: number
    name_arabic: string
    name_english: string
    name_transliteration?: string
    revelation_place?: string
    total_verses: number
}

export interface QuranVerse {
    surah: number
    ayah: number
    text_arabic: string
    text_transliteration?: string
    text_english?: string
    audio_url?: string
}

// API response types
interface ChapterApiResponse {
    id: number;
    name_arabic: string;
    name_simple: string;
    name_complex: string;
    revelation_place: string;
    verses_count: number;
}

interface VerseApiResponse {
    verse_key: string;
    text_uthmani: string;
}

/**
 * Fetch all 114 chapters from Quran.com API
 */
export async function fetchAllSurahs(): Promise<QuranSurah[]> {
    try {
        const response = await fetch(`${QURAN_API}/chapters`)
        const data = await response.json()

        return data.chapters.map((chapter: ChapterApiResponse) => ({
            id: chapter.id,
            name_arabic: chapter.name_arabic,
            name_english: chapter.name_simple,
            name_transliteration: chapter.name_complex,
            revelation_place: chapter.revelation_place,
            total_verses: chapter.verses_count
        }))
    } catch (error) {
        console.error('Failed to fetch surahs:', error)
        throw error
    }
}

/**
 * Fetch verses for a specific surah with translations
 */
export async function fetchSurahVerses(surahId: number): Promise<QuranVerse[]> {
    try {
        // Fetch Arabic text
        const arabicResponse = await fetch(
            `${QURAN_API}/quran/verses/uthmani?chapter_number=${surahId}`
        )
        const arabicData = await arabicResponse.json()

        // Fetch English translation (Sahih International = resource 131)
        const translationResponse = await fetch(
            `${QURAN_API}/quran/translations/131?chapter_number=${surahId}`
        )
        const translationData = await translationResponse.json()

        const verses: QuranVerse[] = arabicData.verses.map((verse: VerseApiResponse, index: number) => {
            const verseNumber = verse.verse_key.split(':')[1]
            return {
                surah: surahId,
                ayah: parseInt(verseNumber),
                text_arabic: verse.text_uthmani,
                text_english: translationData.translations?.[index]?.text?.replace(/<[^>]*>/g, '') || '',
                audio_url: `${AUDIO_CDN}/${verse.verse_key.replace(':', '')}.mp3`
            }
        })

        return verses
    } catch (error) {
        console.error(`Failed to fetch verses for surah ${surahId}:`, error)
        throw error
    }
}

/**
 * Get audio URL for a specific verse
 */
export function getAudioUrl(surahId: number, verseNumber: number): string {
    // Al-Afasy recitation from Islamic Network CDN
    const verseKey = `${surahId}${verseNumber.toString().padStart(3, '0')}`
    return `${AUDIO_CDN}/${verseKey}.mp3`
}

/**
 * Sync all surahs from Quran.com API to Supabase
 */
export async function syncSurahsToDatabase(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
        console.log('📥 Fetching all surahs from Quran.com API...')
        const surahs = await fetchAllSurahs()

        console.log(`📥 Inserting ${surahs.length} surahs into database...`)

        // Insert in batches
        const batchSize = 20
        let inserted = 0

        for (let i = 0; i < surahs.length; i += batchSize) {
            const batch = surahs.slice(i, i + batchSize)
            const { error } = await getAdminSupabase()
                .from('quran_surahs')
                .upsert(batch, { onConflict: 'id' })

            if (error) {
                console.error(`Batch ${i / batchSize + 1} error:`, error.message)
            } else {
                inserted += batch.length
            }
        }

        console.log(`✅ Synced ${inserted} surahs`)
        return { success: true, count: inserted }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Sync error:', message)
        return { success: false, count: 0, error: message }
    }
}

/**
 * Sync verses for all surahs to database (can take a while!)
 */
export async function syncVersesToDatabase(surahIds?: number[]): Promise<{ success: boolean; count: number; error?: string }> {
    try {
        // Get surahs to sync
        const idsToSync = surahIds || Array.from({ length: 114 }, (_, i) => i + 1)
        let totalVerses = 0

        for (const surahId of idsToSync) {
            console.log(`📥 Fetching verses for surah ${surahId}...`)

            try {
                const verses = await fetchSurahVerses(surahId)

                const { error } = await getAdminSupabase()
                    .from('quran_verses')
                    .upsert(verses, { onConflict: 'surah,ayah' })

                if (error) {
                    console.error(`Surah ${surahId} error:`, error.message)
                } else {
                    totalVerses += verses.length
                    console.log(`✅ Synced ${verses.length} verses for surah ${surahId}`)
                }

                // Rate limiting - wait 200ms between requests
                await new Promise(resolve => setTimeout(resolve, 200))
            } catch (surahError) {
                console.warn(`⚠️ Error syncing surah ${surahId}, continuing...`)
            }
        }

        console.log(`✅ Total verses synced: ${totalVerses}`)
        return { success: true, count: totalVerses }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Verse sync error:', message)
        return { success: false, count: 0, error: message }
    }
}

/**
 * Sync all Quran data (surahs + verses)
 */
export async function syncAllQuranData(): Promise<{ surahs: number; verses: number }> {
    console.log('🚀 Starting complete Quran data sync...')

    const surahResult = await syncSurahsToDatabase()
    // For now just sync first 10 surahs to be quick, can expand later
    const verseResult = await syncVersesToDatabase([1, 2, 36, 67, 78, 112, 113, 114])

    console.log('✅ Quran data sync complete!')
    return { surahs: surahResult.count, verses: verseResult.count }
}

/**
 * Get verse from database
 */
export async function getVerseFromDatabase(surahId: number, verseNumber: number): Promise<QuranVerse | null> {
    const { data, error } = await getAdminSupabase()
        .from('quran_verses')
        .select('*')
        .eq('surah', surahId)
        .eq('ayah', verseNumber)
        .single()

    if (error) {
        console.error('Failed to get verse:', error)
        return null
    }

    return data
}

/**
 * Get all verses for a surah from database
 */
export async function getSurahVersesFromDatabase(surahId: number): Promise<QuranVerse[]> {
    const { data, error } = await getAdminSupabase()
        .from('quran_verses')
        .select('*')
        .eq('surah', surahId)
        .order('ayah')

    if (error) {
        console.error('Failed to get verses:', error)
        return []
    }

    return data || []
}

