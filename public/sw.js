// Service Worker for Push Notifications (Device-Based Free Approach)
// This runs in the background on the user's device

const CACHE_NAME = 'meek-v1';
const APP_URL = self.location.origin;

// Install event
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker v1...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(self.clients.claim());
});

// Push event - for server-sent push (optional, backup)
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    let data = {
        title: 'MEEK Reminder',
        body: 'Time for your spiritual practice!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'meek-notification',
        url: '/dashboard'
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            data = { ...data, ...payload };
        } catch (e) {
            data.body = event.data.text() || data.body;
        }
    }

    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        tag: data.tag,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: { url: data.url }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click - handle deep linking
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification.tag);

    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/dashboard';
    const fullUrl = new URL(urlToOpen, APP_URL).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // Focus existing window if open
                for (const client of windowClients) {
                    if (client.url.includes(APP_URL) && 'focus' in client) {
                        return client.focus().then(() => client.navigate(fullUrl));
                    }
                }
                // Open new window
                return clients.openWindow(fullUrl);
            })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[SW] Notification closed:', event.notification.tag);
});

// Message handler - for communication with main app
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, tag, url } = event.data;

        self.registration.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: tag || 'meek',
            requireInteraction: true,
            data: { url: url || '/dashboard' }
        });
    }
});
