/**
 * Calculate Daily Notification Times
 * 
 * Generates all 14 notification times for a user based on their location and preferences:
 * - 5 prayer start notifications
 * - 5 prayer ending notifications (20 min before end)
 * - 4 dua reminders (7am, 1pm, 5pm, 9pm local)
 */

import {
    getPrayerStartMessage,
    getPrayerEndingMessage,
    getDuaMessage
} from './push-notifications';

export interface ScheduledNotification {
    id: string;
    type: 'prayer_start' | 'prayer_ending' | 'dua';
    prayer?: string;
    category?: 'morning' | 'midday' | 'evening' | 'night';
    scheduledTime: number; // Unix timestamp
    title: string;
    body: string;
    url: string;
    tag: string;
    sent?: boolean;
}

// Fetch prayer times from Aladhan API
async function fetchPrayerTimes(
    latitude: number,
    longitude: number,
    madhab: string = 'Hanafi'
): Promise<Record<string, string>> {
    const timestamp = Math.floor(Date.now() / 1000);
    const school = madhab.toLowerCase() === 'hanafi' ? 1 : 0;

    const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=3&school=${school}`
    );

    const data = await response.json();
    return data.data.timings;
}

// Convert "HH:MM" time string to Date object for today
function timeStringToDate(timeString: string, timezone: string): Date {
    const [hours, mins] = timeString.split(':').map(Number);
    const now = new Date();

    // Create date in user's timezone
    const dateStr = now.toLocaleDateString('en-CA', { timeZone: timezone }); // YYYY-MM-DD format
    const date = new Date(`${dateStr}T${timeString.padStart(5, '0')}:00`);

    return date;
}

// Generate fear-based titles
function getPrayerStartTitle(prayer: string): string {
    const titles: Record<string, string> = {
        'Fajr': '😱 FAJR IS NOW! Are you sleeping??',
        'Dhuhr': '🕐 DHUHR IS HERE! Everyone else is praying...',
        'Asr': '🌤️ ASR IS STARTING! One of the most powerful prayers...',
        'Maghrib': '🌆 MAGHRIB IS HERE! The sun is setting!',
        'Isha': '🌙 ISHA IS NOW! Your night prayer is here!'
    };
    return titles[prayer] || `${prayer} Time! 🕌`;
}

function getPrayerEndingTitle(prayer: string): string {
    return `⏰ ${prayer} Ending in 20 minutes!`;
}

function getDuaTitle(category: string): string {
    const titles: Record<string, string> = {
        'morning': '🌅 Morning Dua Reminder',
        'midday': '☀️ Midday Dua Reminder',
        'evening': '🌆 Evening Dua Reminder',
        'night': '🌙 Night Dua Reminder'
    };
    return titles[category] || 'Dua Reminder';
}

/**
 * Calculate all 14 daily notifications for a user
 */
export async function calculateDailyNotifications(
    latitude: number,
    longitude: number,
    madhab: string,
    timezone: string
): Promise<ScheduledNotification[]> {
    const notifications: ScheduledNotification[] = [];
    const today = new Date().toDateString();

    try {
        // Fetch prayer times
        const prayerTimes = await fetchPrayerTimes(latitude, longitude, madhab);

        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const prayerEndTimes: Record<string, string> = {
            Fajr: prayerTimes.Sunrise,
            Dhuhr: prayerTimes.Asr,
            Asr: prayerTimes.Maghrib,
            Maghrib: prayerTimes.Isha,
            Isha: prayerTimes.Fajr // Next day's Fajr
        };

        // Generate prayer start notifications
        for (const prayer of prayers) {
            const prayerDate = timeStringToDate(prayerTimes[prayer], timezone);

            notifications.push({
                id: `prayer-start-${prayer}-${today}`,
                type: 'prayer_start',
                prayer,
                scheduledTime: prayerDate.getTime(),
                title: getPrayerStartTitle(prayer),
                body: getPrayerStartMessage(prayer),
                url: '/quran',
                tag: `prayer-start-${prayer}`
            });
        }

        // Generate prayer ending notifications (20 min before next prayer)
        for (const prayer of prayers) {
            const endTimeStr = prayerEndTimes[prayer];
            let endDate = timeStringToDate(endTimeStr, timezone);

            // For Isha, the end is next day's Fajr
            if (prayer === 'Isha') {
                endDate.setDate(endDate.getDate() + 1);
            }

            // 20 minutes before end
            const warningDate = new Date(endDate.getTime() - 20 * 60 * 1000);

            notifications.push({
                id: `prayer-ending-${prayer}-${today}`,
                type: 'prayer_ending',
                prayer,
                scheduledTime: warningDate.getTime(),
                title: getPrayerEndingTitle(prayer),
                body: getPrayerEndingMessage(prayer),
                url: '/quran',
                tag: `prayer-ending-${prayer}`
            });
        }

        // Generate dua reminders (fixed local times)
        const duaTimes = [
            { category: 'morning' as const, hour: 7, minute: 0 },
            { category: 'midday' as const, hour: 13, minute: 0 },
            { category: 'evening' as const, hour: 17, minute: 0 },
            { category: 'night' as const, hour: 21, minute: 0 }
        ];

        for (const dua of duaTimes) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-CA', { timeZone: timezone });
            const duaDate = new Date(`${dateStr}T${String(dua.hour).padStart(2, '0')}:${String(dua.minute).padStart(2, '0')}:00`);

            notifications.push({
                id: `dua-${dua.category}-${today}`,
                type: 'dua',
                category: dua.category,
                scheduledTime: duaDate.getTime(),
                title: getDuaTitle(dua.category),
                body: getDuaMessage(dua.category),
                url: '/dashboard',
                tag: `dua-${dua.category}`
            });
        }

        // Sort by scheduled time
        notifications.sort((a, b) => a.scheduledTime - b.scheduledTime);

        return notifications;

    } catch (error) {
        console.error('Failed to calculate notifications:', error);
        return [];
    }
}
