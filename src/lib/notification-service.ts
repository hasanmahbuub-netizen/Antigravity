/**
 * Web Notification Service
 * 
 * Handles real-time browser notifications for:
 * - Prayer start times
 * - 30 minutes before prayer ends
 * - Contextual duas (morning, afternoon, evening, night)
 */

import { getNextPrayer, getCurrentPrayer, type PrayerReminder, type CurrentPrayerInfo } from './agents/namaz-agent';
import { getSpiritualNudge, getTimeOfDay } from './agents/dua-agent';

interface NotificationConfig {
    prayerStart: boolean;
    prayerWarning: boolean; // 30 min before end
    morningDua: boolean;
    eveningDua: boolean;
}

const DEFAULT_CONFIG: NotificationConfig = {
    prayerStart: true,
    prayerWarning: true,
    morningDua: true,
    eveningDua: true,
};

// Track what we've already notified about
const notifiedEvents = new Set<string>();

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

/**
 * Send a browser notification
 */
function sendNotification(title: string, body: string, icon?: string) {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification(title, {
        body,
        icon: icon || '/icon-192.png',
        badge: '/icon-192.png',
        tag: `meek-${Date.now()}`,
        requireInteraction: false,
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
}

/**
 * Check and send prayer notifications
 */
async function checkPrayerNotifications() {
    try {
        const currentPrayerInfo = await getCurrentPrayer();
        const now = new Date();
        const today = now.toDateString();

        // 1. Prayer Start Notification
        if (currentPrayerInfo.current) {
            const eventKey = `prayer-start-${currentPrayerInfo.current.name}-${today}`;

            // If prayer just started (within last 5 minutes) and not already notified
            if (currentPrayerInfo.current.minutesRemaining > 50 && !notifiedEvents.has(eventKey)) {
                sendNotification(
                    `${currentPrayerInfo.current.name} Time! 🕌`,
                    `${currentPrayerInfo.current.arabicName} has started. May Allah accept your prayer.`,
                );
                notifiedEvents.add(eventKey);
            }

            // 2. 30 Minutes Warning
            const warningKey = `prayer-warning-${currentPrayerInfo.current.name}-${today}`;
            if (currentPrayerInfo.current.minutesRemaining <= 30 &&
                currentPrayerInfo.current.minutesRemaining > 25 &&
                !notifiedEvents.has(warningKey)) {
                sendNotification(
                    `⏰ ${currentPrayerInfo.current.name} ending soon`,
                    `Only ${currentPrayerInfo.current.minutesRemaining} minutes left until ${currentPrayerInfo.next?.name || 'next prayer'}.`,
                );
                notifiedEvents.add(warningKey);
            }
        }
    } catch (error) {
        console.error('Prayer notification check failed:', error);
    }
}

/**
 * Check and send dua notifications based on time of day
 */
function checkDuaNotifications() {
    const timeOfDay = getTimeOfDay();
    const now = new Date();
    const today = now.toDateString();
    const hour = now.getHours();

    // Morning dua - around 6-7 AM
    if (timeOfDay === 'morning' && hour >= 6 && hour < 7) {
        const eventKey = `dua-morning-${today}`;
        if (!notifiedEvents.has(eventKey)) {
            const nudge = getSpiritualNudge();
            sendNotification(
                'Morning Blessing 🌅',
                nudge.message,
            );
            notifiedEvents.add(eventKey);
        }
    }

    // Afternoon reminder - around 1-2 PM
    if (timeOfDay === 'afternoon' && hour >= 13 && hour < 14) {
        const eventKey = `dua-afternoon-${today}`;
        if (!notifiedEvents.has(eventKey)) {
            const nudge = getSpiritualNudge();
            sendNotification(
                'Midday Reminder ☀️',
                nudge.message,
            );
            notifiedEvents.add(eventKey);
        }
    }

    // Evening dua - around 6-7 PM  
    if (timeOfDay === 'evening' && hour >= 18 && hour < 19) {
        const eventKey = `dua-evening-${today}`;
        if (!notifiedEvents.has(eventKey)) {
            const nudge = getSpiritualNudge();
            sendNotification(
                'Evening Reflection 🌇',
                nudge.message,
            );
            notifiedEvents.add(eventKey);
        }
    }

    // Night dua - around 9-10 PM
    if (timeOfDay === 'night' && hour >= 21 && hour < 22) {
        const eventKey = `dua-night-${today}`;
        if (!notifiedEvents.has(eventKey)) {
            const nudge = getSpiritualNudge();
            sendNotification(
                'Before Sleep 🌙',
                nudge.message,
            );
            notifiedEvents.add(eventKey);
        }
    }
}

/**
 * Start the notification scheduler
 * Checks every minute for prayer/dua notification triggers
 */
let notificationInterval: NodeJS.Timeout | null = null;

export function startNotificationScheduler() {
    if (notificationInterval) return; // Already running

    // Initial check
    checkPrayerNotifications();
    checkDuaNotifications();

    // Check every minute
    notificationInterval = setInterval(() => {
        checkPrayerNotifications();
        checkDuaNotifications();
    }, 60 * 1000);

    console.log('🔔 Notification scheduler started');
}

export function stopNotificationScheduler() {
    if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
        console.log('🔕 Notification scheduler stopped');
    }
}

/**
 * Get all pending notifications for display in UI
 */
export async function getPendingNotifications(): Promise<Array<{
    id: string;
    type: 'prayer' | 'dua';
    title: string;
    message: string;
    time: string;
}>> {
    const notifications: Array<{
        id: string;
        type: 'prayer' | 'dua';
        title: string;
        message: string;
        time: string;
    }> = [];

    try {
        // Current prayer info
        const prayerInfo = await getCurrentPrayer();

        if (prayerInfo.current) {
            notifications.push({
                id: 'current-prayer',
                type: 'prayer',
                title: `${prayerInfo.current.name} Time`,
                message: `${prayerInfo.current.minutesRemaining} minutes remaining`,
                time: 'Now',
            });
        }

        if (prayerInfo.next) {
            notifications.push({
                id: 'next-prayer',
                type: 'prayer',
                title: prayerInfo.next.name,
                message: `Coming up at ${prayerInfo.next.time}`,
                time: `In ${prayerInfo.next.minutesUntil}m`,
            });
        }

        // Contextual dua
        const nudge = getSpiritualNudge();
        if (nudge.dua) {
            notifications.push({
                id: 'daily-dua',
                type: 'dua',
                title: nudge.timing,
                message: nudge.message,
                time: 'Today',
            });
        }

    } catch (error) {
        console.error('Failed to get pending notifications:', error);
    }

    return notifications;
}
