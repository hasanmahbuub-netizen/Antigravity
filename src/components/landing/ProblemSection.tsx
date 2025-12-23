"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProblemSection() {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Background color transition from navy to cream
    const bgColor = useTransform(
        scrollYProgress,
        [0, 0.3],
        ["#0A1628", "#FAFAF5"]
    );

    return (
        <motion.section
            ref={sectionRef}
            className="relative min-h-[200vh] w-full"
            style={{ backgroundColor: bgColor }}
        >
            {/* Editorial Content Column */}
            <div className="max-w-[700px] mx-auto px-6 py-32">

                {/* Opening Statement */}
                <motion.h2
                    className="font-serif text-[36px] md:text-[48px] text-[#2B2B2B] leading-tight mb-10"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    Most Muslims can't.
                </motion.h2>

                {/* The Reality */}
                <motion.div
                    className="space-y-2 mb-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <p className="text-[20px] md:text-[24px] text-[#5A5A5A] leading-relaxed">
                        Not because of faith.
                    </p>
                    <p className="text-[20px] md:text-[24px] text-[#5A5A5A] leading-relaxed">
                        Not because of effort.
                    </p>
                    <p className="text-[20px] md:text-[24px] text-[#2B2B2B] leading-relaxed mt-6 font-medium">
                        But because no one ever taught them how.
                    </p>
                </motion.div>

                {/* Visual Break - Waveform Art */}
                <motion.div
                    className="relative w-full h-[200px] md:h-[280px] rounded-2xl overflow-hidden mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {/* Gradient Background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(135deg, #2D5F5D 0%, #1A3B3A 50%, #E8C49A 100%)",
                        }}
                    />

                    {/* Waveform Visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 400 100" className="w-[80%] h-auto opacity-60">
                            <motion.path
                                d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50"
                                fill="none"
                                stroke="rgba(255,255,255,0.5)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2 }}
                            />
                            <motion.path
                                d="M0,50 Q25,80 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50"
                                fill="none"
                                stroke="rgba(232,196,154,0.6)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, delay: 0.3 }}
                            />
                        </svg>
                    </div>

                    {/* Caption */}
                    <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/60 italic">
                        Every recitation has its own rhythm
                    </p>
                </motion.div>

                {/* The Struggle */}
                <motion.div
                    className="space-y-4 mb-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[18px] md:text-[20px] text-[#6B6B6B] leading-relaxed">
                        You've tried YouTube videos. <span className="text-[#9B9B9B]">Too generic.</span>
                    </p>
                    <p className="text-[18px] md:text-[20px] text-[#6B6B6B] leading-relaxed">
                        You've asked family. <span className="text-[#9B9B9B]">They're busy.</span>
                    </p>
                    <p className="text-[18px] md:text-[20px] text-[#6B6B6B] leading-relaxed">
                        You've used Quran apps. <span className="text-[#9B9B9B]">They just show text.</span>
                    </p>
                </motion.div>

                {/* The Solution */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[20px] md:text-[24px] text-[#2B2B2B] leading-relaxed mb-6">
                        What you need is simple:
                    </p>
                    <p className="text-[22px] md:text-[26px] text-[#2D5F5D] leading-relaxed font-medium">
                        Listen. Practice. Get feedback.<br />
                        <span className="text-[#6B6B6B] font-normal text-[18px]">Over and over, until it's perfect.</span>
                    </p>
                </motion.div>

                {/* The Declaration */}
                <motion.p
                    className="font-serif text-[28px] md:text-[36px] text-[#2D5F5D] italic leading-snug"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    That's what we built.
                </motion.p>

            </div>
        </motion.section>
    );
}
