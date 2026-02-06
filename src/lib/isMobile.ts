/**
 * Mobile Detection Utility
 * Centralizes the logic for detecting if the app is running in Capacitor/Mobile context.
 */

export function isMobileApp(): boolean {
    if (typeof window === 'undefined') return false;

    // Check 1: User Agent (injected by capacitor.config.ts)
    const hasMeekAgent = navigator.userAgent.includes('MeekApp');

    // Check 2: Capacitor global object (injected by bridge)
    // @ts-expect-error - Capacitor is injected globally
    const hasCapacitor = window.Capacitor !== undefined;

    // Check 3: Android Context
    const isAndoidWebView = navigator.userAgent.includes('Android');

    // Primary check: Explicit User Agent OR Capacitor Bridge present
    return hasMeekAgent || (hasCapacitor && isAndoidWebView);
}
