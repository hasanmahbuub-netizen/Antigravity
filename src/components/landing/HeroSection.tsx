"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#0A1628] text-[#F5F1E8]">
            {/* Background Parallax Layer */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(27,66,66,0.4)_0%,rgba(10,22,40,0)_70%)]" />

            {/* Subtle Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 px-6 max-w-[600px] flex flex-col items-center">

                {/* 1. Arabic Verse */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-amiri text-5xl md:text-7xl leading-loose text-[#D4AF37] mb-8 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </motion.h1>

                {/* 2. English Translation */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="font-english text-xl md:text-2xl text-[#F5F1E8]/90 font-light mb-4"
                >
                    In the name of Allah,<br />the Most Gracious, the Most Merciful
                </motion.p>

                {/* 3. Context */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="font-english text-sm text-[#F5F1E8]/60 mb-12"
                >
                    This is Al-Fatiha, verse 1.<br />You recite it 17 times in your daily prayers.
                </motion.p>

                {/* 4. Question Hook & CTAs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center gap-6 w-full"
                >
                    <h2 className="text-2xl font-english font-medium text-[#F5F1E8]">
                        Can you recite it perfectly?
                    </h2>

                    <div className="flex gap-4 w-full justify-center">
                        <Link href="/onboarding" className="px-6 py-3 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors font-medium">
                            Yes, I can
                        </Link>
                        <Link href="/onboarding" className="px-6 py-3 rounded-full bg-[#D4AF37] text-[#0A1628] hover:bg-[#C4A030] transition-colors font-medium shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                            No, teach me
                        </Link>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 text-[#F5F1E8]/40 text-xs"
                >
                    <span>Scroll for more</span>
                    <ChevronDown className="w-4 h-4 animate-bounce" />
                </motion.div>
            </div>
        </section>
    );
}
