"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw, CheckCircle, ChevronRight, Volume2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { TajweedFeedback } from "@/lib/ai-service";

interface FeedbackViewProps {
    onRetry: () => void;
    onComplete: () => void;
    onNextVerse?: () => void;
    feedback: TajweedFeedback | null;
    surahName: string;
    verseNumber: number;
    teacherAudioUrl: string;
}

export default function FeedbackView({
    onRetry,
    onComplete,
    onNextVerse,
    feedback,
    surahName,
    verseNumber,
    teacherAudioUrl
}: FeedbackViewProps) {
    const playTeacherAudio = () => {
        if (teacherAudioUrl) {
            new Audio(teacherAudioUrl).play();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col h-full overflow-hidden bg-background"
        >
            {/* 1. Header (Context) */}
            <header className="px-6 py-4 flex flex-col items-center border-b border-border/50 shrink-0">
                <span className="text-sm font-bold font-english text-foreground">{surahName}</span>
                <p className="text-xs text-muted font-mono mt-1">Verse {verseNumber}</p>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 2. Your Recitation (Mock UI for now) */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Your Recitation</h3>
                    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                        <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                        </button>
                        <div className="flex-1 space-y-2">
                            <div className="h-8 flex items-center gap-0.5">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className={cn("w-1 rounded-full bg-primary/20", i % 3 === 0 ? "h-6 bg-primary" : "h-3")} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-border w-full" />

                {/* 3. Teacher's Version */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Teacher's Version</h3>
                    <div className="bg-card/50 border border-border rounded-2xl p-4 flex items-center gap-4">
                        <button
                            onClick={playTeacherAudio}
                            className="w-12 h-12 rounded-full bg-muted/20 text-muted-foreground flex items-center justify-center hover:bg-muted/30 transition-colors"
                        >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                        </button>
                        <div className="flex-1 space-y-2">
                            <div className="h-8 flex items-center gap-0.5 opacity-60">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className={cn("w-1 rounded-full bg-muted-foreground/20", i % 2 === 0 ? "h-5 bg-muted-foreground" : "h-2")} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-border w-full" />

                {/* 4. Feedback */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-primary flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-sm shadow-sm ring-4 ring-yellow-50">✨</span>
                            AI Analysis: {feedback?.score}% Match
                        </span>
                    </div>

                    <div className="space-y-3">
                        {/* Positives */}
                        {feedback?.positives.map((pos, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{pos}</p>
                                </div>
                            </div>
                        ))}

                        {/* Improvements */}
                        {feedback?.improvements.map((imp, i) => (
                            <div key={i} className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mt-4 space-y-3">
                                <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-widest">
                                    <Info className="w-4 h-4" />
                                    To Improve
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed font-english">
                                    {imp}
                                </p>
                            </div>
                        ))}

                        {feedback?.details && (
                            <p className="text-xs text-muted italic mt-4 px-1 leading-relaxed">
                                {feedback.details}
                            </p>
                        )}
                    </div>
                </section>

                <div className="h-px bg-border w-full" />

                {/* 5. What Next Actions */}
                <section className="space-y-4 pb-10">
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">What Next?</h3>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={onRetry}
                            className="w-full py-4 rounded-xl border border-border bg-card text-muted-foreground font-medium flex items-center justify-center gap-2 hover:bg-muted/5 active:scale-[0.98] transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Practice Again
                        </button>

                        <button
                            onClick={onComplete}
                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Mark Verse Complete
                        </button>

                        <button
                            onClick={onNextVerse || onComplete}
                            className="w-full py-3 rounded-xl text-primary font-medium flex items-center justify-center gap-1 hover:bg-primary/5 active:scale-[0.98] transition-all text-sm"
                        >
                            Skip to Next Verse
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

            </div>

        </motion.div>
    );
}

