/**
 * Complete list of all 114 Surahs in the Quran
 * This serves as the single source of truth for surah data
 */

export interface SurahInfo {
    id: number;
    name: string;
    nameArabic: string;
    type: "Meccan" | "Medinan";
    verses: number;
}

export const ALL_114_SURAHS: SurahInfo[] = [
    { id: 1, name: "Al-Fatiha", nameArabic: "الفاتحة", type: "Meccan", verses: 7 },
    { id: 2, name: "Al-Baqarah", nameArabic: "البقرة", type: "Medinan", verses: 286 },
    { id: 3, name: "Aal-E-Imran", nameArabic: "آل عمران", type: "Medinan", verses: 200 },
    { id: 4, name: "An-Nisa", nameArabic: "النساء", type: "Medinan", verses: 176 },
    { id: 5, name: "Al-Ma'idah", nameArabic: "المائدة", type: "Medinan", verses: 120 },
    { id: 6, name: "Al-An'am", nameArabic: "الأنعام", type: "Meccan", verses: 165 },
    { id: 7, name: "Al-A'raf", nameArabic: "الأعراف", type: "Meccan", verses: 206 },
    { id: 8, name: "Al-Anfal", nameArabic: "الأنفال", type: "Medinan", verses: 75 },
    { id: 9, name: "At-Tawbah", nameArabic: "التوبة", type: "Medinan", verses: 129 },
    { id: 10, name: "Yunus", nameArabic: "يونس", type: "Meccan", verses: 109 },
    { id: 11, name: "Hud", nameArabic: "هود", type: "Meccan", verses: 123 },
    { id: 12, name: "Yusuf", nameArabic: "يوسف", type: "Meccan", verses: 111 },
    { id: 13, name: "Ar-Ra'd", nameArabic: "الرعد", type: "Medinan", verses: 43 },
    { id: 14, name: "Ibrahim", nameArabic: "إبراهيم", type: "Meccan", verses: 52 },
    { id: 15, name: "Al-Hijr", nameArabic: "الحجر", type: "Meccan", verses: 99 },
    { id: 16, name: "An-Nahl", nameArabic: "النحل", type: "Meccan", verses: 128 },
    { id: 17, name: "Al-Isra", nameArabic: "الإسراء", type: "Meccan", verses: 111 },
    { id: 18, name: "Al-Kahf", nameArabic: "الكهف", type: "Meccan", verses: 110 },
    { id: 19, name: "Maryam", nameArabic: "مريم", type: "Meccan", verses: 98 },
    { id: 20, name: "Ta-Ha", nameArabic: "طه", type: "Meccan", verses: 135 },
    { id: 21, name: "Al-Anbiya", nameArabic: "الأنبياء", type: "Meccan", verses: 112 },
    { id: 22, name: "Al-Hajj", nameArabic: "الحج", type: "Medinan", verses: 78 },
    { id: 23, name: "Al-Mu'minun", nameArabic: "المؤمنون", type: "Meccan", verses: 118 },
    { id: 24, name: "An-Nur", nameArabic: "النور", type: "Medinan", verses: 64 },
    { id: 25, name: "Al-Furqan", nameArabic: "الفرقان", type: "Meccan", verses: 77 },
    { id: 26, name: "Ash-Shu'ara", nameArabic: "الشعراء", type: "Meccan", verses: 227 },
    { id: 27, name: "An-Naml", nameArabic: "النمل", type: "Meccan", verses: 93 },
    { id: 28, name: "Al-Qasas", nameArabic: "القصص", type: "Meccan", verses: 88 },
    { id: 29, name: "Al-Ankabut", nameArabic: "العنكبوت", type: "Meccan", verses: 69 },
    { id: 30, name: "Ar-Rum", nameArabic: "الروم", type: "Meccan", verses: 60 },
    { id: 31, name: "Luqman", nameArabic: "لقمان", type: "Meccan", verses: 34 },
    { id: 32, name: "As-Sajdah", nameArabic: "السجدة", type: "Meccan", verses: 30 },
    { id: 33, name: "Al-Ahzab", nameArabic: "الأحزاب", type: "Medinan", verses: 73 },
    { id: 34, name: "Saba", nameArabic: "سبأ", type: "Meccan", verses: 54 },
    { id: 35, name: "Fatir", nameArabic: "فاطر", type: "Meccan", verses: 45 },
    { id: 36, name: "Ya-Sin", nameArabic: "يس", type: "Meccan", verses: 83 },
    { id: 37, name: "As-Saffat", nameArabic: "الصافات", type: "Meccan", verses: 182 },
    { id: 38, name: "Sad", nameArabic: "ص", type: "Meccan", verses: 88 },
    { id: 39, name: "Az-Zumar", nameArabic: "الزمر", type: "Meccan", verses: 75 },
    { id: 40, name: "Ghafir", nameArabic: "غافر", type: "Meccan", verses: 85 },
    { id: 41, name: "Fussilat", nameArabic: "فصلت", type: "Meccan", verses: 54 },
    { id: 42, name: "Ash-Shura", nameArabic: "الشورى", type: "Meccan", verses: 53 },
    { id: 43, name: "Az-Zukhruf", nameArabic: "الزخرف", type: "Meccan", verses: 89 },
    { id: 44, name: "Ad-Dukhan", nameArabic: "الدخان", type: "Meccan", verses: 59 },
    { id: 45, name: "Al-Jathiyah", nameArabic: "الجاثية", type: "Meccan", verses: 37 },
    { id: 46, name: "Al-Ahqaf", nameArabic: "الأحقاف", type: "Meccan", verses: 35 },
    { id: 47, name: "Muhammad", nameArabic: "محمد", type: "Medinan", verses: 38 },
    { id: 48, name: "Al-Fath", nameArabic: "الفتح", type: "Medinan", verses: 29 },
    { id: 49, name: "Al-Hujurat", nameArabic: "الحجرات", type: "Medinan", verses: 18 },
    { id: 50, name: "Qaf", nameArabic: "ق", type: "Meccan", verses: 45 },
    { id: 51, name: "Adh-Dhariyat", nameArabic: "الذاريات", type: "Meccan", verses: 60 },
    { id: 52, name: "At-Tur", nameArabic: "الطور", type: "Meccan", verses: 49 },
    { id: 53, name: "An-Najm", nameArabic: "النجم", type: "Meccan", verses: 62 },
    { id: 54, name: "Al-Qamar", nameArabic: "القمر", type: "Meccan", verses: 55 },
    { id: 55, name: "Ar-Rahman", nameArabic: "الرحمن", type: "Medinan", verses: 78 },
    { id: 56, name: "Al-Waqi'ah", nameArabic: "الواقعة", type: "Meccan", verses: 96 },
    { id: 57, name: "Al-Hadid", nameArabic: "الحديد", type: "Medinan", verses: 29 },
    { id: 58, name: "Al-Mujadila", nameArabic: "المجادلة", type: "Medinan", verses: 22 },
    { id: 59, name: "Al-Hashr", nameArabic: "الحشر", type: "Medinan", verses: 24 },
    { id: 60, name: "Al-Mumtahanah", nameArabic: "الممتحنة", type: "Medinan", verses: 13 },
    { id: 61, name: "As-Saff", nameArabic: "الصف", type: "Medinan", verses: 14 },
    { id: 62, name: "Al-Jumu'ah", nameArabic: "الجمعة", type: "Medinan", verses: 11 },
    { id: 63, name: "Al-Munafiqun", nameArabic: "المنافقون", type: "Medinan", verses: 11 },
    { id: 64, name: "At-Taghabun", nameArabic: "التغابن", type: "Medinan", verses: 18 },
    { id: 65, name: "At-Talaq", nameArabic: "الطلاق", type: "Medinan", verses: 12 },
    { id: 66, name: "At-Tahrim", nameArabic: "التحريم", type: "Medinan", verses: 12 },
    { id: 67, name: "Al-Mulk", nameArabic: "الملك", type: "Meccan", verses: 30 },
    { id: 68, name: "Al-Qalam", nameArabic: "القلم", type: "Meccan", verses: 52 },
    { id: 69, name: "Al-Haqqah", nameArabic: "الحاقة", type: "Meccan", verses: 52 },
    { id: 70, name: "Al-Ma'arij", nameArabic: "المعارج", type: "Meccan", verses: 44 },
    { id: 71, name: "Nuh", nameArabic: "نوح", type: "Meccan", verses: 28 },
    { id: 72, name: "Al-Jinn", nameArabic: "الجن", type: "Meccan", verses: 28 },
    { id: 73, name: "Al-Muzzammil", nameArabic: "المزمل", type: "Meccan", verses: 20 },
    { id: 74, name: "Al-Muddaththir", nameArabic: "المدثر", type: "Meccan", verses: 56 },
    { id: 75, name: "Al-Qiyamah", nameArabic: "القيامة", type: "Meccan", verses: 40 },
    { id: 76, name: "Al-Insan", nameArabic: "الإنسان", type: "Medinan", verses: 31 },
    { id: 77, name: "Al-Mursalat", nameArabic: "المرسلات", type: "Meccan", verses: 50 },
    { id: 78, name: "An-Naba", nameArabic: "النبأ", type: "Meccan", verses: 40 },
    { id: 79, name: "An-Nazi'at", nameArabic: "النازعات", type: "Meccan", verses: 46 },
    { id: 80, name: "Abasa", nameArabic: "عبس", type: "Meccan", verses: 42 },
    { id: 81, name: "At-Takwir", nameArabic: "التكوير", type: "Meccan", verses: 29 },
    { id: 82, name: "Al-Infitar", nameArabic: "الانفطار", type: "Meccan", verses: 19 },
    { id: 83, name: "Al-Mutaffifin", nameArabic: "المطففين", type: "Meccan", verses: 36 },
    { id: 84, name: "Al-Inshiqaq", nameArabic: "الانشقاق", type: "Meccan", verses: 25 },
    { id: 85, name: "Al-Buruj", nameArabic: "البروج", type: "Meccan", verses: 22 },
    { id: 86, name: "At-Tariq", nameArabic: "الطارق", type: "Meccan", verses: 17 },
    { id: 87, name: "Al-A'la", nameArabic: "الأعلى", type: "Meccan", verses: 19 },
    { id: 88, name: "Al-Ghashiyah", nameArabic: "الغاشية", type: "Meccan", verses: 26 },
    { id: 89, name: "Al-Fajr", nameArabic: "الفجر", type: "Meccan", verses: 30 },
    { id: 90, name: "Al-Balad", nameArabic: "البلد", type: "Meccan", verses: 20 },
    { id: 91, name: "Ash-Shams", nameArabic: "الشمس", type: "Meccan", verses: 15 },
    { id: 92, name: "Al-Layl", nameArabic: "الليل", type: "Meccan", verses: 21 },
    { id: 93, name: "Ad-Duha", nameArabic: "الضحى", type: "Meccan", verses: 11 },
    { id: 94, name: "Ash-Sharh", nameArabic: "الشرح", type: "Meccan", verses: 8 },
    { id: 95, name: "At-Tin", nameArabic: "التين", type: "Meccan", verses: 8 },
    { id: 96, name: "Al-Alaq", nameArabic: "العلق", type: "Meccan", verses: 19 },
    { id: 97, name: "Al-Qadr", nameArabic: "القدر", type: "Meccan", verses: 5 },
    { id: 98, name: "Al-Bayyinah", nameArabic: "البينة", type: "Medinan", verses: 8 },
    { id: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", type: "Medinan", verses: 8 },
    { id: 100, name: "Al-Adiyat", nameArabic: "العاديات", type: "Meccan", verses: 11 },
    { id: 101, name: "Al-Qari'ah", nameArabic: "القارعة", type: "Meccan", verses: 11 },
    { id: 102, name: "At-Takathur", nameArabic: "التكاثر", type: "Meccan", verses: 8 },
    { id: 103, name: "Al-Asr", nameArabic: "العصر", type: "Meccan", verses: 3 },
    { id: 104, name: "Al-Humazah", nameArabic: "الهمزة", type: "Meccan", verses: 9 },
    { id: 105, name: "Al-Fil", nameArabic: "الفيل", type: "Meccan", verses: 5 },
    { id: 106, name: "Quraysh", nameArabic: "قريش", type: "Meccan", verses: 4 },
    { id: 107, name: "Al-Ma'un", nameArabic: "الماعون", type: "Meccan", verses: 7 },
    { id: 108, name: "Al-Kawthar", nameArabic: "الكوثر", type: "Meccan", verses: 3 },
    { id: 109, name: "Al-Kafirun", nameArabic: "الكافرون", type: "Meccan", verses: 6 },
    { id: 110, name: "An-Nasr", nameArabic: "النصر", type: "Medinan", verses: 3 },
    { id: 111, name: "Al-Masad", nameArabic: "المسد", type: "Meccan", verses: 5 },
    { id: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", type: "Meccan", verses: 4 },
    { id: 113, name: "Al-Falaq", nameArabic: "الفلق", type: "Meccan", verses: 5 },
    { id: 114, name: "An-Nas", nameArabic: "الناس", type: "Meccan", verses: 6 },
];

/**
 * Get a surah by ID
 */
export function getSurahById(id: number): SurahInfo | undefined {
    return ALL_114_SURAHS.find(s => s.id === id);
}

/**
 * Search surahs by name or number
 */
export function searchSurahs(query: string): SurahInfo[] {
    const lowerQuery = query.toLowerCase();
    return ALL_114_SURAHS.filter(s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.nameArabic.includes(query) ||
        s.id.toString().includes(query)
    );
}
