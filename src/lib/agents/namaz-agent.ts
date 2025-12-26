/**
 * Namaz (Prayer Times) Agent
 * 
 * Fetches and caches prayer times using the free Aladhan API.
 * Provides contextual reminders with caring, non-preachy messaging.
 * 
 * @module lib/agents/namaz-agent
 */

export interface PrayerTime {
    name: string;
    arabicName: string;
    time: string;
    timestamp: number;
}

export interface PrayerTimes {
    fajr: PrayerTime;
    sunrise: PrayerTime;
    dhuhr: PrayerTime;
    asr: PrayerTime;
    maghrib: PrayerTime;
    isha: PrayerTime;
    date: string;
    location: string;
    timezone: string;
}

export interface PrayerReminder {
    prayer: PrayerTime;
    message: string;
    icon: string;
    minutesUntil: number;
    status: 'upcoming' | 'now' | 'passed';
}

// Cache for prayer times (avoids repeated API calls)
let cachedPrayerTimes: PrayerTimes | null = null;
let cacheDate: string | null = null;

// Caring reminder messages for each prayer
const PRAYER_MESSAGES = {
    fajr: [
        { message: "Fajr is near. The world is still sleeping, but your heart is awake. 🌅", icon: "🌅" },
        { message: "The dawn prayer awaits. Just a few moments of peace before the day. ✨", icon: "✨" },
    ],
    sunrise: [
        { message: "The sun rises. A new day, a new chance. ☀️", icon: "☀️" },
    ],
    dhuhr: [
        { message: "Dhuhr is approaching. A pause in the middle of your day. 🕐", icon: "🕐" },
        { message: "Midday prayer time. Your body is busy, give your soul a moment. 🤲", icon: "🤲" },
    ],
    asr: [
        { message: "Asr is near. The afternoon calls for presence. 🌤️", icon: "🌤️" },
        { message: "Asr is approaching. Your prayer mat misses you. 🕌", icon: "🕌" },
    ],
    maghrib: [
        { message: "Maghrib time. The sun bows, and so do we. 🌇", icon: "🌇" },
        { message: "The day ends with gratitude. Maghrib awaits. 🧡", icon: "🧡" },
    ],
    isha: [
        { message: "Isha is near. End your day in conversation with Him. 🌙", icon: "🌙" },
        { message: "The night prayer approaches. One last connection before sleep. 💫", icon: "💫" },
    ],
};

/**
 * Parse time string (HH:MM) to timestamp for today
 */
function parseTimeToTimestamp(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
}

/**
 * Fetch prayer times from Aladhan API
 * Uses geolocation if available, otherwise defaults to Dhaka
 * 
 * Calculation Methods:
 * 1 = University of Islamic Sciences, Karachi
 * 2 = Islamic Society of North America (ISNA)
 * 3 = Muslim World League (SAFE - moderate across madhabs)
 * 4 = Umm Al-Qura University, Makkah
 * 5 = Egyptian General Authority of Survey
 */
