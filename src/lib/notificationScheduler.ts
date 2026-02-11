/**
 * Self-Contained Notification Scheduler
 * 
 * REWRITTEN: No server API dependency. Calculates prayer times directly
 * using the Aladhan API and schedules notifications client-side.
 * This works reliably without VAPID keys, server-side cron, or database lookups.
 */

const PRAYER_MESSAGES: Record<string, string[]> = {
    Fajr: [
        "⏰ Fajr has started! Begin your day with prayer 🌅",
        "🌅 Fajr time! Your morning prayer awaits",
        "⚡ Fajr is here! Start strong today",
    ],
    Dhuhr: [
        "🕐 Dhuhr time! Take a break and pray",
        "☀️ Dhuhr has started! Your midday blessing",
        "🕌 Time for Dhuhr — refresh your spirit",
    ],
    Asr: [
        "🌤️ Asr is here! Afternoon prayer time",
        "⏰ Asr has started! Don't let the afternoon slip by",
        "🕌 Time for Asr — a powerful afternoon prayer",
    ],
    Maghrib: [
        "🌆 Maghrib time! The sun is setting",
        "🕌 Maghrib has started! Sunset prayer awaits",
        "⏰ Maghrib is here — pray before it passes",
    ],
    Isha: [
        "🌙 Isha time! Your night prayer has begun",
        "⭐ Isha has started! End your day right",
        "🕌 Time for Isha — your final prayer today",
    ],
};

const ENDING_MESSAGES = [
    "⏳ Only 20 minutes left for {prayer}! Don't miss it",
    "🚨 {prayer} ends in 20 minutes — pray now!",
    "⏰ {prayer} is almost over! 20 minutes remaining",
];

const DUA_MESSAGES: Record<string, string[]> = {
    morning: [
        "🌅 Good morning! Start with your morning duas",
        "✨ Morning blessing time — read your duas",
    ],
    midday: [
        "☀️ Midday reset! Take a moment for duas",
        "🎯 Afternoon duas — recharge your spirit",
    ],
    evening: [
        "🌆 Evening reflection time — read your duas",
        "💜 Wind down with evening duas",
    ],
    night: [
        "🌙 Before sleep — read your night duas",
        "⭐ End your day with night duas",
    ],
};

function randomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
}

interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

let schedulerActive = false;
let checkInterval: ReturnType<typeof setInterval> | null = null;
let cachedPrayerTimes: PrayerTimes | null = null;
let cacheDate: string | null = null;

/**
 * Fetch prayer times from Aladhan API
 */
