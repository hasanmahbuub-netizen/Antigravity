"use client";

import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";

interface VerseCompletedModalProps {
    onContinue: () => void;
}

export default function VerseCompletedModal({ onContinue }: VerseCompletedModalProps) {
    return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background w-full max-w-sm rounded-[24px] p-8 text-center shadow-2xl relative overflow-hidden"
            >
                {/* Confetti (CSS Background or simplified) */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                    <Check className="w-10 h-10" strokeWidth={3} />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">Verse 1 Completed!</h2>
                <p className="text-muted text-sm mb-8 leading-relaxed">
                    MashAllah, you've mastered the first verse of Al-Fatiha.
                </p>

                <button
                    onClick={onContinue}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                    Continue to Verse 2
                    <ChevronRight className="w-4 h-4" />
                </button>

            </motion.div>
        </div>
    );
}

