"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { quranApi } from "@/lib/quran-api";

export default function ZoneA_Quran() {
    const [profile, setProfile] = useState<{ full_name: string | null, avatar_url: string | null } | null>(null);
    const [latestVerse, setLatestVerse] = useState<{ surah: number, ayah: number, arabic: string, translation: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // 1. Fetch Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', user.id)
                    .single();
                setProfile(profileData);

                // 2. Fetch Latest Progress
                const { data: progressData } = await supabase
                    .from('quran_verse_progress')
                    .select('surah, ayah')
                    .eq('user_id', user.id)
                    .order('completed_at', { ascending: false })
                    .limit(1);

                const nextSurah = progressData?.[0] ? progressData[0].surah : 1;
                const nextAyah = progressData?.[0] ? progressData[0].ayah + 1 : 1;

                // 3. Fetch Verse Text
                const verseData = await quranApi.getVerseData(nextSurah, nextAyah);
                setLatestVerse({
                    surah: nextSurah,
                    ayah: nextAyah,
                    arabic: verseData.arabic,
                    translation: verseData.translation
                });
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    const hijriDate = "DHUL QADAH 14"; // Simplified for now

    return (
        <section className="h-full flex flex-col gap-4">
            {/* Header (Orientation) */}
            <header className="flex justify-between items-center px-1">
                <div className="flex flex-col text-left">
                    <span className="text-xs uppercase tracking-widest text-muted font-sans font-medium">
                        {hijriDate}
                    </span>
                    <span className="text-sm font-medium text-foreground mt-0.5 font-sans">
                        {dayName}, {profile?.full_name?.split(' ')[0] || "User"}
                    </span>
                </div>

                {/* Profile Presence */}
                <Link href="/settings">
                    <div className="w-[36px] h-[36px] relative rounded-full overflow-hidden bg-muted animate-in fade-in zoom-in duration-500">
                        {profile?.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt="Profile"
                                fill
                                sizes="36px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {profile?.full_name?.[0] || "?"}
                            </div>
                        )}
                    </div>
                </Link>
            </header>

            {/* Today Super-Card (The Soul) */}
            <div className="block w-full flex-1 min-h-0">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-full bg-card rounded-[32px] relative overflow-hidden p-6 md:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex flex-col items-center justify-between text-center group border border-transparent dark:border-border"
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

                                {/* Verse */}
                                <h1 className="font-arabic text-2xl md:text-3xl leading-loose text-arabic animate-in slide-in-from-bottom-2 duration-700">
                                    {latestVerse?.arabic || "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّhِيمِ"}
                                </h1>

                                <p className="text-sm text-muted max-w-[280px] leading-relaxed font-sans line-clamp-2">
                                    "{latestVerse?.translation || "In the name of Allah..."}"
                                </p>
                            </div>

                            {/* Bottom CTA */}
                            <Link href="/quran" className="w-full">
                                <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:brightness-110">
                                    <Play className="w-4 h-4 fill-current" />
                                    <span>Continue Practice</span>
                                </button>
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
