"use client";

import { motion } from "framer-motion";
import { Play, RotateCcw, CheckCircle, ChevronRight } from "lucide-react";

interface FeedbackViewProps {
    onRetry: () => void;
    onComplete: () => void;
}

export default function FeedbackView({ onRetry, onComplete }: FeedbackViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto p-6 space-y-8"
        >
            {/* 1. Comparison Section */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold tracking-widest text-muted uppercase">AUDIO COMPARISON</h3>

                {/* Your Recording */}
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Your Recitation</p>
                        <div className="w-full h-1 bg-muted/20 rounded-full mt-2 overflow-hidden">
                            <div className="w-[60%] h-full bg-primary rounded-full" />
                        </div>
                    </div>
                    <span className="text-xs text-muted font-mono">0:04</span>
                </div>

                {/* Teacher's Reference */}
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 opacity-70">
                    <button className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center text-muted-foreground">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Teacher's Recitation</p>
                        <div className="w-full h-1 bg-muted/20 rounded-full mt-2" />
                    </div>
                    <span className="text-xs text-muted font-mono">0:03</span>
                </div>
            </section>

            {/* 2. AI Feedback */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">AI Feedback</div>
                    <span className="text-sm text-green-600 font-bold">94% Match</span>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Good pronunciation
                    </div>
                    <p className="text-sm text-green-700/80 pl-6 leading-relaxed">
                        You enunciated "Ar-Rahman" clearly. Keep it up!
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-orange-700 font-medium text-sm">
                        <span className="w-4 h-4 flex items-center justify-center font-bold text-xs bg-orange-200 rounded-full">!</span>
                        Tip to improve
                    </div>
                    <p className="text-sm text-orange-700/80 pl-6 leading-relaxed">
                        Try to elongate the vowel in "Raheem" slightly more (2 counts).
                    </p>
                </div>
            </section>

            {/* 3. Actions */}
            <section className="pt-4 space-y-3">
                <button
                    onClick={onComplete}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Complete
                </button>

                <button
                    onClick={onRetry}
                    className="w-full py-4 rounded-xl border border-border text-muted font-medium flex items-center justify-center gap-2 hover:bg-muted/5 active:scale-[0.98] transition-all"
                >
                    <RotateCcw className="w-4 h-4" />
                    Practice Again
                </button>
            </section>

        </motion.div>
    );
}