async function fetchPrayerTimes(latitude: number, longitude: number): Promise<PrayerTimes> {
    const today = new Date().toDateString();

    // Return cached if same day
    if (cachedPrayerTimes && cacheDate === today) {
        return cachedPrayerTimes;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=3&school=1`
    );
    const data = await response.json();
    const timings = data.data.timings;

    cachedPrayerTimes = {
        Fajr: timings.Fajr,
        Sunrise: timings.Sunrise,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
    };
    cacheDate = today;

    return cachedPrayerTimes;
}

/**
 * Convert "HH:MM" to today's timestamp
 */
function timeToTimestamp(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.getTime();
}

/**
 * Get user's location (with Dhaka fallback)
 */
function getUserLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve) => {
        if (!('geolocation' in navigator)) {
            resolve({ lat: 23.8103, lon: 90.4125 }); // Dhaka
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => resolve({ lat: 23.8103, lon: 90.4125 }), // Dhaka fallback
            { timeout: 5000, maximumAge: 3600000 } // Cache for 1 hour
        );
    });
}

/**
 * Get sent notification IDs for today
 */
function getSentIds(): Set<string> {
    try {
        const key = `meek_sent_${new Date().toDateString()}`;
        const data = localStorage.getItem(key);
        return data ? new Set(JSON.parse(data)) : new Set();
    } catch {
        return new Set();
    }
}

/**
 * Mark a notification as sent
 */
function markSent(id: string) {
    try {
        const key = `meek_sent_${new Date().toDateString()}`;
        const sent = getSentIds();
        sent.add(id);
        localStorage.setItem(key, JSON.stringify([...sent]));
    } catch {
        // localStorage not available
    }
}

/**
 * Show a notification via Service Worker (or fallback to Notification API)
 */
async function showNotification(title: string, body: string, tag: string) {
    if (Notification.permission !== 'granted') return;

    try {
        // Try Service Worker first (works when app is backgrounded)
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, {
                body,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                tag,
                requireInteraction: true,
                data: { url: '/dashboard' },
            });
            return;
        }
    } catch {
        // Fallback to Notification API
    }

    // Direct Notification API fallback
    const notification = new Notification(title, {
        body,
        icon: '/icon-192.png',
        tag,
    });
    setTimeout(() => notification.close(), 15000);
}

/**
 * Check all scheduled notifications and fire any that are due
 */
async function checkNotifications() {
    const now = Date.now();
    const today = new Date().toDateString();
    const sentIds = getSentIds();

    try {
        const loc = await getUserLocation();
        const times = await fetchPrayerTimes(loc.lat, loc.lon);
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

        // Prayer end times (next prayer = end of current)
        const endTimeMap: Record<string, string> = {
            Fajr: times.Sunrise,
            Dhuhr: times.Asr,
            Asr: times.Maghrib,
            Maghrib: times.Isha,
            Isha: '23:59', // Isha ends at midnight for notification purposes
        };

        // Check prayer start notifications
        for (const prayer of prayers) {
            const prayerTime = timeToTimestamp(times[prayer]);
            const startId = `start-${prayer}-${today}`;

            // Fire if within 2 minutes of prayer start and not already sent
            if (!sentIds.has(startId) && now >= prayerTime && now - prayerTime < 120000) {
                const messages = PRAYER_MESSAGES[prayer] || [`${prayer} time! 🕌`];
                await showNotification(`${prayer} Time! 🕌`, randomMessage(messages), `prayer-${prayer}`);
                markSent(startId);
            }

            // Check prayer ending notification (20 min before end)
            const endTime = timeToTimestamp(endTimeMap[prayer]);
            const warningTime = endTime - 20 * 60 * 1000;
            const endId = `ending-${prayer}-${today}`;

            if (!sentIds.has(endId) && now >= warningTime && now - warningTime < 120000) {
                const msg = randomMessage(ENDING_MESSAGES).replace(/{prayer}/g, prayer);
                await showNotification(`⏰ ${prayer} Ending Soon`, msg, `ending-${prayer}`);
                markSent(endId);
            }
        }

        // Check dua notifications (fixed times)
        const duaSchedule = [
            { category: 'morning' as const, hour: 7 },
            { category: 'midday' as const, hour: 13 },
            { category: 'evening' as const, hour: 17 },
            { category: 'night' as const, hour: 21 },
        ];

        for (const dua of duaSchedule) {
            const duaTime = new Date();
            duaTime.setHours(dua.hour, 0, 0, 0);
            const duaId = `dua-${dua.category}-${today}`;

            if (!sentIds.has(duaId) && now >= duaTime.getTime() && now - duaTime.getTime() < 120000) {
                const messages = DUA_MESSAGES[dua.category] || ['Time for duas'];
                const titles: Record<string, string> = {
                    morning: '🌅 Morning Duas',
                    midday: '☀️ Midday Duas',
                    evening: '🌆 Evening Duas',
                    night: '🌙 Night Duas',
                };
                await showNotification(
                    titles[dua.category] || 'Dua Reminder',
                    randomMessage(messages),
                    `dua-${dua.category}`
                );
                markSent(duaId);
            }
        }
    } catch (error) {
        console.error('Notification check failed:', error);
    }
}

/**
 * Start the notification scheduler
 * No arguments needed — it's fully self-contained
 */
export async function startNotificationScheduler(): Promise<void> {
    if (schedulerActive) return;

    // Check permission
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;
        } catch {
            // Continue without SW — notifications still work via Notification API
        }
    }

    schedulerActive = true;

    // Check immediately
    await checkNotifications();

    // Check every 30 seconds
    checkInterval = setInterval(checkNotifications, 30000);

    // Clear old localStorage entries (keep only today)
    try {
        const today = new Date().toDateString();
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key?.startsWith('meek_sent_') && !key.endsWith(today)) {
                localStorage.removeItem(key);
            }
        }
    } catch {
        // localStorage unavailable
    }

    console.log('🔔 Notification scheduler started (self-contained, 30s interval)');
}

/**
 * Stop the notification scheduler
 */
export function stopNotificationScheduler(): void {
    if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
    }
    schedulerActive = false;
}

/**
 * Send a test notification (for debugging)
 */
export async function sendTestNotification(): Promise<boolean> {
    try {
        await showNotification('🧪 Test Notification', 'Notifications are working! — MEEK', 'test');
        return true;
    } catch {
        return false;
    }
}
