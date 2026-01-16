"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Download, Globe } from "lucide-react";

const APK_DOWNLOAD_URL = "https://github.com/hasanmahbuub-netizen/Antigravity/actions/runs/21071950174/artifacts/5156049622";

export default function CTASection() {
    return (
        <section id="get-started" className="relative w-full bg-gradient-to-b from-[#1A1A1A] to-[#0A1628] py-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2D5F5D]/20 rounded-full blur-[200px]" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E8C49A]/10 rounded-full blur-[150px]" />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-3xl mx-auto text-center px-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Badge */}
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8C49A]/10 border border-[#E8C49A]/20 mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Sparkles className="w-4 h-4 text-[#E8C49A]" />
                    <span className="text-sm text-[#E8C49A]">Free to use • No credit card required</span>
                </motion.div>

                {/* Headline */}
                <h2 className="font-serif text-[42px] md:text-[64px] text-white leading-tight mb-6">
                    Start your journey<br />
                    <span className="text-[#E8C49A] italic">today</span>
                </h2>

                {/* Subtext */}
                <p className="text-white/60 text-lg md:text-xl mb-10 max-w-xl mx-auto">
                    Join thousands of Muslims transforming their relationship with the Quran.
                    Begin with Al-Fatiha — it takes just 5 minutes.
                </p>

                {/* Dual CTA Buttons - Blue with Golden Hover Glow */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Primary: Start with Al-Fatiha (Web) */}
                    <Link href="/auth/signin?redirect=/quran">
                        <motion.button
                            className="group flex items-center gap-3 bg-[#1E3A5F] text-white font-semibold text-lg px-10 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(232,196,154,0.4)] hover:bg-[#E8C49A] hover:text-[#0A1628]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Globe className="w-5 h-5" />
                            Start with Al-Fatiha
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>

                    {/* Secondary: Download APK */}
                    <Link href={APK_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                        <motion.button
                            className="flex items-center gap-3 bg-[#1E3A5F]/60 text-white/90 hover:text-[#0A1628] font-medium px-8 py-4 rounded-full border border-[#1E3A5F] transition-all duration-300 hover:bg-[#E8C49A] hover:border-[#E8C49A] hover:shadow-[0_0_25px_rgba(232,196,154,0.3)]"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Download className="w-5 h-5" />
                            Download Meek (for Android)
                        </motion.button>
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-12 text-white/40 text-sm">
                    <span>✓ No account needed</span>
                    <span>✓ Works offline</span>
                    <span>✓ 100% free</span>
                </div>
            </motion.div>
        </section>
    );
}

