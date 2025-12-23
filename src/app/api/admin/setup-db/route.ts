import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use the service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const ALL_SURAHS = [
    { id: 1, name_arabic: "الفاتحة", name_english: "Al-Fatiha", revelation_place: "makkah", total_verses: 7 },
    { id: 2, name_arabic: "البقرة", name_english: "Al-Baqarah", revelation_place: "madinah", total_verses: 286 },
    { id: 3, name_arabic: "آل عمران", name_english: "Aal-E-Imran", revelation_place: "madinah", total_verses: 200 },
    { id: 4, name_arabic: "النساء", name_english: "An-Nisa", revelation_place: "madinah", total_verses: 176 },
    { id: 5, name_arabic: "المائدة", name_english: "Al-Maidah", revelation_place: "madinah", total_verses: 120 },
    { id: 6, name_arabic: "الأنعام", name_english: "Al-Anam", revelation_place: "makkah", total_verses: 165 },
    { id: 7, name_arabic: "الأعراف", name_english: "Al-Araf", revelation_place: "makkah", total_verses: 206 },
    { id: 8, name_arabic: "الأنفال", name_english: "Al-Anfal", revelation_place: "madinah", total_verses: 75 },
    { id: 9, name_arabic: "التوبة", name_english: "At-Tawbah", revelation_place: "madinah", total_verses: 129 },
    { id: 10, name_arabic: "يونس", name_english: "Yunus", revelation_place: "makkah", total_verses: 109 },
    { id: 11, name_arabic: "هود", name_english: "Hud", revelation_place: "makkah", total_verses: 123 },
    { id: 12, name_arabic: "يوسف", name_english: "Yusuf", revelation_place: "makkah", total_verses: 111 },
    { id: 13, name_arabic: "الرعد", name_english: "Ar-Rad", revelation_place: "madinah", total_verses: 43 },
    { id: 14, name_arabic: "إبراهيم", name_english: "Ibrahim", revelation_place: "makkah", total_verses: 52 },
    { id: 15, name_arabic: "الحجر", name_english: "Al-Hijr", revelation_place: "makkah", total_verses: 99 },
    { id: 16, name_arabic: "النحل", name_english: "An-Nahl", revelation_place: "makkah", total_verses: 128 },
    { id: 17, name_arabic: "الإسراء", name_english: "Al-Isra", revelation_place: "makkah", total_verses: 111 },
    { id: 18, name_arabic: "الكهف", name_english: "Al-Kahf", revelation_place: "makkah", total_verses: 110 },
    { id: 19, name_arabic: "مريم", name_english: "Maryam", revelation_place: "makkah", total_verses: 98 },
    { id: 20, name_arabic: "طه", name_english: "Ta-Ha", revelation_place: "makkah", total_verses: 135 },
    { id: 21, name_arabic: "الأنبياء", name_english: "Al-Anbiya", revelation_place: "makkah", total_verses: 112 },
    { id: 22, name_arabic: "الحج", name_english: "Al-Hajj", revelation_place: "madinah", total_verses: 78 },
    { id: 23, name_arabic: "المؤمنون", name_english: "Al-Muminun", revelation_place: "makkah", total_verses: 118 },
    { id: 24, name_arabic: "النور", name_english: "An-Nur", revelation_place: "madinah", total_verses: 64 },
    { id: 25, name_arabic: "الفرقان", name_english: "Al-Furqan", revelation_place: "makkah", total_verses: 77 },
    { id: 26, name_arabic: "الشعراء", name_english: "Ash-Shuara", revelation_place: "makkah", total_verses: 227 },
    { id: 27, name_arabic: "النمل", name_english: "An-Naml", revelation_place: "makkah", total_verses: 93 },
    { id: 28, name_arabic: "القصص", name_english: "Al-Qasas", revelation_place: "makkah", total_verses: 88 },
    { id: 29, name_arabic: "العنكبوت", name_english: "Al-Ankabut", revelation_place: "makkah", total_verses: 69 },
    { id: 30, name_arabic: "الروم", name_english: "Ar-Rum", revelation_place: "makkah", total_verses: 60 },
    { id: 31, name_arabic: "لقمان", name_english: "Luqman", revelation_place: "makkah", total_verses: 34 },
    { id: 32, name_arabic: "السجدة", name_english: "As-Sajdah", revelation_place: "makkah", total_verses: 30 },
    { id: 33, name_arabic: "الأحزاب", name_english: "Al-Ahzab", revelation_place: "madinah", total_verses: 73 },
    { id: 34, name_arabic: "سبأ", name_english: "Saba", revelation_place: "makkah", total_verses: 54 },
    { id: 35, name_arabic: "فاطر", name_english: "Fatir", revelation_place: "makkah", total_verses: 45 },
    { id: 36, name_arabic: "يس", name_english: "Ya-Sin", revelation_place: "makkah", total_verses: 83 },
    { id: 37, name_arabic: "الصافات", name_english: "As-Saffat", revelation_place: "makkah", total_verses: 182 },
    { id: 38, name_arabic: "ص", name_english: "Sad", revelation_place: "makkah", total_verses: 88 },
    { id: 39, name_arabic: "الزمر", name_english: "Az-Zumar", revelation_place: "makkah", total_verses: 75 },
    { id: 40, name_arabic: "غافر", name_english: "Ghafir", revelation_place: "makkah", total_verses: 85 },
    { id: 41, name_arabic: "فصلت", name_english: "Fussilat", revelation_place: "makkah", total_verses: 54 },
    { id: 42, name_arabic: "الشورى", name_english: "Ash-Shura", revelation_place: "makkah", total_verses: 53 },
    { id: 43, name_arabic: "الزخرف", name_english: "Az-Zukhruf", revelation_place: "makkah", total_verses: 89 },
    { id: 44, name_arabic: "الدخان", name_english: "Ad-Dukhan", revelation_place: "makkah", total_verses: 59 },
    { id: 45, name_arabic: "الجاثية", name_english: "Al-Jathiyah", revelation_place: "makkah", total_verses: 37 },
    { id: 46, name_arabic: "الأحقاف", name_english: "Al-Ahqaf", revelation_place: "makkah", total_verses: 35 },
    { id: 47, name_arabic: "محمد", name_english: "Muhammad", revelation_place: "madinah", total_verses: 38 },
    { id: 48, name_arabic: "الفتح", name_english: "Al-Fath", revelation_place: "madinah", total_verses: 29 },
    { id: 49, name_arabic: "الحجرات", name_english: "Al-Hujurat", revelation_place: "madinah", total_verses: 18 },
    { id: 50, name_arabic: "ق", name_english: "Qaf", revelation_place: "makkah", total_verses: 45 },
    { id: 51, name_arabic: "الذاريات", name_english: "Adh-Dhariyat", revelation_place: "makkah", total_verses: 60 },
    { id: 52, name_arabic: "الطور", name_english: "At-Tur", revelation_place: "makkah", total_verses: 49 },
    { id: 53, name_arabic: "النجم", name_english: "An-Najm", revelation_place: "makkah", total_verses: 62 },
    { id: 54, name_arabic: "القمر", name_english: "Al-Qamar", revelation_place: "makkah", total_verses: 55 },
    { id: 55, name_arabic: "الرحمن", name_english: "Ar-Rahman", revelation_place: "madinah", total_verses: 78 },
    { id: 56, name_arabic: "الواقعة", name_english: "Al-Waqiah", revelation_place: "makkah", total_verses: 96 },
    { id: 57, name_arabic: "الحديد", name_english: "Al-Hadid", revelation_place: "madinah", total_verses: 29 },
    { id: 58, name_arabic: "المجادلة", name_english: "Al-Mujadila", revelation_place: "madinah", total_verses: 22 },
    { id: 59, name_arabic: "الحشر", name_english: "Al-Hashr", revelation_place: "madinah", total_verses: 24 },
    { id: 60, name_arabic: "الممتحنة", name_english: "Al-Mumtahanah", revelation_place: "madinah", total_verses: 13 },
    { id: 61, name_arabic: "الصف", name_english: "As-Saff", revelation_place: "madinah", total_verses: 14 },
    { id: 62, name_arabic: "الجمعة", name_english: "Al-Jumuah", revelation_place: "madinah", total_verses: 11 },
    { id: 63, name_arabic: "المنافقون", name_english: "Al-Munafiqun", revelation_place: "madinah", total_verses: 11 },
    { id: 64, name_arabic: "التغابن", name_english: "At-Taghabun", revelation_place: "madinah", total_verses: 18 },
    { id: 65, name_arabic: "الطلاق", name_english: "At-Talaq", revelation_place: "madinah", total_verses: 12 },
    { id: 66, name_arabic: "التحريم", name_english: "At-Tahrim", revelation_place: "madinah", total_verses: 12 },
    { id: 67, name_arabic: "الملك", name_english: "Al-Mulk", revelation_place: "makkah", total_verses: 30 },
    { id: 68, name_arabic: "القلم", name_english: "Al-Qalam", revelation_place: "makkah", total_verses: 52 },
    { id: 69, name_arabic: "الحاقة", name_english: "Al-Haqqah", revelation_place: "makkah", total_verses: 52 },
    { id: 70, name_arabic: "المعارج", name_english: "Al-Maarij", revelation_place: "makkah", total_verses: 44 },
    { id: 71, name_arabic: "نوح", name_english: "Nuh", revelation_place: "makkah", total_verses: 28 },
    { id: 72, name_arabic: "الجن", name_english: "Al-Jinn", revelation_place: "makkah", total_verses: 28 },
    { id: 73, name_arabic: "المزمل", name_english: "Al-Muzzammil", revelation_place: "makkah", total_verses: 20 },
    { id: 74, name_arabic: "المدثر", name_english: "Al-Muddaththir", revelation_place: "makkah", total_verses: 56 },
    { id: 75, name_arabic: "القيامة", name_english: "Al-Qiyamah", revelation_place: "makkah", total_verses: 40 },
    { id: 76, name_arabic: "الإنسان", name_english: "Al-Insan", revelation_place: "madinah", total_verses: 31 },
    { id: 77, name_arabic: "المرسلات", name_english: "Al-Mursalat", revelation_place: "makkah", total_verses: 50 },
    { id: 78, name_arabic: "النبأ", name_english: "An-Naba", revelation_place: "makkah", total_verses: 40 },
    { id: 79, name_arabic: "النازعات", name_english: "An-Naziat", revelation_place: "makkah", total_verses: 46 },
    { id: 80, name_arabic: "عبس", name_english: "Abasa", revelation_place: "makkah", total_verses: 42 },
    { id: 81, name_arabic: "التكوير", name_english: "At-Takwir", revelation_place: "makkah", total_verses: 29 },
    { id: 82, name_arabic: "الانفطار", name_english: "Al-Infitar", revelation_place: "makkah", total_verses: 19 },
    { id: 83, name_arabic: "المطففين", name_english: "Al-Mutaffifin", revelation_place: "makkah", total_verses: 36 },
    { id: 84, name_arabic: "الانشقاق", name_english: "Al-Inshiqaq", revelation_place: "makkah", total_verses: 25 },
    { id: 85, name_arabic: "البروج", name_english: "Al-Buruj", revelation_place: "makkah", total_verses: 22 },
    { id: 86, name_arabic: "الطارق", name_english: "At-Tariq", revelation_place: "makkah", total_verses: 17 },
    { id: 87, name_arabic: "الأعلى", name_english: "Al-Ala", revelation_place: "makkah", total_verses: 19 },
    { id: 88, name_arabic: "الغاشية", name_english: "Al-Ghashiyah", revelation_place: "makkah", total_verses: 26 },
    { id: 89, name_arabic: "الفجر", name_english: "Al-Fajr", revelation_place: "makkah", total_verses: 30 },
    { id: 90, name_arabic: "البلد", name_english: "Al-Balad", revelation_place: "makkah", total_verses: 20 },
    { id: 91, name_arabic: "الشمس", name_english: "Ash-Shams", revelation_place: "makkah", total_verses: 15 },
    { id: 92, name_arabic: "الليل", name_english: "Al-Layl", revelation_place: "makkah", total_verses: 21 },
    { id: 93, name_arabic: "الضحى", name_english: "Ad-Duha", revelation_place: "makkah", total_verses: 11 },
    { id: 94, name_arabic: "الشرح", name_english: "Ash-Sharh", revelation_place: "makkah", total_verses: 8 },
    { id: 95, name_arabic: "التين", name_english: "At-Tin", revelation_place: "makkah", total_verses: 8 },
    { id: 96, name_arabic: "العلق", name_english: "Al-Alaq", revelation_place: "makkah", total_verses: 19 },
    { id: 97, name_arabic: "القدر", name_english: "Al-Qadr", revelation_place: "makkah", total_verses: 5 },
    { id: 98, name_arabic: "البينة", name_english: "Al-Bayyinah", revelation_place: "madinah", total_verses: 8 },
    { id: 99, name_arabic: "الزلزلة", name_english: "Az-Zalzalah", revelation_place: "madinah", total_verses: 8 },
    { id: 100, name_arabic: "العاديات", name_english: "Al-Adiyat", revelation_place: "makkah", total_verses: 11 },
    { id: 101, name_arabic: "القارعة", name_english: "Al-Qariah", revelation_place: "makkah", total_verses: 11 },
    { id: 102, name_arabic: "التكاثر", name_english: "At-Takathur", revelation_place: "makkah", total_verses: 8 },
    { id: 103, name_arabic: "العصر", name_english: "Al-Asr", revelation_place: "makkah", total_verses: 3 },
    { id: 104, name_arabic: "الهمزة", name_english: "Al-Humazah", revelation_place: "makkah", total_verses: 9 },
    { id: 105, name_arabic: "الفيل", name_english: "Al-Fil", revelation_place: "makkah", total_verses: 5 },
    { id: 106, name_arabic: "قريش", name_english: "Quraysh", revelation_place: "makkah", total_verses: 4 },
    { id: 107, name_arabic: "الماعون", name_english: "Al-Maun", revelation_place: "makkah", total_verses: 7 },
    { id: 108, name_arabic: "الكوثر", name_english: "Al-Kawthar", revelation_place: "makkah", total_verses: 3 },
    { id: 109, name_arabic: "الكافرون", name_english: "Al-Kafirun", revelation_place: "makkah", total_verses: 6 },
    { id: 110, name_arabic: "النصر", name_english: "An-Nasr", revelation_place: "madinah", total_verses: 3 },
    { id: 111, name_arabic: "المسد", name_english: "Al-Masad", revelation_place: "makkah", total_verses: 5 },
    { id: 112, name_arabic: "الإخلاص", name_english: "Al-Ikhlas", revelation_place: "makkah", total_verses: 4 },
    { id: 113, name_arabic: "الفلق", name_english: "Al-Falaq", revelation_place: "makkah", total_verses: 5 },
    { id: 114, name_arabic: "الناس", name_english: "An-Nas", revelation_place: "makkah", total_verses: 6 },
]

