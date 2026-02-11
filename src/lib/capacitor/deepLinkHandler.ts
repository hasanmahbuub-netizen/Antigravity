/**
 * Deep Link Handler for Capacitor
 * 
 * Handles the OAuth return flow:
 * 1. Chrome Custom Tab completes Google Sign-In
 * 2. Server callback passes auth CODE (not tokens) via deep link
 * 3. This handler receives the code and exchanges it for a session CLIENT-SIDE
 * 4. Client-side exchange uses the PKCE verifier stored in WebView's localStorage
 */

import { App, URLOpenListenerEvent } from '@capacitor/app';
import { supabase } from '@/lib/supabase';

let isInitialized = false;

/**
 * Initialize the deep link handler
 */
export async function initDeepLinkHandler(router: { push: (url: string) => void }) {
    if (isInitialized) return;

    console.log('📱 [DEEP LINK] Initializing handler...');

    try {
        // Listen for deep link events (app already running)
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
        console.log('✅ [DEEP LINK] Handler initialized');
    } catch (error) {
        console.error('❌ [DEEP LINK] Failed to initialize:', error);
    }
}

/**
 * Parse deep link URL using string methods (not new URL() which fails for custom schemes)
 */
function parseDeepLinkParams(url: string): Record<string, string> {
    const params: Record<string, string> = {};

    // Find the query string after '?'
    const queryIndex = url.indexOf('?');
    if (queryIndex === -1) return params;

    // Get everything after '?' but before '#' (if present)
    let queryString = url.substring(queryIndex + 1);
    const hashIndex = queryString.indexOf('#');
    if (hashIndex !== -1) {
        queryString = queryString.substring(0, hashIndex);
    }

    // Parse key=value pairs
    queryString.split('&').forEach(pair => {
        const [key, ...valueParts] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(valueParts.join('=') || '');
        }
    });

    return params;
}

/**
 * Handle a deep link URL
 */
async function handleDeepLink(url: string, router: { push: (url: string) => void }) {
    try {
        // Check if this is our auth callback
        if (!url.includes('auth-callback')) return;

        console.log('📱 [DEEP LINK] Processing auth callback...');

        // Close the Chrome Custom Tab
        try {
            const { Browser } = await import('@capacitor/browser');
            await Browser.close();
            console.log('📱 [DEEP LINK] Browser closed');
        } catch {
            // Browser might already be closed
        }

        // Parse parameters using safe string parsing
        const params = parseDeepLinkParams(url);
        const code = params['code'];
        const error = params['error'];

        if (error) {
            console.error('❌ [DEEP LINK] Auth error:', error);
            router.push('/auth/signin?error=' + encodeURIComponent(error));
            return;
        }

        if (code) {
            console.log('📱 [DEEP LINK] Auth code received, exchanging for session...');

            // Exchange auth code for session on the CLIENT side
            // This works because the PKCE code verifier is in the WebView's localStorage
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
                console.error('❌ [DEEP LINK] Code exchange failed:', exchangeError.message);
                router.push('/auth/signin?error=exchange_failed');
                return;
            }

            console.log('✅ [DEEP LINK] Session established! User:', data.user?.email);
            router.push('/dashboard');
            return;
        }

        console.warn('⚠️ [DEEP LINK] No code or error in deep link');
        router.push('/auth/signin');
    } catch (error) {
        console.error('❌ [DEEP LINK] Error handling URL:', error);
        router.push('/auth/signin?error=deep_link_error');
    }
}
