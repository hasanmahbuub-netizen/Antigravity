"use client";

import { motion } from "framer-motion";

interface MeaningTabProps {
    translation: string;
}

export default function MeaningTab({ translation }: MeaningTabProps) {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Translation Card */}
            <div className="p-6 bg-card rounded-[24px] border border-border shadow-sm">
                <h3 className="text-xs font-bold tracking-widest text-muted uppercase mb-4">Translation</h3>
                <p className="font-english text-lg leading-relaxed text-foreground font-medium">
                    "{translation}"
                </p>
            </div>

            {/* Understanding */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <h3 className="text-sm font-bold text-foreground font-english">UNDERSTANDING</h3>
                </div>
                <p className="font-english text-sm text-muted leading-relaxed pl-4">
                    This verse is called the <strong>Basmala</strong>. Every surah except one begins with it. It reminds us that everything we do should start with Allah's name and remembrance.
                </p>
            </div>

            <hr className="border-border/60" />

            {/* Key Concepts */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-accent rounded-full" />
                    <h3 className="text-sm font-bold text-foreground font-english">KEY CONCEPTS</h3>
                </div>

                <div className="pl-4 space-y-4">
                    <div className="bg-muted/5 p-4 rounded-xl">
                        <p className="font-arabic text-xl mb-1 text-arabic">ٱلرَّحْمَـٰنِ (Ar-Rahman)</p>
                        <p className="text-sm text-muted">Allah's mercy extended to all creation—believers and non-believers alike.</p>
                    </div>
                    <div className="bg-muted/5 p-4 rounded-xl">
                        <p className="font-arabic text-xl mb-1 text-arabic">ٱلرَّحِيمِ (Ar-Raheem)</p>
                        <p className="text-sm text-muted">His special mercy reserved for believers in the Hereafter. A deeper, more personal mercy.</p>
                    </div>
                </div>
            </div>

            <hr className="border-border/60" />

            {/* Why this matters */}
            <div className="space-y-4 pb-20">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-secondary-accent rounded-full" />
                    <h3 className="text-sm font-bold text-foreground font-english">WHY THIS MATTERS</h3>
                </div>
                <p className="font-english text-sm text-muted leading-relaxed pl-4">
                    You recite this verse 17+ times daily in your five daily prayers. Understanding what you're saying transforms prayer from routine ritual to conscious worship and connection.
                </p>
            </div>

        </div>
    );
}
