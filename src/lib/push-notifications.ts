/**
 * Push Notification Utilities
 * 
 * Handles VAPID keys, subscription management, and sending push notifications
 */

// Fear-based notification messages
export const PRAYER_START_MESSAGES = {
    Fajr: [
        "😱 FAJR IS NOW! Are you sleeping?? Your best prayer is happening RIGHT NOW!",
        "⏰ CODE RED 🚨 Fajr started! Every second counts! Don't lose this blessing!",
        "🌅 Your alarm is going OFF! Fajr is here and waiting... don't be late!",
        "⚡ FAJR TIME! Your spiritual energy is running out! Get up before it's too late!",
        "🔥 WAKE UP WAKE UP WAKE UP! Fajr is on fire right now!",
    ],
    Dhuhr: [
        "🕐 DHUHR IS HERE! Everyone else is praying... are you going to sit this one out?",
        "⏰ Don't be THAT person who missed Dhuhr today...",
        "☀️ DHUHR ALERT! Your streak of not missing prayers is on the line!",
        "🚨 Dhuhr is LIVE! Your noon blessing just started! Move NOW!",
        "⚡ DHUHR TIME! This happens only once a day. Don't waste it!",
    ],
    Asr: [
        "🌤️ ASR IS STARTING! One of the most powerful prayers... it's happening NOW!",
        "⏰ Asr alert! Your afternoon is flying by! Don't let this slip away!",
        "🚨 It's Asr o'clock! This prayer is GOLD. Do you really want to skip it??",
        "😰 URGENT: Asr just started! The clock is ticking!",
        "🔥 ASR TIME! This is your last chance before sunset prayers!",
    ],
    Maghrib: [
        "🌆 MAGHRIB IS HERE! The sun is setting on this prayer... literally!",
        "🚨 CODE RED! Maghrib just started! This happens once a day!",
        "⏰ Maghrib alert! Your day is ending... don't end it without this prayer!",
        "😱 MAGHRIB TIME! The sunset won't wait for you!",
        "🔥 Your evening just started! Maghrib is here and it's powerful!",
    ],
    Isha: [
        "🌙 ISHA IS NOW! Your night is here... and so is this blessed prayer!",
        "⏰ NIGHT PRAYER ALERT! Isha just started! Don't end your day regretting this!",
        "🚨 ISHA TIME! The night is young and so is your prayer window!",
        "😱 Isha is LIVE! Your final prayer of the day... it's happening NOW!",
        "🔥 ISHA ALERT! End your day RIGHT. Pray now!",
    ],
};

export const PRAYER_ENDING_MESSAGES = [
    "⏳ OH NO! Only 20 minutes left for {prayer}! Are you really going to miss it?? 😱",
    "🚨 ALERT ALERT! {prayer} is ENDING SOON! You have 20 minutes... MOVE!",
    "⚡ LAST CALL! {prayer} ends in 20 mins! Don't you DARE miss this!",
    "😰 OOPS! {prayer} is almost over! Only 20 minutes left... HURRY!",
    "🔥 EMERGENCY: {prayer} expires in 20 minutes! Are you really going to lose this??",
    "⏰ TICK TOCK! {prayer} ends in 20 mins! DROP EVERYTHING AND PRAY!",
    "🚨 CRITICAL! {prayer} window is CLOSING! 20 mins left... GO GO GO!",
    "😱 Your chance is slipping away! {prayer} only has 20 mins remaining!",
    "⚡ COUNTDOWN MODE 🔴 {prayer} expires in 20 minutes! This is your final warning!",
    "🔥 If you miss {prayer}, you'll regret it... 20 minutes left! SPRINT!",
];

export const DUA_MESSAGES = {
    morning: [
        "🌅 RISE AND SHINE! Your morning duas are waiting to SUPERCHARGE your day! ⚡",
        "😍 Start your day RIGHT! Open our app and read morning duas NOW!",
        "💪 Winners pray in the morning! Don't start your day without this power-up!",
        "🔥 Your morning dua is ready to transform your entire day! Come get it!",
        "✨ The best time to pray is NOW! Your morning duas are loaded and ready!",
    ],
    midday: [
        "☀️ MIDDAY ALERT! Your energy is dipping... time to RECHARGE with duas! ⚡",
        "🎯 Reset your mind! Midday duas are your power break! Do it NOW!",
        "😴 Feeling the afternoon slump?? Midday duas will revive you! Come pray!",
        "💪 Champions take prayer breaks... is that you?",
        "⚡ Your afternoon is about to get SO MUCH BETTER! Read midday duas NOW!",
    ],
    evening: [
        "🌆 GOLDEN HOUR ALERT! Your evening duas are ready to heal your soul! 🧘",
        "😍 After a LONG day, you deserve this... evening duas are waiting!",
        "💜 Pause everything. Your evening duas will calm your spirit. Do it!",
        "🔥 End your day RIGHT! Evening duas are your peace portal!",
        "✨ Stressed? Exhausted? Evening duas are your sanctuary!",
    ],
    night: [
        "🌙 NIGHT RITUAL TIME! Your sleep duas will give you the BEST rest ever! 😴",
        "⭐ Before you hit that pillow, your night duas are calling!",
        "💤 Want to sleep DEEP and PEACEFUL? Read your night duas first!",
        "✨ End your day with POWER! Your night duas are your sleep secret weapon!",
        "🔥 Don't sleep yet! Your night duas will make you wake up REFRESHED!",
    ],
};

/**
 * Get a random message from an array
 */
export function getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get prayer start message
 */
export function getPrayerStartMessage(prayer: string): string {
    const messages = PRAYER_START_MESSAGES[prayer as keyof typeof PRAYER_START_MESSAGES];
    return messages ? getRandomMessage(messages) : `${prayer} time has started! 🕌`;
}

/**
 * Get prayer ending message
 */
export function getPrayerEndingMessage(prayer: string): string {
    const template = getRandomMessage(PRAYER_ENDING_MESSAGES);
    return template.replace(/{prayer}/g, prayer);
}

/**
 * Get dua reminder message
 */
export function getDuaMessage(time: 'morning' | 'midday' | 'evening' | 'night'): string {
    return getRandomMessage(DUA_MESSAGES[time]);
}

/**
 * Convert base64 VAPID key to Uint8Array for push subscription
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Register Service Worker and subscribe to push
 */
export async function registerPushSubscription(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return null;
    }

    try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Wait for it to be ready
        await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // Get VAPID public key from env
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
                console.error('VAPID public key not configured');
                return null;
            }

            // Subscribe to push
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
            });
            console.log('Push subscription created:', subscription);
        }

        return subscription;
    } catch (error) {
        console.error('Failed to register push:', error);
        return null;
    }
}

/**
 * Send subscription to backend
 */
export async function sendSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
    try {
        const { fetchWithAuth } = await import('./fetchWithAuth');
        const response = await fetchWithAuth('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription.toJSON())
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to save subscription:', error);
        return false;
    }
}

/**
 * Full push registration flow
 */
export async function initializePushNotifications(): Promise<boolean> {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return false;
    }

    // Register and subscribe
    const subscription = await registerPushSubscription();
    if (!subscription) {
        return false;
    }

    // Send to server
    return await sendSubscriptionToServer(subscription);
}
