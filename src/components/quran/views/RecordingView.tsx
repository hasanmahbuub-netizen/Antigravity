"use client";

import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

export default function RecordingView({ onCancel }: { onCancel: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center text-center p-6"
        >
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">

                {/* 1. Status */}
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-bold tracking-widest text-primary uppercase">Recording</span>
                    <span className="font-mono text-muted w-10 text-left">0:04</span>
                </div>

                {/* 2. Waveform Visualization (CSS Animation) */}
                <div className="h-40 flex items-center justify-center gap-1 mb-12 w-full">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 40, 10] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            }}
                            className="w-2 bg-primary/20 rounded-full"
                        />
                    ))}
                </div>

                {/* 3. Prompt */}
                <h2 className="font-english text-xl font-medium text-foreground mb-4">
                    Recite the verse...
                </h2>

                {/* 4. Stop Action (Replacing Release instruction) */}
                <button
                    onClick={onCancel} // In logic, this would be onStop -> processing
                    className="mt-8 w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors border-2 border-red-500/20"
                >
                    <Square className="w-6 h-6 fill-current" />
                </button>
                <p className="mt-4 text-sm text-muted">Tap to stops</p>

            </div>

            {/* 5. Footer / Cancel */}
            <div className="pb-10">
                <button
                    onClick={onCancel}
                    className="text-sm text-muted hover:text-red-500 font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </motion.div>
    );
}