export async function fetchPrayerTimes(
    latitude: number = 23.8103,  // Default: Dhaka
    longitude: number = 90.4125,
    method: number = 3  // Muslim World League - safe/moderate calculation
): Promise<PrayerTimes> {
    const today = new Date().toISOString().split('T')[0];

    // Return cached data if available for today
    if (cachedPrayerTimes && cacheDate === today) {
        return cachedPrayerTimes;
    }

    try {
        const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`,
            {
                headers: { 'Accept': 'application/json' },
                next: { revalidate: 3600 } // Cache for 1 hour in Next.js
            }
        );

        if (!response.ok) {
            throw new Error('Prayer times API failed');
        }

        const data = await response.json();
        const timings = data.data.timings;
        const meta = data.data.meta;

        const prayerTimes: PrayerTimes = {
            fajr: {
                name: 'Fajr',
                arabicName: 'الفجر',
                time: timings.Fajr,
                timestamp: parseTimeToTimestamp(timings.Fajr)
            },
            sunrise: {
                name: 'Sunrise',
                arabicName: 'الشروق',
                time: timings.Sunrise,
                timestamp: parseTimeToTimestamp(timings.Sunrise)
            },
            dhuhr: {
                name: 'Dhuhr',
                arabicName: 'الظهر',
                time: timings.Dhuhr,
                timestamp: parseTimeToTimestamp(timings.Dhuhr)
            },
            asr: {
                name: 'Asr',
                arabicName: 'العصر',
                time: timings.Asr,
                timestamp: parseTimeToTimestamp(timings.Asr)
            },
            maghrib: {
                name: 'Maghrib',
                arabicName: 'المغرب',
                time: timings.Maghrib,
                timestamp: parseTimeToTimestamp(timings.Maghrib)
            },
            isha: {
                name: 'Isha',
                arabicName: 'العشاء',
                time: timings.Isha,
                timestamp: parseTimeToTimestamp(timings.Isha)
            },
            date: today,
            location: meta.timezone,
            timezone: meta.timezone
        };

        // Cache the result
        cachedPrayerTimes = prayerTimes;
        cacheDate = today;

        return prayerTimes;
    } catch (error) {
        console.error('Failed to fetch prayer times:', error);

        // Return fallback times (approximate for Dhaka)
        return getFallbackPrayerTimes();
    }
}

/**
 * Fallback prayer times when API is unavailable
 */
function getFallbackPrayerTimes(): PrayerTimes {
    const today = new Date().toISOString().split('T')[0];

    return {
        fajr: { name: 'Fajr', arabicName: 'الفجر', time: '05:15', timestamp: parseTimeToTimestamp('05:15') },
        sunrise: { name: 'Sunrise', arabicName: 'الشروق', time: '06:30', timestamp: parseTimeToTimestamp('06:30') },
        dhuhr: { name: 'Dhuhr', arabicName: 'الظهر', time: '12:15', timestamp: parseTimeToTimestamp('12:15') },
        asr: { name: 'Asr', arabicName: 'العصر', time: '15:45', timestamp: parseTimeToTimestamp('15:45') },
        maghrib: { name: 'Maghrib', arabicName: 'المغرب', time: '17:45', timestamp: parseTimeToTimestamp('17:45') },
        isha: { name: 'Isha', arabicName: 'العشاء', time: '19:00', timestamp: parseTimeToTimestamp('19:00') },
        date: today,
        location: 'Dhaka (Offline)',
        timezone: 'Asia/Dhaka'
    };
}

/**
 * Get the next prayer with time remaining
 */
export async function getNextPrayer(): Promise<PrayerReminder | null> {
    const times = await fetchPrayerTimes();
    const now = Date.now();

    const prayers: [keyof typeof PRAYER_MESSAGES, PrayerTime][] = [
        ['fajr', times.fajr],
        ['dhuhr', times.dhuhr],
        ['asr', times.asr],
        ['maghrib', times.maghrib],
        ['isha', times.isha],
    ];

    for (const [key, prayer] of prayers) {
        const diff = prayer.timestamp - now;
        const minutesUntil = Math.floor(diff / 60000);

        if (minutesUntil > -30 && minutesUntil <= 60) {
            // Prayer is within -30 to +60 minutes window
            const messages = PRAYER_MESSAGES[key];
            const template = messages[Math.floor(Math.random() * messages.length)];

            let status: 'upcoming' | 'now' | 'passed' = 'upcoming';
            if (minutesUntil <= 0 && minutesUntil > -30) status = 'now';
            else if (minutesUntil < 0) status = 'passed';

            return {
                prayer,
                message: template.message,
                icon: template.icon,
                minutesUntil: Math.abs(minutesUntil),
                status
            };
        }
    }

    // Find the next upcoming prayer
    for (const [key, prayer] of prayers) {
        if (prayer.timestamp > now) {
            const minutesUntil = Math.floor((prayer.timestamp - now) / 60000);
            const messages = PRAYER_MESSAGES[key];
            const template = messages[Math.floor(Math.random() * messages.length)];

            return {
                prayer,
                message: template.message,
                icon: template.icon,
                minutesUntil,
                status: 'upcoming'
            };
        }
    }

    // All prayers passed, return first prayer for tomorrow
    const messages = PRAYER_MESSAGES.fajr;
    const template = messages[0];

    return {
        prayer: times.fajr,
        message: "Fajr tomorrow. Rest well, and wake with purpose. 🌙",
        icon: "🌙",
        minutesUntil: 0,
        status: 'upcoming'
    };
}

/**
 * Format minutes into human-readable string
 */
export function formatTimeUntil(minutes: number): string {
    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Get all prayer times for display
 */
export async function getAllPrayerTimes(): Promise<PrayerTimes> {
    return fetchPrayerTimes();
}

export interface CurrentPrayerInfo {
    current: {
        name: string;
        arabicName: string;
        startTime: string;
        minutesRemaining: number;
    } | null;
    next: {
        name: string;
        arabicName: string;
        time: string;
        minutesUntil: number;
    } | null;
}

/**
 * Get current prayer window and next prayer info
 * Shows which prayer window we're currently in and how long until next
 */
export async function getCurrentPrayer(): Promise<CurrentPrayerInfo> {
    const times = await fetchPrayerTimes();
    const now = Date.now();
    
    const prayerSequence: [string, PrayerTime, PrayerTime][] = [
        ['Fajr', times.fajr, times.sunrise],
        ['Dhuhr', times.dhuhr, times.asr],
        ['Asr', times.asr, times.maghrib],
        ['Maghrib', times.maghrib, times.isha],
        ['Isha', times.isha, times.fajr], // Isha until Fajr (next day)
    ];
    
    let current: CurrentPrayerInfo['current'] = null;
    let next: CurrentPrayerInfo['next'] = null;
    
    for (let i = 0; i < prayerSequence.length; i++) {
        const [name, startPrayer, endPrayer] = prayerSequence[i];
        const startTime = startPrayer.timestamp;
        let endTime = endPrayer.timestamp;
        
        // Handle Isha to Fajr (crosses midnight)
        if (name === 'Isha' && endTime < startTime) {
            endTime += 24 * 60 * 60 * 1000; // Add 24 hours
        }
        
        if (now >= startTime && now < endTime) {
            const minutesRemaining = Math.floor((endTime - now) / 60000);
            current = {
                name,
                arabicName: startPrayer.arabicName,
                startTime: startPrayer.time,
                minutesRemaining
            };
            
            // Get next prayer
            const nextIndex = (i + 1) % prayerSequence.length;
            const [nextName, nextPrayer] = prayerSequence[nextIndex];
            let nextTime = nextPrayer.timestamp;
            if (nextTime < now) nextTime += 24 * 60 * 60 * 1000;
            
            next = {
                name: nextName,
                arabicName: nextPrayer.arabicName,
                time: nextPrayer.time,
                minutesUntil: Math.floor((nextTime - now) / 60000)
            };
            
            break;
        }
    }
    
    // If no current prayer found, we're between Sunrise and Dhuhr (no prayer window)
    if (!current) {
        // Find next prayer
        const prayers = [times.dhuhr, times.asr, times.maghrib, times.isha, times.fajr];
        for (const prayer of prayers) {
            let prayerTime = prayer.timestamp;
            if (prayerTime < now) prayerTime += 24 * 60 * 60 * 1000;
            
            if (prayerTime > now) {
                next = {
                    name: prayer.name,
                    arabicName: prayer.arabicName,
                    time: prayer.time,
                    minutesUntil: Math.floor((prayerTime - now) / 60000)
                };
                break;
            }
        }
    }
    
    return { current, next };
}
