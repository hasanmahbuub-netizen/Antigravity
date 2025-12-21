"use client";

import { motion } from "framer-motion";

interface MeaningTabProps {
    translation: string;
    arabic?: string;
}

export default function MeaningTab({ translation, arabic }: MeaningTabProps) {
    // Parse Arabic words for display
    const arabicWords = arabic ? arabic.split(' ').filter(w => w.trim()) : [];

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Translation Card */}
            <div className="p-6 bg-card rounded-[24px] border border-border shadow-sm">
                <h3 className="text-xs font-bold tracking-widest text-muted uppercase mb-4">Translation</h3>
                <p className="font-english text-lg leading-relaxed text-foreground font-medium">
                    "{translation || "Translation loading..."}"
                </p>
            </div>

            {/* Arabic with Word Breakdown */}
            {arabicWords.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-primary rounded-full" />
                        <h3 className="text-sm font-bold text-foreground font-english">WORD BREAKDOWN</h3>
                    </div>
                    <div className="pl-4 space-y-3">
                        {arabicWords.map((word, i) => (
                            <div key={i} className="bg-muted/5 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <span className="text-xs text-muted">Word {i + 1}</span>
                                </div>
                                <p className="font-arabic text-2xl text-arabic" dir="rtl">{word}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <hr className="border-border/60" />

            {/* Understanding */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-accent rounded-full" />
                    <h3 className="text-sm font-bold text-foreground font-english">UNDERSTANDING</h3>
                </div>
                <p className="font-english text-sm text-muted leading-relaxed pl-4">
                    Take time to understand this verse. Reflect on its meaning and how it applies to your life.
                    The Quran is not just meant to be recited, but understood and lived.
                </p>
            </div>

            <hr className="border-border/60" />

            {/* Why this matters */}
            <div className="space-y-4 pb-20">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-secondary-accent rounded-full" />
                    <h3 className="text-sm font-bold text-foreground font-english">TIP</h3>
                </div>
                <p className="font-english text-sm text-muted leading-relaxed pl-4">
                    Try to memorize this verse along with its meaning. When you understand what you recite,
                    your prayers become more meaningful and your connection with Allah grows stronger.
                </p>
            </div>

        </div>
    );
}
