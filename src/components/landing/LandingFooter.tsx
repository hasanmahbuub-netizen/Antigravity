"use client";

import { motion } from "framer-motion";
import { Download, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Custom X (Twitter) icon
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

const APK_DOWNLOAD_URL = "https://github.com/hasanmahbuub-netizen/Antigravity/actions/runs/21492494593/artifacts/5309224219";

const socialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61586337013377", icon: Facebook },
    { name: "Instagram", url: "https://www.instagram.com/join_meek/", icon: Instagram },
    { name: "X", url: "https://x.com/Join_Meek", icon: XIcon, isCustom: true },
    { name: "YouTube", url: "https://www.youtube.com/channel/UCf6Pd71RdAEun0U5fyCEw8A", icon: Youtube },
    { name: "TikTok", url: "https://www.tiktok.com/@join_meek?lang=en", icon: TikTokIcon, isCustom: true },
];

export default function LandingFooter() {
    return (
        <footer className="relative w-full bg-[#0A1628] border-t border-white/5 py-12">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        {/* Logo */}
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="/logo.png"
                                alt="Meek"
                                width={100}
                                height={40}
                                className="h-10 w-auto opacity-90"
                            />
                        </Link>
                        {/* Meek Title - DM Serif Display */}
                        <h3
                            className="text-3xl text-[#F5F1E8] mb-2"
                            style={{ fontFamily: "var(--font-display), serif" }}
                        >
                            Meek
                        </h3>
                        {/* Tagline - Inter */}
                        <p className="text-[#B8B8B8] text-sm font-sans tracking-wide mb-4">
                            clarity in the moment
                        </p>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Making Quranic pronunciation accessible to every Muslim around the world.
                        </p>

                        {/* Download Button - Blue with Golden Hover */}
                        <Link
                            href="/download"
                            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#1E3A5F] hover:bg-[#E8C49A] text-white hover:text-[#0A1628] font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(232,196,154,0.3)]"
                        >
                            <Download className="w-4 h-4" />
                            Download Meek (for Android)
                        </Link>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-white/30 mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link href="/quran" className="text-sm text-white/50 hover:text-white transition-colors">All Surahs</Link></li>
                            <li><Link href="/fiqh" className="text-sm text-white/50 hover:text-white transition-colors">Fiqh Q&A</Link></li>
                            <li><Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">Dashboard</Link></li>
                            <li>
                                <Link
                                    href={APK_DOWNLOAD_URL}
                                    target="_blank"
                                    className="text-sm text-white/50 hover:text-[#E8C49A] transition-colors"
                                >
                                    Download APK
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-white/30 mb-4">Connect</h4>
                        <ul className="space-y-3">
                            <li><a href="mailto:hello@meek.app" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
                            {socialLinks.slice(0, 3).map((social) => (
                                <li key={social.name}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/50 hover:text-white transition-colors"
                                    >
                                        {social.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Icons Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-4 mt-10 pt-8 border-t border-white/5"
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

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30">
                        © {new Date().getFullYear()} Meek. Made with ❤️ for the Ummah.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
