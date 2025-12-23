"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Play, Mic, Volume2, CheckCircle } from "lucide-react";

export default function DemoSection() {
    const [demoStep, setDemoStep] = useState<"idle" | "playing" | "recording" | "feedback">("idle");
    const [showBubble, setShowBubble] = useState<string | null>(null);

    const handlePlay = () => {
        setDemoStep("playing");
        setShowBubble("Crystal clear recitation");
        setTimeout(() => setShowBubble(null), 3000);
        setTimeout(() => setDemoStep("idle"), 4000);
    };

    const handleRecord = () => {
        setDemoStep("recording");
        setShowBubble("AI listens to your pronunciation");
        setTimeout(() => {
            setShowBubble(null);
            setDemoStep("feedback");
            setShowBubble("Specific guidance, not generic tips");
            setTimeout(() => setShowBubble(null), 3000);
        }, 3000);
    };

    return (
        <section className="relative w-full bg-[#FAFAFA] py-24 md:py-32">
            {/* Section Headline */}
            <motion.h2
                className="font-serif text-[40px] md:text-[56px] text-[#2B2B2B] text-center mb-16 md:mb-20 px-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                See how it works
            </motion.h2>

            {/* Demo Container */}
            <div className="relative max-w-[500px] mx-auto px-6">

                {/* Floating Annotation Bubbles */}
                <AnimatePresence>
                    {showBubble && (
                        <motion.div
                            className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-[#2D5F5D] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: -30 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            {showBubble}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Phone Mockup */}
                <motion.div
                    className="relative mx-auto"
                    style={{ maxWidth: "380px" }}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Phone Frame */}
                    <div
                        className="relative rounded-[40px] bg-[#1A1A1A] p-3 shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
                        style={{ aspectRatio: "9/19" }}
                    >
                        {/* Screen */}
                        <div className="relative w-full h-full rounded-[32px] bg-[#0F0F0F] overflow-hidden">

                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1A1A1A] rounded-b-2xl z-10" />

                            {/* App Content */}
                            <div className="absolute inset-0 pt-12 pb-6 px-5 flex flex-col">

                                {/* Header */}
                                <div className="text-center mb-6">
                                    <span className="text-[11px] text-gray-500 uppercase tracking-widest">Surah Al-Fatiha</span>
                                    <p className="text-gray-400 text-xs mt-1">Verse 1 of 7</p>
                                </div>

                                {/* Arabic Text */}
                                <div className="flex-1 flex items-center justify-center">
                                    <motion.p
                                        className="font-arabic text-[28px] text-[#E8C49A] text-center leading-loose"
                                        animate={demoStep === "playing" ? {
                                            textShadow: ["0 0 0px rgba(232,196,154,0)", "0 0 30px rgba(232,196,154,0.6)", "0 0 0px rgba(232,196,154,0)"]
                                        } : {}}
                                        transition={{ duration: 2, repeat: demoStep === "playing" ? 1 : 0 }}
                                    >
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                                    </motion.p>
                                </div>

                                {/* Feedback Panel (when shown) */}
                                <AnimatePresence>
                                    {demoStep === "feedback" && (
                                        <motion.div
                                            className="bg-[#1A2A1A] border border-green-900/30 rounded-xl p-4 mb-4"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-green-400 text-sm font-medium">85% Accuracy</span>
                                            </div>
                                            <p className="text-gray-400 text-xs leading-relaxed">
                                                Great pronunciation of "Bismillah". Work on the "ح" in "الرحمن" - it should come from deeper in the throat.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-auto">
                                    <button
                                        onClick={handlePlay}
                                        disabled={demoStep !== "idle" && demoStep !== "feedback"}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all ${demoStep === "playing"
                                                ? "bg-[#2D5F5D] text-white"
                                                : "bg-[#1A1A1A] border border-gray-800 text-gray-300 hover:border-[#2D5F5D]"
                                            }`}
                                    >
                                        {demoStep === "playing" ? (
                                            <Volume2 className="w-4 h-4 animate-pulse" />
                                        ) : (
                                            <Play className="w-4 h-4" />
                                        )}
                                        <span>{demoStep === "playing" ? "Playing..." : "Listen"}</span>
                                    </button>

                                    <button
                                        onClick={handleRecord}
                                        disabled={demoStep !== "idle" && demoStep !== "feedback"}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all ${demoStep === "recording"
                                                ? "bg-red-600 text-white animate-pulse"
                                                : "bg-[#2D5F5D] text-white hover:brightness-110"
                                            }`}
                                    >
                                        <Mic className="w-4 h-4" />
                                        <span>{demoStep === "recording" ? "Recording..." : "Practice"}</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
                </motion.div>

                {/* CTA Below Phone */}
                <motion.p
                    className="text-center text-gray-500 text-sm mt-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    Try it yourself ↑ Tap the buttons above
                </motion.p>
            </div>

            {/* Three Principles */}
            <motion.div
                className="max-w-4xl mx-auto mt-24 px-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
                    {[
                        { num: "1", title: "Listen", line1: "Hear correct", line2: "pronunciation", sub1: "No apps.", sub2: "No downloads." },
                        { num: "2", title: "Practice", line1: "Record yourself", line2: "trying", sub1: "No judgment.", sub2: "No pressure." },
                        { num: "3", title: "Improve", line1: "Get specific", line2: "feedback", sub1: "Until you're", sub2: "confident." },
                    ].map((item, i) => (
                        <div key={i} className="relative">
                            {/* Large Number Behind */}
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[72px] font-bold text-[#2D5F5D]/10 pointer-events-none">
                                {item.num}
                            </span>

                            <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4 relative z-10">
                                {item.title}
                            </h3>
                            <p className="text-[#6B6B6B] leading-relaxed text-base">
                                {item.line1}<br />{item.line2}
                            </p>
                            <p className="text-[#9B9B9B] text-sm mt-3">
                                {item.sub1}<br />{item.sub2}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
