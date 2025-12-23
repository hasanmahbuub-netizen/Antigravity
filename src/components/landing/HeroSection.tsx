"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
            {/* LAYER 1: Base - Deep Navy */}
            <div className="absolute inset-0 bg-[#0A1628]" />

            {/* LAYER 2: Noise Texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* LAYER 3: Islamic Geometric Pattern (animated) */}
            <motion.div
                className="absolute inset-0 opacity-[0.06]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23E8C49A' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 4h4v4h-4V4zm4 4h4v4h-4V8zm-4 4h4v4h-4v-4zm8-8h4v4h-4V4zM2 8h4v4H2V8zm0 8h4v4H2v-4z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* LAYER 4: Radial Gradient Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,22,40,0.4) 70%, rgba(10,22,40,0.8) 100%)",
                }}
            />

            {/* LAYER 5: Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {mounted && [...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-[#E8C49A]/30"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 900,
                        }}
                        animate={{
                            y: -20,
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 15,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* CONTENT LAYER */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">

                {/* Top Breathing Room */}
                <div className="h-[10vh]" />

                {/* Arabic Bismillah - Full Phrase with RTL */}
                <motion.p
                    className="font-arabic text-[48px] md:text-[64px] text-[#E8C49A] tracking-wide mb-8"
                    dir="rtl"
                    style={{
                        textShadow: "0 0 60px rgba(232,196,154,0.4), 0 0 120px rgba(232,196,154,0.2)",
                        lineHeight: 1.8,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </motion.p>

                {/* English Translation */}
                <motion.p
                    className="font-serif text-[22px] md:text-[28px] text-[#F5F1E8]/85 italic mb-16 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    "In the name of Allah,<br />
                    the Most Gracious, the Most Merciful"
                </motion.p>

                {/* The Hook - Powerful Question */}
                <motion.div
                    className="max-w-[500px] mb-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.2 }}
                >
                    <p className="text-[18px] md:text-[20px] text-[#B8B8B8] leading-relaxed font-sans">
                        You recite this verse 17 times every day.
                    </p>
                    <p className="text-[20px] md:text-[22px] text-[#F5F1E8] mt-4 font-sans font-medium">
                        Can you say it perfectly?
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="flex flex-col items-center text-[#B8B8B8]/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 3 }}
                >
                    <span className="text-xs tracking-widest uppercase mb-2">Keep scrolling</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
