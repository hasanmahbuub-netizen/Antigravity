"use client"

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { initDeepLinkHandler } from '@/lib/capacitor/deepLinkHandler';

/**
 * CapacitorInit Component
 * 
 * This component initializes Capacitor-specific functionality on the client side.
 * It must be included in the app layout to handle:
 * - Deep links for OAuth return
 * - Other native app functionality
 */
export default function CapacitorInit() {
    const router = useRouter();
    const initialized = useRef(false);

    useEffect(() => {
        // Only run on client and only once
        if (typeof window === 'undefined' || initialized.current) return;

        // Check if we're in the Capacitor app
        import('@/lib/isMobile').then(({ isMobileApp }) => {
            if (isMobileApp()) {
                console.log('📱 [CAPACITOR] Running in mobile app, initializing...');
                initialized.current = true;

                // Initialize deep link handler
                initDeepLinkHandler({
                    push: (url: string) => {
                        console.log('📱 [CAPACITOR] Navigating to:', url);
                        router.push(url);
                    }
                });
            } else {
                console.log('🌐 [CAPACITOR] Running in browser, skipping Capacitor init');
            }
        });
    }, [router]);

    // This component doesn't render anything
    return null;
}
