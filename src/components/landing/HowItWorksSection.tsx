"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Play, Mic, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        id: 1,
        title: "Listen",
        subtitle: "Hear the perfect recitation",
        description: "Listen to a master Qari recite each verse with perfect Tajweed. Tap any word to hear it individually.",
        image: "/screenshots/listen.jpg",
        icon: Play,
        color: "#2D5F5D"
    },
    {
        id: 2,
        title: "Practice",
        subtitle: "Record your recitation",
        description: "Recite the verse yourself and record your voice. Our AI listens to every syllable you pronounce.",
        image: "/screenshots/recording.jpg",
        icon: Mic,
        color: "#E74C3C"
    },
    {
        id: 3,
        title: "Improve",
        subtitle: "Get AI-powered feedback",
        description: "Receive instant, personalized feedback on your pronunciation with specific Tajweed corrections.",
        image: "/screenshots/ai-feedback.jpg",
        icon: Sparkles,
        color: "#E8C49A"
    },
    {
        id: 4,
        title: "Understand",
        subtitle: "Learn word by word",
        description: "See translations in English and Bangla. Understand each Arabic word individually with transliteration.",
        image: "/screenshots/meaning.jpg",
        icon: BookOpen,
        color: "#9B59B6"
    }
];

export default function HowItWorksSection() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="relative w-full bg-[#0A0A0A] py-20 md:py-32 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0A0A0A] to-[#1A1A1A]" />
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2D5F5D]/10 rounded-full blur-[200px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#E8C49A]/5 rounded-full blur-[180px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <motion.div
                    className="text-center mb-12 lg:mb-0 lg:text-left"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-[11px] text-[#E8C49A]/60 uppercase tracking-[0.3em]">
                        How It Works
                    </span>
                    <h2 className="font-serif text-[36px] md:text-[48px] text-white mt-4 leading-tight">
                        Four steps to<br />
                        <span className="text-[#E8C49A]">perfect recitation</span>
                    </h2>
                </motion.div>

                {/* Desktop Layout: Side by Side */}
                <div className="hidden lg:grid lg:grid-cols-2 gap-20 items-center mt-10">
                    {/* Steps List */}
                    <div className="space-y-3">
                        {steps.map((step, index) => (
                            <motion.button
                                key={step.id}
                                onClick={() => setActiveStep(index)}
                                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${activeStep === index
                                    ? "bg-white/10 border-white/20"
                                    : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10"
                                    }`}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeStep === index
                                        ? "bg-gradient-to-br from-[#2D5F5D] to-[#1A3B3A]"
                                        : "bg-white/5"
                                        }`}>
                                        <step.icon className={`w-5 h-5 ${activeStep === index ? "text-[#E8C49A]" : "text-white/40"}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-semibold text-lg ${activeStep === index ? "text-white" : "text-white/60"}`}>
                                                {step.title}
                                            </h3>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${activeStep === index ? "text-[#E8C49A] rotate-90" : "text-white/20"}`} />
                                        </div>
                                        <p className={`text-sm mt-0.5 ${activeStep === index ? "text-white/70" : "text-white/40"}`}>
                                            {step.subtitle}
                                        </p>
                                    </div>
                                </div>
                                {activeStep === index && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-white/60 text-sm mt-3 pl-16 leading-relaxed"
                                    >
                                        {step.description}
                                    </motion.p>
                                )}
                            </motion.button>
                        ))}

                        {/* CTA */}
                        <motion.div
                            className="pt-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href="/auth/signin?redirect=/quran">
                                <button className="bg-[#E8C49A] text-[#0A1628] font-semibold px-8 py-4 rounded-full hover:bg-[#d4b088] transition-all hover:scale-105 active:scale-95">
                                    Try it now — It's free
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Phone Mockup (Desktop) */}
                    <div className="relative flex justify-end">
                        <motion.div
                            className="relative w-[300px] aspect-[9/19] rounded-[36px] bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] p-2 shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ boxShadow: "0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset" }}
                        >
                            <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-20" />
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={step.id}
                                        className="absolute inset-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: activeStep === index ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Image src={step.image} alt={step.title} fill className="object-cover" priority={index === 0} />
                                    </motion.div>
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </motion.div>
                        <motion.div
                            className="absolute -bottom-4 -left-8 bg-gradient-to-br from-[#2D5F5D] to-[#1A3B3A] px-5 py-2.5 rounded-xl shadow-xl"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#E8C49A]" />
                                <span className="text-white font-medium text-sm">AI-Powered</span>
                            </div>
                        </motion.div>
                        <div className="absolute inset-0 blur-[100px] bg-[#2D5F5D]/20 rounded-full scale-150 -z-10" />
                    </div>
                </div>

                {/* Mobile Layout: Phone below each step */}
                <div className="lg:hidden space-y-4 mt-8">
                    {steps.map((step, index) => (
                        <div key={step.id}>
                            {/* Step Button */}
                            <motion.button
                                onClick={() => setActiveStep(index)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${activeStep === index
                                    ? "bg-white/10 border-white/20"
                                    : "bg-white/5 border-white/5"
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeStep === index
                                        ? "bg-gradient-to-br from-[#2D5F5D] to-[#1A3B3A]"
                                        : "bg-white/5"
                                        }`}>
                                        <step.icon className={`w-4 h-4 ${activeStep === index ? "text-[#E8C49A]" : "text-white/40"}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${activeStep === index ? "text-white" : "text-white/60"}`}>
                                            {step.title}
                                        </h3>
                                        <p className={`text-sm ${activeStep === index ? "text-white/70" : "text-white/40"}`}>
                                            {step.subtitle}
                                        </p>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 transition-transform ${activeStep === index ? "text-[#E8C49A] rotate-90" : "text-white/20"}`} />
                                </div>
                            </motion.button>

                            {/* Phone Demo - Shows RIGHT BELOW the active step */}
                            {activeStep === index && (
                                <motion.div
                                    className="mt-4 flex flex-col items-center"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Description */}
                                    <p className="text-white/60 text-sm mb-4 text-center px-4">
                                        {step.description}
                                    </p>

                                    {/* Phone Mockup */}
                                    <div className="relative w-[220px] aspect-[9/19] rounded-[28px] bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] p-1.5 shadow-xl">
                                        <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-black">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-lg z-20" />
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}

                    {/* Mobile CTA */}
                    <motion.div
                        className="pt-6 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/auth/signin?redirect=/quran">
                            <button className="bg-[#E8C49A] text-[#0A1628] font-semibold px-8 py-4 rounded-full hover:bg-[#d4b088] transition-all">
                                Try it now — It's free
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
