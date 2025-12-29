"use client";

import { motion } from "framer-motion";
import { BookX, Clock, Users, Smartphone, Headphones, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const problems = [
    {
        icon: BookX,
        title: "YouTube Videos",
        subtitle: "Too generic",
        description: "Generic tutorials don't address your specific pronunciation issues"
    },
    {
        icon: Users,
        title: "Family & Friends",
        subtitle: "They're busy",
        description: "Your loved ones have their own lives and can't always be there"
    },
    {
        icon: Smartphone,
        title: "Quran Apps",
        subtitle: "Just show text",
        description: "Most apps display verses but don't actually teach you to read"
    },
    {
        icon: Clock,
        title: "Masjid Classes",
        subtitle: "Limited time",
        description: "Weekly classes are great but not enough for daily practice"
    },
    {
        icon: Headphones,
        title: "Audio Recitations",
        subtitle: "Passive listening",
        description: "You listen but never get feedback on your own recitation"
    },
    {
        icon: MessageCircle,
        title: "Online Tutors",
        subtitle: "Expensive",
        description: "Quality Quran teachers cost $30-50/hour - not for everyone"
    }
];

export default function ProblemSection() {
    // Duplicate cards for seamless loop
    const allProblems = [...problems, ...problems];
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let animationId: number;

        const animate = () => {
            if (!isPaused && container) {
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                } else {
                    container.scrollLeft += 0.6; // Smooth auto-scroll
                }
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isPaused]);

    return (
        <section className="relative w-full bg-gradient-to-b from-[#0A1628] to-[#0F1D32] py-24 md:py-32 overflow-hidden">
            {/* Ambient Glow Effects */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#2D5F5D]/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E8C49A]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Section Header */}
            <motion.div
                className="text-center mb-16 px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <span className="text-[11px] text-[#E8C49A]/60 uppercase tracking-[0.2em]">The Reality</span>
                <h2 className="font-serif text-[36px] md:text-[48px] text-white mt-4">
                    Most Muslims can't read properly
                </h2>
                <p className="text-[18px] md:text-[20px] text-white/60 mt-4 max-w-xl mx-auto">
                    Not because of faith. Not because of effort.<br />
                    <span className="text-white/80 font-medium">Because no one taught them how.</span>
                </p>
            </motion.div>

            {/* Interactive Scroll Container */}
            <div className="relative w-full">
                {/* Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-[#0A1628] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-[#0F1D32] to-transparent z-10 pointer-events-none" />

                {/* Scrolling Container */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto no-scrollbar pb-4 px-6 md:px-24"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {allProblems.map((problem, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[280px] md:w-[320px] mx-3"
                        >
                            {/* Glassmorphism Card */}
                            <motion.div
                                className="relative h-full p-6 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group select-none"
                                whileHover={{ y: -5 }}
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2D5F5D] to-[#1A3B3A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <problem.icon className="w-6 h-6 text-[#E8C49A]" />
                                </div>

                                {/* Title & Subtitle */}
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {problem.title}
                                </h3>
                                <p className="text-sm text-[#E8C49A]/80 font-medium mb-3">
                                    {problem.subtitle}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-white/60 leading-relaxed">
                                    {problem.description}
                                </p>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#2D5F5D]/20 to-transparent rounded-tr-2xl rounded-bl-[40px]" />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Solution Statement */}
            <motion.div
                className="text-center mt-16 px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <p className="text-[18px] text-white/70 mb-4">What you need is simple:</p>
                <p className="font-serif text-[28px] md:text-[36px] text-[#E8C49A] italic">
                    Listen. Practice. Get feedback.
                </p>
                <p className="text-white/50 mt-2">Over and over, until it's perfect.</p>
            </motion.div>
        </section>
    );
}
