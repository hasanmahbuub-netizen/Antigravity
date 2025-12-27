/**
 * Client-Side Notification Scheduler
 * 
 * This runs in the browser and checks every 30 seconds if any notification is due.
 * This is the FREE approach - no server cron jobs needed!
 */

import type { ScheduledNotification } from './calculateNotificationTimes';

// Cache of today's notifications
let scheduledNotifications: ScheduledNotification[] = [];
let schedulerInterval: NodeJS.Timeout | null = null;
let lastFetchDate: string | null = null;

/**
 * Fetch today's notification schedule from API
 */
async function fetchDailySchedule(userId: string): Promise<ScheduledNotification[]> {
    try {
        const response = await fetch(`/api/notifications/get-daily/${userId}`);

        if (!response.ok) {
            console.error('Failed to fetch notifications:', response.status);
            return [];
        }

        const data = await response.json();
        return data.notifications || [];
    } catch (error) {
        console.error('Error fetching notification schedule:', error);
        return [];
    }
}

/**
 * Show notification using Service Worker
 */
async function showNotification(notification: ScheduledNotification): Promise<boolean> {
    // Check if Service Worker is available
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification(notification.title, {
            body: notification.body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: notification.tag,
            requireInteraction: true,
            data: {
                url: notification.url || '/dashboard'
            }
        });

        console.log('🔔 Notification shown:', notification.title);
        return true;
    } catch (error) {
        console.error('Failed to show notification:', error);
        return false;
    }
}

/**
 * Check if any notifications are due (within 1 minute window)
 */
function checkDueNotifications(): void {
    const now = Date.now();

    scheduledNotifications.forEach((notification, index) => {
        if (notification.sent) return; // Already sent

        const timeDiff = now - notification.scheduledTime;

        // Show if within 0-60 seconds of scheduled time
        if (timeDiff >= 0 && timeDiff < 60 * 1000) {
            showNotification(notification);
            scheduledNotifications[index].sent = true;

            // Save sent status to localStorage to persist across page refreshes
            saveSentNotifications();
        }
    });
}

/**
 * Save which notifications have been sent (persists across page refreshes)
 */
function saveSentNotifications(): void {
    const sentIds = scheduledNotifications
        .filter(n => n.sent)
        .map(n => n.id);

    localStorage.setItem('meek_sent_notifications', JSON.stringify(sentIds));
}

/**
 * Load sent notifications from localStorage
 */
function loadSentNotifications(): Set<string> {
    try {
        const saved = localStorage.getItem('meek_sent_notifications');
        if (saved) {
            return new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.warn('Failed to load sent notifications:', e);
    }
    return new Set();
}

/**
 * Clear old sent notifications (call at midnight)
 */
function clearOldSentNotifications(): void {
    localStorage.removeItem('meek_sent_notifications');
}

/**
 * Start the notification scheduler
 * @param userId - The user's ID to fetch their notification schedule
 */
export async function startNotificationScheduler(userId: string): Promise<void> {
    console.log('🔔 Starting notification scheduler for user:', userId);

    // Stop existing scheduler if running
    stopNotificationScheduler();

    // Check notification permission
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
    }

    // Register Service Worker if not already
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;
            console.log('Service Worker ready');
        } catch (e) {
            console.error('Service Worker registration failed:', e);
        }
    }

    // Fetch today's schedule
    const today = new Date().toDateString();

    // Only fetch if we haven't already today
    if (lastFetchDate !== today) {
        clearOldSentNotifications();
        scheduledNotifications = await fetchDailySchedule(userId);
        lastFetchDate = today;

        // Restore sent status from localStorage
        const sentIds = loadSentNotifications();
        scheduledNotifications.forEach(n => {
            if (sentIds.has(n.id)) {
                n.sent = true;
            }
        });

        console.log(`📅 Loaded ${scheduledNotifications.length} notifications for today`);
    }

    // Start checking every 30 seconds
    schedulerInterval = setInterval(() => {
        checkDueNotifications();

        // Check if we crossed midnight (need to refresh schedule)
        const currentDate = new Date().toDateString();
        if (currentDate !== lastFetchDate) {
            console.log('🌅 New day detected, refreshing schedule...');
            startNotificationScheduler(userId); // Restart with fresh schedule
        }
    }, 30 * 1000);

    // Also check immediately
    checkDueNotifications();

    console.log('✅ Notification scheduler started (checking every 30 seconds)');
}

/**
 * Stop the notification scheduler
 */
export function stopNotificationScheduler(): void {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
        console.log('⏹️ Notification scheduler stopped');
    }
}

/**
 * Get the current notification schedule (for debugging)
 */
export function getScheduledNotifications(): ScheduledNotification[] {
    return scheduledNotifications;
}

/**
 * Manually trigger a test notification
 */
export async function sendTestNotification(): Promise<boolean> {
    return showNotification({
        id: 'test-' + Date.now(),
        type: 'dua',
        category: 'morning',
        scheduledTime: Date.now(),
        title: '🧪 Test Notification',
        body: 'This is a test notification from MEEK!',
        url: '/dashboard',
        tag: 'test'
    });
}