export async function GET(request: NextRequest) {
    // Check for admin secret
    const adminSecret = request.nextUrl.searchParams.get('secret')
    if (adminSecret !== 'MEEK-setup-2024') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    })

    const results = {
        surahs: { inserted: 0, errors: [] as string[] },
        storage: { created: false, error: null as string | null }
    }

    // Insert all 114 surahs
    for (const surah of ALL_SURAHS) {
        const { error } = await supabase
            .from('quran_surahs')
            .upsert(surah, { onConflict: 'id' })

        if (error) {
            results.surahs.errors.push(`Surah ${surah.id}: ${error.message}`)
        } else {
            results.surahs.inserted++
        }
    }

    // Create storage bucket
    const { error: bucketError } = await supabase.storage.createBucket('quran-recordings', {
        public: false
    })

    if (bucketError) {
        if (bucketError.message.includes('already exists')) {
            results.storage.created = true
        } else {
            results.storage.error = bucketError.message
        }
    } else {
        results.storage.created = true
    }

    // Verify
    const { data: countData } = await supabase
        .from('quran_surahs')
        .select('id')

    return NextResponse.json({
        success: true,
        message: 'Database setup complete',
        surahs: {
            inserted: results.surahs.inserted,
            total_in_db: countData?.length || 0,
            errors: results.surahs.errors.length > 0 ? results.surahs.errors.slice(0, 5) : []
        },
        storage: results.storage
    })
}

