"use client";

import { motion } from "framer-motion";

const testimonials = [
    {
        quote: `I've been Muslim my whole life but couldn't recite Al-Fatiha correctly.

After one week with Meek, I finally can.

That feeling when you realize you've been saying it wrong for 20 years...

Now every prayer means something different.`,
        name: "Ahmed",
        age: 28,
        role: "Software Engineer"
    },
    {
        quote: `My 6-year-old daughter asked me how to pronounce Ar-Rahman.

I didn't know.

Now we practice together every night.
She's teaching me.`,
        name: "Sara",
        age: 34,
        role: "Teacher"
    },
    {
        quote: `Tried so many Quran apps.
They all just show text.

This is the first one that actually teaches you how to READ.`,
        name: "Yusuf",
        age: 19,
        role: "University Student"
    }
];

export default function TransformationSection() {
    return (
        <section className="relative w-full bg-[#1A1A1A] py-32 md:py-40">
            {/* Section Header */}
            <motion.div
                className="text-center mb-20 px-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <span className="text-[11px] text-[#E8C49A]/60 uppercase tracking-[0.2em]">Real Stories</span>
                <h2 className="font-serif text-[36px] md:text-[48px] text-[#F5F1E8] mt-4">
                    Voices from our community
                </h2>
            </motion.div>

            {/* Testimonials - Editorial Pull Quotes */}
            <div className="max-w-[800px] mx-auto px-6 space-y-32 md:space-y-40">
                {testimonials.map((item, i) => (
                    <motion.div
                        key={i}
                        className="relative text-center"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Large Quote Mark */}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[120px] text-[#2D5F5D]/20 font-serif leading-none pointer-events-none select-none">
                            "
                        </span>

                        {/* Quote Text */}
                        <blockquote className="font-serif text-[24px] md:text-[32px] text-[#F5F1E8] italic leading-relaxed whitespace-pre-line relative z-10">
                            {item.quote}
                        </blockquote>

                        {/* Attribution */}
                        <div className="mt-10 text-[#B8B8B8]">
                            <span className="text-base">— {item.name}, {item.age}</span>
                            <span className="text-gray-600"> · </span>
                            <span className="text-sm text-gray-500">{item.role}</span>
                        </div>

                        {/* Decorative Line */}
                        {i < testimonials.length - 1 && (
                            <div className="mt-20 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[#2D5F5D]/40 to-transparent" />
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
