/**
 * API URL Helper Utility
 * 
 * BULLETPROOF APPROACH: Always use absolute production URL
 * This works for:
 * - Web (same-origin, so absolute URL is fine)
 * - Android WebView (needs absolute URL to hit Vercel backend)
 * - SSR (returns production URL)
 */

const PRODUCTION_URL = 'https://meek-zeta.vercel.app';

/**
 * Build a full API URL - ALWAYS returns absolute production URL
 * @param path - The API path, e.g., '/api/fiqh/ask'
 * @returns Full absolute URL
 */
export function buildApiUrl(path: string): string {
    return `${PRODUCTION_URL}${path}`;
}

/**
 * Get the base URL for API calls
 * @deprecated Use buildApiUrl() instead
 */
export function getApiBaseUrl(): string {
    return PRODUCTION_URL;
}
