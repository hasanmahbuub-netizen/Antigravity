"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Download, ExternalLink, Copy, Check, Smartphone } from 'lucide-react'

// Direct GitHub artifact download URL
const APK_DOWNLOAD_URL = "https://github.com/hasanmahbuub-netizen/Antigravity/actions/runs/21492494593/artifacts/5309224219";

// Detect if running in an in-app browser (Messenger, Instagram, Facebook, etc.)
function isInAppBrowser(): boolean {
    if (typeof window === 'undefined') return false;

    const ua = navigator.userAgent || navigator.vendor || '';

    // Common in-app browser indicators
    const inAppBrowsers = [
        'FBAN',           // Facebook
        'FBAV',           // Facebook
        'Instagram',      // Instagram
        'Messenger',      // Messenger
        'Twitter',        // Twitter/X
        'Line',           // Line
        'KAKAOTALK',      // KakaoTalk
        'WhatsApp',       // WhatsApp (sometimes)
        'Snapchat',       // Snapchat
        'TikTok',         // TikTok
        'LinkedIn',       // LinkedIn
        'Pinterest',      // Pinterest
    ];

    return inAppBrowsers.some(browser => ua.includes(browser));
}

export default function DownloadPage() {
    const [copied, setCopied] = useState(false);
    const [downloadUrl] = useState(APK_DOWNLOAD_URL);

    // Compute isInApp on client side only
    const isInApp = typeof window !== 'undefined' && isInAppBrowser();

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const openInBrowser = () => {
        // Try to open in system browser
        const url = window.location.href;

        // For Android, try intent URL
        if (/android/i.test(navigator.userAgent)) {
            window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;end`;
            return;
        }

        // For iOS, try opening in Safari
        if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
            window.location.href = `x-safari-${url}`;
            return;
        }

        // Fallback: just open the URL
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A1628] via-[#0D1B2A] to-[#0A1628] flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#E8C49A] to-[#C9A86C] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E8C49A]/20">
                        <Smartphone className="w-10 h-10 text-[#0A1628]" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#F5F1E8] mb-2" style={{ fontFamily: 'var(--font-display), serif' }}>
                        Download Meek
                    </h1>
                    <p className="text-[#B8B8B8]">
                        Master Quranic pronunciation with AI feedback
                    </p>
                </div>

                {/* In-App Browser Warning */}
                {isInApp && (
                    <div className="bg-[#E8C49A]/10 border border-[#E8C49A]/30 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <ExternalLink className="w-5 h-5 text-[#E8C49A] mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-[#E8C49A] font-medium text-sm mb-2">
                                    Open in Browser for Best Experience
                                </p>
                                <p className="text-[#B8B8B8] text-xs mb-3">
                                    Downloads may not work properly in this app. Please open in Chrome or Safari.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={openInBrowser}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#E8C49A] text-[#0A1628] rounded-lg text-sm font-medium hover:bg-[#C9A86C] transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open in Browser
                                    </button>
                                    <button
                                        onClick={copyLink}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Download Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
                            <Download className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Meek for Android</h2>
                            <p className="text-[#B8B8B8] text-sm">Version 1.0 • ~5 MB</p>
                        </div>
                    </div>

                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#1E3A5F] hover:bg-[#E8C49A] text-white hover:text-[#0A1628] font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,196,154,0.4)]"
                    >
                        <Download className="w-5 h-5" />
                        Download APK
                    </a>

                    <p className="text-[#666] text-xs text-center mt-3">
                        Requires Android 7.0 or higher
                    </p>
                </div>

                {/* Installation Instructions */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-medium mb-4">Installation Steps</h3>
                    <ol className="space-y-3 text-sm text-[#B8B8B8]">
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">1</span>
                            <span>Download the APK file (you may need to log in to GitHub)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">2</span>
                            <span>Open the downloaded file from your notifications or file manager</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">3</span>
                            <span>If prompted, enable &quot;Install from unknown sources&quot;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">4</span>
                            <span>Tap &quot;Install&quot; and wait for completion</span>
                        </li>
                    </ol>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-[#B8B8B8] hover:text-white text-sm transition-colors">
                        ← Back to Meek
                    </Link>
                </div>
            </div>
        </div>
    )
}
