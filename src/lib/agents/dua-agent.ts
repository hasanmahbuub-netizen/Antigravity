/**
 * Dua Agent - Spiritual Companion
 * 
 * Provides contextual duas based on time of day, with caring,
 * non-preachy messaging. Designed to feel like a gentle friend,
 * not an interruption.
 * 
 * @module lib/agents/dua-agent
 */

export interface Dua {
    id: string;
    arabic: string;
    transliteration: string;
    english: string;
    context: string;
    source: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
}

export interface SpiritualNudge {
    id: string;
    type: 'dua' | 'reminder' | 'encouragement';
    message: string;
    dua?: Dua;
    timing: string;
    icon: string;
}

// Curated collection of authentic duas with emotional framing
const DUAS: Dua[] = [
    // MORNING DUAS
    {
        id: 'morning-1',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
        transliteration: 'Asbahna wa asbahal mulku lillah',
        english: 'We have entered the morning and at this very time the whole kingdom belongs to Allah.',
        context: 'Start your day acknowledging who truly owns everything.',
        source: 'Muslim',
        timeOfDay: 'morning'
    },
    {
        id: 'morning-2',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',
        transliteration: 'Allahumma bika asbahna wa bika amsayna',
        english: 'O Allah, by You we enter the morning and by You we enter the evening.',
        context: 'A reminder that every transition is through His will.',
        source: 'Tirmidhi',
        timeOfDay: 'morning'
    },
    {
        id: 'morning-protection',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un",
        english: 'In the name of Allah, with whose name nothing can cause harm.',
        context: 'Protection for your entire day, takes just 5 seconds.',
        source: 'Abu Dawud',
        timeOfDay: 'morning'
    },

    // EVENING DUAS
    {
        id: 'evening-1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
        transliteration: 'Amsayna wa amsal mulku lillah',
        english: 'We have entered the evening and at this very time the whole kingdom belongs to Allah.',
        context: 'As the sun sets, remember the One who set it.',
        source: 'Muslim',
        timeOfDay: 'evening'
    },
    {
        id: 'evening-reflection',
        arabic: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ فَمِنْكَ',
        transliteration: 'Allahumma ma amsa bi min ni\'matin fa minka',
        english: 'O Allah, whatever blessing I have received is from You alone.',
        context: 'Gratitude transforms the ordinary into gifts.',
        source: 'Abu Dawud',
        timeOfDay: 'evening'
    },

    // NIGHT DUAS
    {
        id: 'night-sleep',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        english: 'In Your name, O Allah, I die and I live.',
        context: 'Sleep is a small death. Wake is a small resurrection.',
        source: 'Bukhari',
        timeOfDay: 'night'
    },
    {
        id: 'night-forgiveness',
        arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        transliteration: 'Astaghfirullaha wa atubu ilayh',
        english: 'I seek the forgiveness of Allah and repent to Him.',
        context: 'End your day with a clean slate. Tomorrow is a gift.',
        source: 'Bukhari & Muslim',
        timeOfDay: 'night'
    },
    {
        id: 'night-peace',
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        transliteration: 'Allahumma qini adhabaka yawma tab\'athu ibadak',
        english: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
        context: 'The Prophet ﷺ would say this before sleeping.',
        source: 'Abu Dawud',
        timeOfDay: 'night'
    }
];

// Caring, Duolingo-style message templates
const NUDGE_TEMPLATES = {
    morning: [
        { message: "A new day begins. This dua of protection takes just 5 seconds. 🌅", icon: "🌅" },
        { message: "The morning belongs to those who greet it with gratitude. ✨", icon: "✨" },
        { message: "Before the world rushes in, here's a moment of peace. 🕊️", icon: "🕊️" },
    ],
    afternoon: [
        { message: "Taking a breath? Here's a short reminder. 🌤️", icon: "🌤️" },
        { message: "Midday pause. One small dua, one moment of connection. ☀️", icon: "☀️" },
    ],
    evening: [
        { message: "The sun is setting. So is the rush. Pause with this. 🌇", icon: "🌇" },
        { message: "Evening light calls for evening gratitude. 🧡", icon: "🧡" },
    ],
    night: [
        { message: "End your day with one small prayer. Let your heart rest. 🌙", icon: "🌙" },
        { message: "Before sleep, a moment with the One who never sleeps. 💫", icon: "💫" },
        { message: "The night is quiet. Even one verse brings peace. ✨", icon: "✨" },
    ]
};

/**
 * Get the current time of day category
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
}

/**
 * Get a contextual dua based on current time
 */
export function getContextualDua(): Dua {
    const timeOfDay = getTimeOfDay();
    const relevantDuas = DUAS.filter(d => d.timeOfDay === timeOfDay || d.timeOfDay === 'any');

    // Return a random relevant dua
    const index = Math.floor(Math.random() * relevantDuas.length);
    return relevantDuas[index] || DUAS[0];
}

/**
 * Get a spiritual nudge with caring messaging
 */
export function getSpiritualNudge(): SpiritualNudge {
    const timeOfDay = getTimeOfDay();
    const dua = getContextualDua();
    const templates = NUDGE_TEMPLATES[timeOfDay];
    const template = templates[Math.floor(Math.random() * templates.length)];

    return {
        id: `nudge-${Date.now()}`,
        type: 'dua',
        message: template.message,
        dua,
        timing: getNudgeTiming(),
        icon: template.icon
    };
}

/**
 * Get human-readable timing
 */
function getNudgeTiming(): string {
    const timeOfDay = getTimeOfDay();
    const hour = new Date().getHours();

    if (timeOfDay === 'morning') return 'Morning reminder';
    if (timeOfDay === 'afternoon') return 'Afternoon pause';
    if (timeOfDay === 'evening') return 'Evening reflection';
    if (hour >= 22) return 'Before sleep';
    return 'Night reminder';
}

/**
 * Get all duas for a specific time (for settings/preview)
 */
export function getDuasByTime(time: 'morning' | 'afternoon' | 'evening' | 'night'): Dua[] {
    return DUAS.filter(d => d.timeOfDay === time || d.timeOfDay === 'any');
}
