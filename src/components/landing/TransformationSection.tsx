"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        quote: "After one week with Meek, I finally recite Al-Fatiha correctly. That feeling when you realize you've been saying it wrong for 20 years... Now every prayer means something different.",
        name: "Ahmed",
        role: "Software Engineer",
        location: "Toronto, CA",
        avatar: "A"
    },
    {
        quote: "My 6-year-old daughter asked me how to pronounce Ar-Rahman. I didn't know. Now we practice together every night. She's teaching me.",
        name: "Sara",
        role: "Teacher",
        location: "London, UK",
        avatar: "S"
    },
    {
        quote: "Tried so many Quran apps. They all just show text. This is the first one that actually teaches you how to READ.",
        name: "Yusuf",
        role: "University Student",
        location: "NYC, USA",
        avatar: "Y"
    },
    {
        quote: "The AI feedback is incredible. It catches pronunciation mistakes I didn't even know I was making. My tajweed has improved dramatically.",
        name: "Fatima",
        role: "Doctor",
        location: "Dubai, UAE",
        avatar: "F"
    },
    {
        quote: "I converted 2 years ago and felt embarrassed at masjid. Now I recite with confidence. This app changed my relationship with the Quran.",
        name: "Michael",
        role: "Marketing Manager",
        location: "Sydney, AU",
        avatar: "M"
    },
    {
        quote: "The Fiqh engine is amazing. It actually answers according to my madhab and gives proper references. No more confusion.",
        name: "Aisha",
        role: "Law Student",
        location: "Dhaka, BD",
        avatar: "A"
    }
];

export default function TransformationSection() {
    // Duplicate for seamless loop
    const allTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="relative w-full bg-[#FAFAF5] py-24 md:py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2D5F5D]/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#E8C49A]/5 rounded-full blur-[120px]" />

            {/* Header */}
            <motion.div
                className="text-center mb-16 px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <span className="text-[11px] text-[#2D5F5D]/60 uppercase tracking-[0.3em]">
                    Real Stories
                </span>
                <h2 className="font-serif text-[36px] md:text-[48px] text-[#2B2B2B] mt-4">
                    Lives <span className="italic text-[#2D5F5D]">transformed</span>
                </h2>
            </motion.div>

            {/* CSS Marquee - Smooth Infinite Scroll */}
            <div className="relative overflow-hidden">
                {/* Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAFAF5] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAFAF5] to-transparent z-10 pointer-events-none" />

                {/* Scrolling Container */}
                <div className="flex animate-testimonial-marquee hover:pause-animation">
                    {allTestimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[320px] md:w-[380px] mx-3"
                        >
                            {/* Card */}
                            <div className="relative h-full p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-sm hover:shadow-lg hover:border-[#2D5F5D]/20 transition-all duration-300">
                                {/* Quote Icon */}
                                <Quote className="w-8 h-8 text-[#2D5F5D]/20 mb-4" />

                                {/* Quote */}
                                <p className="text-[#4B4B4B] leading-relaxed mb-6 text-sm md:text-base">
                                    "{testimonial.quote}"
                                </p>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#E8C49A] text-[#E8C49A]" />
                                    ))}
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D5F5D] to-[#1A3B3A] flex items-center justify-center">
                                        <span className="text-[#E8C49A] font-semibold text-sm">
                                            {testimonial.avatar}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#2B2B2B]">{testimonial.name}</p>
                                        <p className="text-xs text-[#6B6B6B]">
                                            {testimonial.role} • {testimonial.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS Keyframes for Marquee */}
            <style jsx>{`
                @keyframes testimonialMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-testimonial-marquee {
                    animation: testimonialMarquee 20s linear infinite;
                }
                .animate-testimonial-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
