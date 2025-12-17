"use client";

import { Play, Volume2, ChevronRight, ChevronLeft } from "lucide-react";

export default function ListenTab() {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Main Verse Display */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                <h1 className="font-arabic text-3xl md:text-5xl leading-loose text-arabic">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </h1>

                <div className="space-y-1">
                    <p className="font-english text-sm text-muted/60">Bis-mil-lah hir-Rahman ir-Raheem</p>
                    <p className="font-english text-base text-muted font-medium">
                        "In the name of Allah, the Entirely Merciful, the Especially Merciful"
                    </p>
                </div>

                {/* Audio Player CTA */}
                <button className="w-full py-4 rounded-xl bg-card border border-border flex items-center justify-center gap-3 text-primary font-medium shadow-sm hover:bg-muted/5 active:scale-[0.98] transition-all">
                    <Play className="w-5 h-5 fill-current" />
                    <span>Play Sheikh (0:03)</span>
                </button>
            </div>

            <div className="h-[1px] bg-border w-full my-2" />

            {/* Word by Word (Scrollable) */}
            <div className="h-[200px] overflow-y-auto px-6 pb-6 space-y-4">
                <h3 className="text-xs font-bold tracking-widest text-muted uppercase mb-4 sticky top-0 bg-background py-2">
                    Word-by-Word Breakdown
                </h3>

                {[
                    { ar: "بِسْمِ", en: "In the name", tr: "Bis-mi" },
                    { ar: "ٱللَّهِ", en: "of Allah", tr: "Allahi" },
                    { ar: "ٱلرَّحْمَـٰنِ", en: "the Most Gracious", tr: "ar-Rahman" },
                    { ar: "ٱلرَّحِيمِ", en: "the Most Merciful", tr: "ar-Raheen" },
                ].map((word, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/5 transition-colors border-b border-border/40 last:border-0 cursor-pointer group">
                        <div className="flex flex-col text-left">
                            <span className="font-english text-xs text-muted/60">{word.tr}</span>
                            <span className="font-english text-sm font-medium text-foreground">{word.en}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-arabic text-xl text-arabic">{word.ar}</span>
                            <button className="p-2 rounded-full bg-muted/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                <Volume2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
