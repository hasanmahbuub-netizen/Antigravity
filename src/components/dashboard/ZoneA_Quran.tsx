"use client";

import { Play, BookOpen, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";

export default function ZoneA_Quran() {
    return (
        <section className="min-h-[420px] flex flex-col gap-4 mb-8">
            {/* Header (Orientation) */}
            <header className="flex justify-between items-center mb-2 px-1">
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
            <Link href="/quran" className="block w-full">
                <motion.div
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-[420px] bg-card rounded-[24px] relative overflow-hidden p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex flex-col items-center text-center group border border-transparent dark:border-border"
                >
                    {/* Context Badge */}
                    <div className="px-3 py-1 rounded-full bg-muted/10 text-xs text-muted mb-8 inline-block font-sans font-medium">
                        DAILY VERSE
                    </div>

                    {/* Arabic Verse (Centerpiece) */}
                    <h1 className="font-arabic text-3xl leading-loose text-arabic mt-2 mb-4">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                    </h1>

                    {/* English Translation */}
                    <p className="text-base text-muted mt-2 max-w-[280px] leading-relaxed font-sans">
                        In the name of Allah, the Entirely Merciful, the Especially Merciful.
                    </p>

                    {/* Bottom Action Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-[80px] border-t border-border bg-card/80 backdrop-blur-sm flex justify-around items-center">
                        <button className="flex items-center gap-2 text-primary text-sm font-medium active:scale-95 transition-transform duration-200">
                            <Play className="w-4 h-4" />
                            <span>Play</span>
                        </button>
                        <button className="flex items-center gap-2 text-primary text-sm font-medium active:scale-95 transition-transform duration-200">
                            <BookOpen className="w-4 h-4" />
                            <span>Read</span>
                        </button>
                        <button className="flex items-center gap-2 text-primary text-sm font-medium active:scale-95 transition-transform duration-200">
                            <Sparkles className="w-4 h-4" />
                            <span>Reflect</span>
                        </button>
                    </div>
                </motion.div>
            </Link>
        </section>
    );
}
