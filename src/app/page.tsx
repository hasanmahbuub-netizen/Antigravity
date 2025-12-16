"use client";

import Link from "next/link";
import { BookOpen, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        // Wrapper
        <div className="max-w-[430px] mx-auto min-h-screen px-5 bg-background">

            {/* Hero */}
            <section className="flex flex-col items-center justify-center min-h-screen text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-arabic text-[3.5rem] leading-tight text-arabic mb-4 mt-10"
                >
                    اقْرَأْ بِاسْمِ رَبِّكَ
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-english text-lg text-muted mb-2"
                >
                    Read in the name of your Lord
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="font-english text-base text-muted max-w-[320px] leading-relaxed mb-12"
                >
                    Your quiet companion for daily Quran and practical guidance
                </motion.p>
                <Link href="/onboarding">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="bg-primary text-primary-foreground px-8 py-4 rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.08)] active:scale-95 transition-transform duration-200 font-medium"
                    >
                        Enter IMANOS quietly
                    </motion.button>
                </Link>
            </section>

            {/* Story / Why IMANOS Exists */}
            <section className="text-center max-w-[480px] mx-auto py-16">
                <h2 className="font-english text-xl font-semibold text-foreground mb-4">
                    Faith meets clarity
                </h2>
                <p className="font-english text-base text-muted leading-relaxed">
                    Most Muslims want to connect with the Quran and daily practice — but life, uncertainty, and lack of guidance get in the way. IMANOS gives structure, habit, and clarity — quietly, thoughtfully, and without judgment.
                </p>
            </section>

            {/* How It Works */}
            <section className="pb-20 space-y-6">
                <div className="flex flex-col gap-4 max-w-[430px] mx-auto">

                    {/* Card 1 */}
                    <div className="bg-card rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] p-6 flex-1 text-center">
                        <div className="flex justify-center mb-3">
                            <BookOpen className="w-10 h-10 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-english text-lg font-semibold text-foreground mb-2">Read & Listen</h3>
                        <p className="font-english text-sm text-muted leading-relaxed">
                            One small Quran step, selected for today. Focused, private, gentle.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-card rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] p-6 flex-1 text-center">
                        <div className="flex justify-center mb-3">
                            <Eye className="w-10 h-10 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-english text-lg font-semibold text-foreground mb-2">Understand</h3>
                        <p className="font-english text-sm text-muted leading-relaxed">
                            Enough context to know what you’re reading, no overload, no confusion.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-card rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] p-6 flex-1 text-center">
                        <div className="flex justify-center mb-3">
                            <Sparkles className="w-10 h-10 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-english text-lg font-semibold text-foreground mb-2">Practice</h3>
                        <p className="font-english text-sm text-muted leading-relaxed">
                            Private recitation. No scores. No judgment. Just your daily reflection.
                        </p>
                    </div>

                </div>
            </section>

        </div>
    );
}
