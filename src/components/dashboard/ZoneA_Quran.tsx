"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { quranApi } from "@/lib/quran-api";

export default function ZoneA_Quran() {
    const [latestVerse, setLatestVerse] = useState<{
        surah: number;
        ayah: number;
        arabic: string;
        translation: string;
        translation_english?: string;
        translation_bangla?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch Latest Progress
                const { data: progressData } = await supabase
                    .from('quran_verse_progress')
                    .select('surah, ayah')
                    .eq('user_id', user.id)
                    .order('completed_at', { ascending: false })
                    .limit(1);

                const progress = progressData?.[0] as { surah?: number; ayah?: number } | undefined;
                const nextSurah = progress?.surah || 1;
                const nextAyah = (progress?.ayah || 0) + 1;

                // Fetch Verse Text with both translations
                const verseData = await quranApi.getVerseData(nextSurah, nextAyah);
                setLatestVerse({
                    surah: nextSurah,
                    ayah: nextAyah,
                    arabic: verseData.arabic,
                    translation: verseData.translation,
                    translation_english: verseData.translation_english,
                    translation_bangla: verseData.translation_bangla
                });
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    return (
        <section className="h-full flex flex-col gap-4">

            {/* Today Super-Card (The Soul) */}
            <Link href="/quran" className="block w-full flex-1 min-h-0 cursor-pointer">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-full bg-card rounded-[32px] relative overflow-hidden p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex flex-col items-center justify-between text-center group border border-transparent dark:border-border hover:border-primary/20 transition-all"
                >
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-8 h-8 text-primary/40 animate-spin" />
                            <p className="text-xs text-muted font-medium animate-pulse uppercase tracking-widest">Gathering Progress...</p>
                        </div>
                    ) : (
                        <>
                            {/* Top Stats */}
                            <div className="w-full flex justify-between items-start">
                                <div className="text-left">
                                    <h3 className="text-lg font-english font-bold text-foreground">Surah {latestVerse?.surah || 1}</h3>
                                    <p className="text-xs text-muted font-medium">Verse {latestVerse?.ayah || 1}</p>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-muted/10 text-[10px] tracking-widest font-bold text-muted uppercase">
                                    {latestVerse?.ayah === 1 && latestVerse?.surah === 1 ? "GET STARTED" : "CONTINUE PRACTICE"}
                                </div>
                            </div>

                            {/* Middle Content */}
                            <div className="flex flex-col items-center justify-center gap-4 flex-1">
                                {/* Progress dots could be real here, but for now just visual */}
                                <div className="flex gap-1.5 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                                    <div className="w-2 h-2 rounded-full bg-border" />
                                    <div className="w-2 h-2 rounded-full bg-border" />
                                    <div className="w-2 h-2 rounded-full bg-border" />
                                </div>

                                {/* Arabic Opening - Awuzu and Bismillah */}
                                <div className="space-y-3 text-center">
                                    <p className="font-arabic text-lg md:text-xl text-foreground/90 leading-loose">
                                        أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
                                    </p>
                                    <h1 className="font-arabic text-2xl md:text-3xl leading-loose text-foreground animate-in slide-in-from-bottom-2 duration-700 drop-shadow-sm">
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                                    </h1>
                                </div>

                                {/* Tap to see meaning hint */}
                                <p className="text-xs text-foreground/60 uppercase tracking-widest mt-4">
                                    Tap anywhere to practice
                                </p>
                            </div>

                            {/* Bottom CTA */}
                            <div className="w-full">
                                <div className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group-hover:brightness-110 transition-all">
                                    <Play className="w-4 h-4 fill-current" />
                                    <span>Continue Practice</span>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </Link>
        </section>
    );
}

