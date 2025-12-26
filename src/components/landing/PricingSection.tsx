"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Clock, Crown } from "lucide-react";
import Link from "next/link";

const freeTierFeatures = [
    "All 114 Surahs",
    "AI Tajweed Feedback",
    "Word-by-Word Translation",
    "Listen to Qari Recitation",
    "Fiqh Q&A (5/day)",
    "English & Bangla Translation"
];

const proTierFeatures = [
    "Guidance for real situations, not just textbook answers",
    "Clear explanations when scholars differ — without pressure",
    "Help with work, money, family, and daily choices",
    "A personal space that remembers what you're learning",
    "Designed to support consistency, not overwhelm"
];

export default function PricingSection() {
    return (
        <section className="relative w-full bg-[#0A0A0A] py-24 md:py-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2D5F5D]/10 rounded-full blur-[200px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#E8C49A]/5 rounded-full blur-[180px]" />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-[11px] text-[#E8C49A]/60 uppercase tracking-[0.3em]">
                        Simple Pricing
                    </span>
                    <h2 className="font-serif text-[36px] md:text-[48px] text-white mt-4">
                        Free now. <span className="text-[#E8C49A] italic">Pro coming soon.</span>
                    </h2>
                    <p className="text-white/50 mt-4 max-w-xl mx-auto">
                        Start your Quran journey today at no cost. Pro features coming in v2.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Free Tier */}
                    <motion.div
                        className="relative rounded-3xl border border-white/10 backdrop-blur-xl bg-white/5 p-8 hover:border-white/20 transition-all"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D5F5D]/20 border border-[#2D5F5D]/30 mb-6">
                            <Sparkles className="w-4 h-4 text-[#2D5F5D]" />
                            <span className="text-sm text-[#2D5F5D] font-medium">Current Version</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-[#E8C49A]">$0</span>
                            <span className="text-white/40">/forever</span>
                        </div>

                        <p className="text-white/60 mb-8">
                            Everything you need to learn Quran pronunciation properly.
                        </p>

                        {/* Features */}
                        <ul className="space-y-4 mb-8">
                            {freeTierFeatures.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#2D5F5D]/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-[#2D5F5D]" />
                                    </div>
                                    <span className="text-white/80">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <Link href="/auth/signin?redirect=/quran">
                            <button className="w-full py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all">
                                Get Started Free
                            </button>
                        </Link>
                    </motion.div>

                    {/* Pro Tier */}
                    <motion.div
                        className="relative rounded-3xl border border-[#E8C49A]/30 backdrop-blur-xl bg-gradient-to-br from-[#E8C49A]/10 to-transparent p-8"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8C49A]/20 border border-[#E8C49A]/30 mb-6">
                            <Clock className="w-4 h-4 text-[#E8C49A]" />
                            <span className="text-sm text-[#E8C49A] font-medium">Coming in v2</span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">From learning to living</h3>
                        </div>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-2xl font-bold text-[#E8C49A]">Announced with v2</span>
                        </div>

                        <p className="text-white/60 mb-8 leading-relaxed">
                            Built for Muslims navigating modern life — carefully, not loudly.
                        </p>

                        {/* Features */}
                        <ul className="space-y-4 mb-8">
                            {proTierFeatures.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#E8C49A]/20 flex items-center justify-center mt-0.5 shrink-0">
                                        <Check className="w-3 h-3 text-[#E8C49A]" />
                                    </div>
                                    <span className="text-white/80 text-sm leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <button
                            disabled
                            className="w-full py-4 rounded-full bg-[#E8C49A]/20 border border-[#E8C49A]/30 text-[#E8C49A] font-semibold cursor-not-allowed opacity-70"
                        >
                            Coming in v2
                        </button>

                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E8C49A]/20 to-transparent rounded-tr-3xl rounded-bl-[60px]" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
