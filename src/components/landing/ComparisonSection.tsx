"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisons = [
    {
        feature: "AI Pronunciation Feedback",
        others: false,
        meek: true,
        description: "Real-time Tajweed analysis with Whisper + Gemini"
    },
    {
        feature: "Word-by-Word Breakdown",
        others: false,
        meek: true,
        description: "Tap any word to hear it and see translation"
    },
    {
        feature: "Islamic Fiqh Q&A",
        others: false,
        meek: true,
        description: "Ask any question, get madhab-specific answers"
    },
    {
        feature: "Multiple Madhab Support",
        others: false,
        meek: true,
        description: "Hanafi, Shafi'i, Maliki, Hanbali perspectives"
    },
    {
        feature: "Completely Free",
        others: false,
        meek: true,
        description: "No paywalls, no subscriptions, no ads"
    },
    {
        feature: "Works on Any Device",
        others: true,
        meek: true,
        description: "Web app works on mobile, tablet, desktop"
    }
];

export default function ComparisonSection() {
    return (
        <section className="relative w-full bg-gradient-to-b from-[#0F1D32] to-[#0A1628] py-24 md:py-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#2D5F5D]/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#E8C49A]/5 rounded-full blur-[120px]" />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-[11px] text-[#E8C49A]/60 uppercase tracking-[0.3em]">
                        Why Choose Meek
                    </span>
                    <h2 className="font-serif text-[36px] md:text-[48px] text-white mt-4">
                        Not just another <span className="text-[#E8C49A] italic">Quran app</span>
                    </h2>
                    <p className="text-white/50 mt-4 max-w-xl mx-auto">
                        Most apps show you the text. We actually teach you to read it properly.
                    </p>
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    className="rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-white/5">
                        <div className="text-white/60 font-medium">Feature</div>
                        <div className="text-center text-white/60 font-medium">Other Apps</div>
                        <div className="text-center text-[#E8C49A] font-semibold">Meek</div>
                    </div>

                    {/* Table Rows */}
                    {comparisons.map((item, index) => (
                        <motion.div
                            key={item.feature}
                            className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div>
                                <p className="text-white font-medium">{item.feature}</p>
                                <p className="text-white/40 text-sm mt-1 hidden md:block">{item.description}</p>
                            </div>
                            <div className="flex justify-center items-center">
                                {item.others ? (
                                    <div className="w-8 h-8 rounded-full bg-[#2D5F5D]/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-[#2D5F5D]" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <X className="w-4 h-4 text-red-400/60" />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center items-center">
                                <div className="w-8 h-8 rounded-full bg-[#2D5F5D] flex items-center justify-center">
                                    <Check className="w-4 h-4 text-[#E8C49A]" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
