"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "Is Meek really free?",
        answer: "Yes! Meek is completely free to use right now. All 114 Surahs, AI Tajweed feedback, translations, and Fiqh Q&A are available at no cost. We're building a sustainable model with a Pro tier coming in v2, but the core learning experience will always remain free."
    },
    {
        question: "How accurate is the AI Tajweed feedback?",
        answer: "Our system uses a dual-engine approach: Whisper-v3 transcribes your Arabic speech to measure word accuracy (WER), then Gemini 2.5 Flash analyzes pronunciation details like Makhraj, Madd, and Ghunnah. This 'Phonetic Blueprint' approach is designed to be honest—if you don't speak, you get 0%. We don't give fake scores."
    },
    {
        question: "Which madhabs are supported for Fiqh Q&A?",
        answer: "We support all four major Sunni madhabs: Hanafi, Shafi'i, Maliki, and Hanbali. When you ask a question, you can select your preferred madhab and receive answers with proper citations from authentic Islamic sources."
    },
    {
        question: "Can I use Meek offline?",
        answer: "Currently, Meek requires an internet connection for AI features (Tajweed analysis, Fiqh Q&A). Offline mode is planned for the Pro tier in v2, which will let you download Surahs and practice without connectivity."
    },
    {
        question: "Who made this app?",
        answer: "Meek was built by Muslims, for Muslims. Our mission is to make Quranic education accessible to everyone, regardless of location or financial situation. We combine modern AI technology with traditional Tajweed knowledge to create something truly beneficial."
    },
    {
        question: "What's coming in v2?",
        answer: "Version 2 will introduce the Pro tier with features like: unlimited Fiqh Q&A, personal progress tracking, offline mode, advanced Tajweed reports with specific correction timestamps, and a personalized learning path based on your weak areas."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative w-full bg-gradient-to-b from-[#0A0A0A] to-[#0A1628] py-24 md:py-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#2D5F5D]/10 rounded-full blur-[150px]" />

            <div className="relative z-10 max-w-3xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <HelpCircle className="w-5 h-5 text-[#E8C49A]" />
                        <span className="text-[11px] text-[#E8C49A]/60 uppercase tracking-[0.3em]">
                            FAQ
                        </span>
                    </div>
                    <h2 className="font-serif text-[36px] md:text-[48px] text-white">
                        Common <span className="text-[#E8C49A] italic">questions</span>
                    </h2>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Question */}
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="text-white font-medium pr-4">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-[#E8C49A] flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Answer */}
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 pt-0">
                                            <p className="text-white/60 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
