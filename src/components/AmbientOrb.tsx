"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, Clock, Moon } from "lucide-react";
import { getSpiritualNudge, type SpiritualNudge } from "@/lib/agents/dua-agent";
import { getNextPrayer, getCurrentPrayer, formatTimeUntil, type PrayerReminder, type CurrentPrayerInfo } from "@/lib/agents/namaz-agent";

/**
 * The Ambient Orb - A Breakthrough UI Component
 * 
 * A subtle, spiritually-aware presence that hovers at the bottom of the screen.
 * It pulses gently when there's a spiritual context to share, never intrusive,
 * always caring. Like a patient friend who waits for you to be ready.
 * 
 * States:
 * - Dormant: Nearly invisible, just a soft glow
 * - Active: Gentle pulse when nudge is available
 * - Expanded: Shows the spiritual context when tapped
 */

interface AmbientOrbProps {
    className?: string;
}

export default function AmbientOrb({ className = "" }: AmbientOrbProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [nudge, setNudge] = useState<SpiritualNudge | null>(null);
    const [prayerReminder, setPrayerReminder] = useState<PrayerReminder | null>(null);
    const [currentPrayer, setCurrentPrayer] = useState<CurrentPrayerInfo | null>(null);
    const [isActive, setIsActive] = useState(false);

    // Fetch spiritual context
    const refreshContext = useCallback(async () => {
        try {
            // Get dua nudge
            const spiritualNudge = getSpiritualNudge();
            setNudge(spiritualNudge);

            // Get next prayer
            const nextPrayer = await getNextPrayer();
            setPrayerReminder(nextPrayer);

            // Get current prayer info
            const prayerInfo = await getCurrentPrayer();
            setCurrentPrayer(prayerInfo);

            // Activate orb
            setIsActive(true);
        } catch (error) {
            console.error("Failed to fetch spiritual context:", error);
        }
    }, []);

    useEffect(() => {
        refreshContext();

        // Refresh every 5 minutes
        const interval = setInterval(refreshContext, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [refreshContext]);

    return (
        <>
            {/* The Orb - Floating Indicator */}
            <motion.button
                onClick={() => setIsExpanded(true)}
                className={`fixed bottom-6 right-6 z-40 ${className}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Outer glow ring - pulses when active */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={isActive ? {
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0, 0.4]
                    } : {}}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ width: 44, height: 44 }}
                />

                {/* Inner orb - clean minimal design */}
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Moon className="w-5 h-5 text-primary-foreground fill-current" />
                </div>
            </motion.button>

            {/* Expanded Panel - Spiritual Context */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 100 || info.velocity.y > 500) {
                                    setIsExpanded(false);
                                }
                            }}
                        >
                            <div className="bg-card rounded-t-3xl border-t border-x border-border shadow-xl overflow-hidden">
                                {/* Handle */}
                                <div className="flex justify-center pt-3 pb-2">
                                    <div className="w-10 h-1 rounded-full bg-border" />
                                </div>

                                {/* Header */}
                                <div className="flex items-center justify-between px-6 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Moon className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">Spiritual Moment</span>
                                    </div>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/30 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-foreground/70" />
                                    </button>
                                </div>

                                {/* Current Prayer Window */}
                                {currentPrayer?.current && (
                                    <div className="px-6 pb-4">
                                        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                        {currentPrayer.current.name} Time
                                                    </p>
                                                    <p className="text-xs text-foreground/60">
                                                        {formatTimeUntil(currentPrayer.current.minutesRemaining)} remaining
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Prayer Reminder */}
                                {prayerReminder && (
                                    <div className="px-6 pb-4">
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{prayerReminder.prayer.name}</p>
                                                    <p className="text-xs text-foreground/60">
                                                        {prayerReminder.status === 'now'
                                                            ? 'Time now'
                                                            : prayerReminder.status === 'upcoming'
                                                                ? `In ${formatTimeUntil(prayerReminder.minutesUntil)}`
                                                                : 'Recently'}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                {prayerReminder.message}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Dua Section */}
                                {nudge?.dua && (
                                    <div className="px-6 pb-6">
                                        <p className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">Today's Dua</p>
                                        <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                                            {/* Arabic */}
                                            <p className="text-2xl text-primary font-arabic text-center leading-loose" dir="rtl">
                                                {nudge.dua.arabic}
                                            </p>

                                            {/* Transliteration */}
                                            <p className="text-sm text-foreground/70 italic text-center">
                                                {nudge.dua.transliteration}
                                            </p>

                                            {/* Translation */}
                                            <p className="text-sm text-foreground/90 text-center leading-relaxed">
                                                "{nudge.dua.english}"
                                            </p>

                                            {/* Context */}
                                            <div className="pt-3 border-t border-border">
                                                <p className="text-xs text-foreground/60 text-center">
                                                    {nudge.dua.context}
                                                </p>
                                                <p className="text-[10px] text-foreground/40 text-center mt-1">
                                                    — {nudge.dua.source}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Swipe hint */}
                                <div className="flex items-center justify-center gap-2 pb-6 text-foreground/50">
                                    <ChevronUp className="w-4 h-4" />
                                    <span className="text-xs">Swipe down to close</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
