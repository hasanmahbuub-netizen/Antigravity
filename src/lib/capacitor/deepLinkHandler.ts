/**
 * Deep Link Handler for Capacitor
 * 
 * This module handles deep links from OAuth callbacks.
 * When the user completes Google Sign-In in Chrome, the callback
 * redirects to com.meek.app://auth?tokens... which this handler catches.
 */

import { App, URLOpenListenerEvent } from '@capacitor/app';
import { supabase } from '@/lib/supabase';

let isInitialized = false;
let pendingNavigation: string | null = null;

/**
 * Initialize the deep link handler
 * This should be called once when the app starts
 */
export async function initDeepLinkHandler(router: { push: (url: string) => void }) {
    if (isInitialized) {
        console.log('📱 [DEEP LINK] Handler already initialized');
        return;
    }

    console.log('📱 [DEEP LINK] Initializing handler...');

    try {
        // Listen for deep link events
        await App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
            console.log('📱 [DEEP LINK] Received URL:', event.url);

            await handleDeepLink(event.url, router);
        });

        // Check if app was opened with a URL (cold start)
        const launchUrl = await App.getLaunchUrl();
        if (launchUrl?.url) {
            console.log('📱 [DEEP LINK] App launched with URL:', launchUrl.url);
            await handleDeepLink(launchUrl.url, router);
        }

        isInitialized = true;
        console.log('✅ [DEEP LINK] Handler initialized successfully');
    } catch (error) {
        console.error('❌ [DEEP LINK] Failed to initialize:', error);
    }
}

/**
 * Handle a deep link URL
 */
async function handleDeepLink(url: string, router: { push: (url: string) => void }) {
    try {
        // Parse the URL
        // Format: com.meek.app://auth?access_token=xxx&refresh_token=xxx&next=/dashboard
        const urlObj = new URL(url);

        // Check if this is an auth callback
        if (urlObj.host === 'auth' || urlObj.pathname === '/auth') {
            console.log('📱 [DEEP LINK] Processing auth callback...');

            const accessToken = urlObj.searchParams.get('access_token');
            const refreshToken = urlObj.searchParams.get('refresh_token');
            const next = urlObj.searchParams.get('next') || '/dashboard';

            if (accessToken && refreshToken) {
                console.log('📱 [DEEP LINK] Tokens found, restoring session...');

                // Set the session
                const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                if (error) {
                    console.error('❌ [DEEP LINK] Failed to set session:', error);
                    router.push('/auth/signin?error=session_failed');
                } else {
                    console.log('✅ [DEEP LINK] Session restored! User:', data.user?.email);
                    router.push(next);
                }
            } else {
                console.warn('⚠️ [DEEP LINK] No tokens in URL');
                router.push('/auth/signin');
            }
        }
    } catch (error) {
        console.error('❌ [DEEP LINK] Error handling URL:', error);
    }
}

/**
 * Get pending navigation URL if any
 */
export function getPendingNavigation(): string | null {
    const nav = pendingNavigation;
    pendingNavigation = null;
    return nav;
}
