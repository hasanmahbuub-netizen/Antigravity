"use client";

import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PracticeTabProps {
    onStartRecording: () => void;
}

export default function PracticeTab({ onStartRecording }: PracticeTabProps) {
    return (
        <div className="flex-1 flex flex-col h-full items-center justify-center p-6 text-center">

            <div className="mb-12 space-y-4">
                <p className="font-english text-xs tracking-widest text-muted uppercase font-bold">READY TO RECITE?</p>
                <h1 className="font-arabic text-3xl md:text-5xl leading-loose text-arabic">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </h1>
                <p className="font-english text-sm text-muted/60">Bis-mil-lah hir-Rahman ir-Raheem</p>
            </div>

            {/* Mic Button Interaction */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onStartRecording}
                className="w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-xl bg-card border-border shadow-black/5 hover:border-accent hover:bg-accent/5 group cursor-pointer"
            >
                <Mic className="w-10 h-10 text-muted transition-colors group-hover:text-accent" />
            </motion.button>

            <p className="mt-8 text-sm text-muted font-medium animate-pulse">
                Tap mic to START recording
            </p>

        </div>
    );
}
