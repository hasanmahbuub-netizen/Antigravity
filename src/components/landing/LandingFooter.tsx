"use client";

import { motion } from "framer-motion";
import { Download, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

// Custom X (Twitter) icon since Lucide doesn't have it
const XIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// Custom TikTok icon
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const socialLinks = [
    {
        name: "Facebook",
        url: "https://www.facebook.com/profile.php?id=61586337013377",
        icon: Facebook
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/join_meek/",
        icon: Instagram
    },
    {
        name: "X",
        url: "https://x.com/Join_Meek",
        icon: XIcon,
        isCustom: true
    },
    {
        name: "YouTube",
        url: "https://www.youtube.com/channel/UCf6Pd71RdAEun0U5fyCEw8A",
        icon: Youtube
    },
    {
        name: "TikTok",
        url: "https://www.tiktok.com/@join_meek?lang=en",
        icon: TikTokIcon,
        isCustom: true
    },
];

export default function LandingFooter() {
    const apkDownloadUrl = "https://github.com/hasanmahbuub-netizen/Antigravity/actions/runs/21071950174/artifacts/5156049622";

    return (
        <footer className="relative w-full bg-[#0A1628] border-t border-white/10">
            {/* Download Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Logo - matching background color */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <img
                            src="/logo-dark.png"
                            alt="Meek Logo"
                            className="h-16 mx-auto opacity-80"
                            style={{ filter: "brightness(0.9)" }}
                        />
                    </motion.div>

                    {/* Meek Title - DM Serif Display */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl mb-4"
                        style={{ fontFamily: "var(--font-display), serif" }}
                    >
                        <span className="text-[#F5F1E8]">Meek</span>
                    </motion.h2>

                    {/* Tagline - Inter font */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-[#B8B8B8] mb-12 font-sans tracking-wide"
                    >
                        clarity in the moment
                    </motion.p>

                    {/* Download Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link
                            href={apkDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#E8C49A] hover:bg-[#D4B088] text-[#0A1628] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Android APK</span>
                        </Link>
                        <p className="text-sm text-[#B8B8B8]/60 mt-4">
                            Version 1.0 • Android 8.0+
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Social Links & Bottom */}
            <div className="border-t border-white/10 py-8 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Social Icons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex items-center gap-4"
                    >
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-full bg-white/5 hover:bg-[#E8C49A]/20 text-[#B8B8B8] hover:text-[#E8C49A] transition-all duration-300"
                                aria-label={`Follow us on ${social.name}`}
                            >
                                {social.isCustom ? (
                                    <social.icon />
                                ) : (
                                    <social.icon className="w-5 h-5" />
                                )}
                            </Link>
                        ))}
                    </motion.div>

                    {/* Copyright */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-sm text-[#B8B8B8]/50"
                    >
                        © 2025 Meek. All rights reserved.
                    </motion.p>
                </div>
            </div>
        </footer>
    );
}
