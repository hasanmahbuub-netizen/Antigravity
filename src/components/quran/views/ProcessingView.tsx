"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProcessingView() {
    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center text-center p-6">

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-6"
            >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>

                <div>
                    <h2 className="text-xl font-medium text-foreground mb-2">Analyzing your recitation...</h2>
                    <p className="text-sm text-muted">This takes 2-3 seconds</p>
                </div>
            </motion.div>

        </div>
    );
}

