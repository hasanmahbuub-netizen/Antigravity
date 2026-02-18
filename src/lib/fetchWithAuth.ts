/**
 * Resilient Fetch Wrapper with Auth
 * 
 * For the browser-wrapper architecture:
 * - Cookies are the PRIMARY auth mechanism (auto-sent by browser)
 * - Bearer token is SUPPLEMENTARY (for cases where cookies are stripped)
 * - Always includes credentials: 'include' so cookies are forwarded
 * - Retries on network failures and 401s with session refresh
 */

import { supabase } from '@/lib/supabase';

/**
 * Build absolute API URL
 * In browser-wrapper mode, we always use the current origin
 */
export function buildApiUrl(path: string): string {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}${path}`;
    }
    // Server-side fallback (shouldn't happen in browser wrapper, but just in case)
    const base = process.env.NEXT_PUBLIC_APP_URL || 'https://meek-zeta.vercel.app';
    return `${base}${path}`;
}

/**
 * Fetch with automatic auth and retry logic
 * 
 * Auth Strategy (ordered by reliability):
 * 1. Cookies (auto-sent via credentials: 'include') — handled by middleware
 * 2. Bearer token (from Supabase session) — supplementary for WebView edge cases
 * 
 * Retry Strategy:
 * - Network errors: retry once after 1s
 * - 401 Unauthorized: refresh session, retry once
 */
export async function fetchWithAuth(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const url = buildApiUrl(path);

    // Get Bearer token as supplementary auth
    async function getAuthHeaders(): Promise<Record<string, string>> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                return {
                    'Authorization': `Bearer ${session.access_token}`,
                };
            }
        } catch {
            // Session unavailable — cookies will handle auth
        }
        return {};
    }

    // Build the request with auth headers + credentials
    async function buildRequest(): Promise<[string, RequestInit]> {
        const authHeaders = await getAuthHeaders();
        const existingHeaders = options.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : (options.headers as Record<string, string>) || {};

        return [url, {
            ...options,
            // CRITICAL: Always include credentials so cookies are forwarded
            // This is what makes the browser-wrapper auth work
            credentials: 'include',
            headers: {
                ...existingHeaders,
                ...authHeaders,
            },
        }];
    }

    // Attempt 1
    let [reqUrl, reqOptions] = await buildRequest();
    let response: Response;

    try {
        response = await fetch(reqUrl, reqOptions);
    } catch (networkError) {
        // Network error — retry once after 1s
        console.warn('⚠️ [FETCH] Network error, retrying in 1s...', networkError);
        await new Promise(r => setTimeout(r, 1000));

        try {
            [reqUrl, reqOptions] = await buildRequest();
            response = await fetch(reqUrl, reqOptions);
        } catch (retryError) {
            console.error('❌ [FETCH] Retry failed:', retryError);
            throw retryError;
        }
    }

    // If 401, try to refresh session and retry once
    if (response.status === 401) {
        console.warn('⚠️ [FETCH] 401 received, attempting session refresh...');

        try {
            const { error } = await supabase.auth.refreshSession();
            if (!error) {
                console.log('✅ [FETCH] Session refreshed, retrying request...');
                [reqUrl, reqOptions] = await buildRequest();
                response = await fetch(reqUrl, reqOptions);
            } else {
                console.error('❌ [FETCH] Session refresh failed:', error.message);
            }
        } catch (refreshError) {
            console.error('❌ [FETCH] Refresh attempt failed:', refreshError);
        }
    }

    return response;
}
