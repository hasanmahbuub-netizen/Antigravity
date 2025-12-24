"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        quote: "After one week with Meek, I finally recite Al-Fatiha correctly. That feeling when you realize you've been saying it wrong for 20 years... Now every prayer means something different.",
        name: "Ahmed",
        age: 28,
        role: "Software Engineer",
        location: "Toronto, CA",
        rating: 5,
        avatar: "A"
    },
    {
        quote: "My 6-year-old daughter asked me how to pronounce Ar-Rahman. I didn't know. Now we practice together every night. She's teaching me.",
        name: "Sara",
        age: 34,
        role: "Teacher",
        location: "London, UK",
        rating: 5,
        avatar: "S"
    },
    {
        quote: "Tried so many Quran apps. They all just show text. This is the first one that actually teaches you how to READ.",
        name: "Yusuf",
        age: 19,
        role: "University Student",
        location: "NYC, USA",
        rating: 5,
        avatar: "Y"
    },
    {
        quote: "The AI feedback is incredible. It catches pronunciation mistakes I didn't even know I was making. My tajweed has improved dramatically.",
        name: "Fatima",
        age: 42,
        role: "Doctor",
        location: "Dubai, UAE",
        rating: 5,
        avatar: "F"
    },
    {
        quote: "I converted 2 years ago and felt embarrassed at masjid. Now I recite with confidence. This app changed my relationship with the Quran.",
        name: "Michael",
        age: 31,
        role: "Marketing Manager",
        location: "Sydney, AU",
        rating: 5,
        avatar: "M"
    },
    {
        quote: "The Fiqh engine is amazing. It actually answers according to my madhab and gives proper references. No more confusion.",
        name: "Aisha",
        age: 26,
        role: "Law Student",
        location: "Dhaka, BD",
        rating: 5,
        avatar: "A"
    }
];

export default function TransformationSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let scrollPosition = 0;
        const scrollSpeed = 0.4;

        const animate = () => {
            if (!isHovered && scrollContainer) {
                scrollPosition += scrollSpeed;

                // Reset when reaching halfway (duplicate cards)
                if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                    scrollPosition = 0;
                }

                scrollContainer.scrollLeft = scrollPosition;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [isHovered]);

    // Duplicate testimonials for infinite scroll
    const allTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="relative w-full bg-gradient-to-b from-[#0F1D32] to-[#1A1A1A] py-24 md:py-32 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-[#2D5F5D]/8 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E8C49A]/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Section Header */}
            <motion.div
                className="text-center mb-16 px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <span className="text-[11px] text-[#E8C49A]/60 uppercase tracking-[0.2em]">Real Stories</span>
                <h2 className="font-serif text-[36px] md:text-[48px] text-white mt-4">
                    Voices from our community
                </h2>
                <p className="text-white/50 mt-4 max-w-lg mx-auto">
                    Join thousands of Muslims who've transformed their Quran journey
                </p>
            </motion.div>

            {/* Auto-Scrolling Testimonial Cards */}
            <div
                ref={scrollRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex gap-6 overflow-x-hidden px-6 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {allTestimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        className="flex-shrink-0 w-[320px] md:w-[380px]"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(index * 0.1, 0.5) }}
                    >
                        {/* Glassmorphism Card */}
                        <div className="relative h-full p-6 rounded-2xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/8 hover:border-white/20 transition-all duration-300 group">
                            {/* Quote Icon */}
                            <div className="absolute -top-3 -left-1 w-10 h-10 rounded-full bg-gradient-to-br from-[#2D5F5D] to-[#1A3B3A] flex items-center justify-center shadow-lg">
                                <Quote className="w-4 h-4 text-[#E8C49A]" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4 ml-8">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#E8C49A] text-[#E8C49A]" />
                                ))}
                            </div>

                            {/* Quote Text */}
                            <p className="text-white/80 text-[15px] leading-relaxed mb-6 italic">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D5F5D] to-[#E8C49A] flex items-center justify-center text-white font-semibold text-sm">
                                    {testimonial.avatar}
                                </div>

                                {/* Info */}
                                <div>
                                    <p className="text-white font-medium text-sm">
                                        {testimonial.name}, {testimonial.age}
                                    </p>
                                    <p className="text-white/50 text-xs">
                                        {testimonial.role} · {testimonial.location}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Gradient */}
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#2D5F5D]/10 to-transparent rounded-br-2xl rounded-tl-[60px]" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Stats Bar */}
            <motion.div
                className="max-w-4xl mx-auto mt-16 px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5">
                    <div className="text-center">
                        <p className="text-[28px] md:text-[36px] font-bold text-[#E8C49A]">10K+</p>
                        <p className="text-white/50 text-sm">Active Learners</p>
                    </div>
                    <div className="text-center border-x border-white/10">
                        <p className="text-[28px] md:text-[36px] font-bold text-[#E8C49A]">4.9★</p>
                        <p className="text-white/50 text-sm">Average Rating</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[28px] md:text-[36px] font-bold text-[#E8C49A]">50+</p>
                        <p className="text-white/50 text-sm">Countries</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
