"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
    Headphones,
    Mic2,
    Brain,
    BookOpen,
    Clock,
    Shield,
    Sparkles,
    Globe,
    Heart,
    Zap
} from "lucide-react";

const features = [
    {
        icon: Headphones,
        title: "Listen to Masters",
        description: "High-quality recitations from renowned Qaris with word-by-word playback",
        gradient: "from-emerald-500/20 to-teal-500/20",
        iconColor: "text-emerald-400"
    },
    {
        icon: Mic2,
        title: "Record & Compare",
        description: "Record your recitation and compare side-by-side with the teacher's version",
        gradient: "from-rose-500/20 to-pink-500/20",
        iconColor: "text-rose-400"
    },
    {
        icon: Brain,
        title: "AI Tajweed Analysis",
        description: "Get instant feedback on Makhraj, Ghunnah, Madd and more from our AI",
        gradient: "from-amber-500/20 to-orange-500/20",
        iconColor: "text-amber-400"
    },
    {
        icon: BookOpen,
        title: "Word-by-Word",
        description: "Understand every word with translations, transliterations, and tafsir",
        gradient: "from-violet-500/20 to-purple-500/20",
        iconColor: "text-violet-400"
    },
    {
        icon: Globe,
        title: "Multiple Languages",
        description: "Translations in English, Bangla, Urdu, and more languages coming soon",
        gradient: "from-cyan-500/20 to-blue-500/20",
        iconColor: "text-cyan-400"
    },
    {
        icon: Heart,
        title: "Fiqh Q&A",
        description: "Ask any Islamic question and get madhab-specific answers with citations",
        gradient: "from-pink-500/20 to-rose-500/20",
        iconColor: "text-pink-400"
    }
];

const stats = [
    { value: "114", label: "Surahs Available", icon: BookOpen },
    { value: "6,236", label: "Verses to Learn", icon: Sparkles },
    { value: "<2s", label: "AI Response Time", icon: Zap },
    { value: "4", label: "Madhabs Supported", icon: Shield }
];

export default function FeaturesShowcase() {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#FAFAF5] py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#2D5F5D]/5 rounded-full blur-[150px]" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#E8C49A]/5 rounded-full blur-[120px]" />

            {/* Section Header */}
            <motion.div
                className="text-center mb-20 px-6"
                style={{ opacity, y }}
            >
                <span className="text-[11px] text-[#2D5F5D]/60 uppercase tracking-[0.3em]">
                    Everything You Need
                </span>
                <h2 className="font-serif text-[42px] md:text-[56px] text-[#2B2B2B] mt-4">
                    Features that <span className="italic text-[#2D5F5D]">transform</span>
                </h2>
                <p className="text-[#6B6B6B] text-lg mt-4 max-w-xl mx-auto">
                    Every tool designed with one goal: help you recite the Quran beautifully
                </p>
            </motion.div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="group relative"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {/* Card */}
                            <div className={`relative h-full p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} border border-white/60 backdrop-blur-sm hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer`}>
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-3">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[#6B6B6B] leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Arrow */}
                                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-[#2D5F5D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Stats Bar */}
            <motion.div
                className="max-w-5xl mx-auto mt-24 px-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center p-6 rounded-2xl bg-white/60 border border-[#2D5F5D]/10 hover:bg-white hover:shadow-lg transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <stat.icon className="w-6 h-6 mx-auto text-[#2D5F5D]/60 mb-3" />
                            <p className="text-[32px] md:text-[40px] font-bold text-[#2D5F5D]">
                                {stat.value}
                            </p>
                            <p className="text-sm text-[#6B6B6B] mt-1">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
