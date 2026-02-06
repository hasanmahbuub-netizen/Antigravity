/**
 * API URL Helper Utility
 * Ensures all API calls use the correct base URL for both web and mobile contexts
 */

/**
 * Get the base URL for API calls
 * - In production web: empty (relative URLs work fine)
 * - In Capacitor/Android WebView: use full production URL
 */
export function getApiBaseUrl(): string {
    if (typeof window === 'undefined') {
        return ''; // Server-side, relative URLs are fine
    }

    // Check if running in Android/Capacitor WebView
    const userAgent = navigator.userAgent || '';
    const isMobileApp = userAgent.includes('MeekApp');

    // If in mobile app or origin is localhost (development on actual device)
    if (isMobileApp || window.location.origin.includes('localhost') || window.location.origin.includes('capacitor://')) {
        return 'https://meek-zeta.vercel.app';
    }

    // Standard web or production environment
    return '';
}

/**
 * Build a full API URL
 * @param path - The API path, e.g., '/api/fiqh/ask'
 * @returns Full URL with appropriate base
 */
export function buildApiUrl(path: string): string {
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}${path}`;
}
