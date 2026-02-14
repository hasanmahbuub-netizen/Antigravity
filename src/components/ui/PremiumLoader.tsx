import { motion } from "framer-motion";

export function PremiumLoader({ text = "Thinking..." }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Middle Ring */}
                <motion.div
                    className="absolute inset-2 rounded-full border border-primary/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Orb */}
                <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent blur-md"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Center Core */}
                <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
            </div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-serif font-medium text-foreground tracking-wide"
            >
                {text}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-muted mt-2 uppercase tracking-widest"
            >
                Consulting Knowledge Base
            </motion.p>
        </div>
    );
}
