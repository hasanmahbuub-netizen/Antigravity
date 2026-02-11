/**
 * Resilient Fetch Wrapper with Auth
 * 
 * Automatically includes Bearer token from Supabase session,
 * retries on auth failures after refreshing the session,
 * and retries on network errors with backoff.
 */

import { supabase } from '@/lib/supabase';

const PRODUCTION_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://meek-zeta.vercel.app';

/**
 * Build absolute API URL
 */
export function buildApiUrl(path: string): string {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return path; // Local dev uses relative URLs
    }
    // Prefer the current origin (works in browser), fallback to config
    const base = typeof window !== 'undefined' ? window.location.origin : PRODUCTION_URL;
    return `${base}${path}`;
}

/**
 * Fetch with automatic auth and retry logic
 * 
 * - Includes Authorization: Bearer <token> header
 * - Retries on 401 after refreshing session (once)
 * - Retries on network errors (max 2 attempts, 1s backoff)
 * - Uses absolute URL for WebView compatibility
 */
export async function fetchWithAuth(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const url = buildApiUrl(path);

    // Get current session token
    async function getAuthHeaders(): Promise<Record<string, string>> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                return {
                    'Authorization': `Bearer ${session.access_token}`,
                };
            }
        } catch {
            // No session available
        }
        return {};
    }

    // Merge auth headers with existing headers
    async function buildRequest(): Promise<[string, RequestInit]> {
        const authHeaders = await getAuthHeaders();
        const existingHeaders = options.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : (options.headers as Record<string, string>) || {};

        return [url, {
            ...options,
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
