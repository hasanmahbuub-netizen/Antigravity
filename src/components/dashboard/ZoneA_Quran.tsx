"use client";

import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function ZoneA_Quran() {
    return (
        <section className="h-full flex flex-col gap-4">
            {/* Header (Orientation) */}
            <header className="flex justify-between items-center px-1">
                <div className="flex flex-col text-left">
                    <span className="text-xs uppercase tracking-widest text-muted font-sans font-medium">
                        DHUL QADAH 14
                    </span>
                    <span className="text-sm font-medium text-foreground mt-0.5 font-sans">
                        Wednesday
                    </span>
                </div>

                {/* Profile Presence */}
                <Link href="/settings">
                    <div className="w-[36px] h-[36px] relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                            alt="Profile"
                            fill
                            sizes="36px"
                            className="object-cover"
                        />
                    </div>
                </Link>
            </header>

            {/* Today Super-Card (The Soul) */}
            <Link href="/quran" className="block w-full flex-1 min-h-0">
                <motion.div
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-full bg-card rounded-[32px] relative overflow-hidden p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex flex-col items-center justify-between text-center group border border-transparent dark:border-border"
                >
                    {/* Top Stats */}
                    <div className="w-full flex justify-between items-start">
                        <div className="text-left">
                            <h3 className="text-lg font-english font-bold text-foreground">Al-Fatiha</h3>
                            <p className="text-xs text-muted font-medium">Verse 1 of 7</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-muted/10 text-[10px] tracking-widest font-bold text-muted uppercase">
                            DAILY PRACTICE
                        </div>
                    </div>

                    {/* Middle Content */}
                    <div className="flex flex-col items-center justify-center gap-4 flex-1">
                        {/* Progress Dots */}
                        <div className="flex gap-1.5 mb-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div className="w-2 h-2 rounded-full bg-border" />
                            <div className="w-2 h-2 rounded-full bg-border" />
                            <div className="w-2 h-2 rounded-full bg-border" />
                            <div className="w-2 h-2 rounded-full bg-border" />
                            <div className="w-2 h-2 rounded-full bg-border" />
                        </div>

                        {/* Verse */}
                        <h1 className="font-arabic text-3xl md:text-4xl leading-loose text-arabic">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                        </h1>

                        <p className="text-sm md:text-base text-muted max-w-[280px] leading-relaxed font-sans line-clamp-2">
                            In the name of Allah, the Entirely Merciful, the Especially Merciful.
                        </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="w-full">
                        <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                            <Play className="w-4 h-4 fill-current" />
                            <span>Continue Practice</span>
                        </button>
                    </div>

                </motion.div>
            </Link>
        </section>
    );
}
