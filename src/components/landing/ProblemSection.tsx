"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from 'next/link';

export default function ProblemSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.3, once: true });

    return (
        <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-[#1A1A1A] text-white px-6 py-20">
            <div className="max-w-2xl text-center space-y-12">

                {/* 1. Statistics Reveal */}
                <div className="space-y-6 text-xl md:text-3xl text-gray-400 font-light font-english">
                    <RevealText show={isInView} delay={0.1}>
                        170 million Muslims in Bangladesh
                    </RevealText>
                    <RevealText show={isInView} delay={0.2}>
                        Most can't read the Quran fluently
                    </RevealText>
                    <RevealText show={isInView} delay={0.3}>
                        Most don't know how to ask questions
                    </RevealText>
                    <RevealText show={isInView} delay={0.4}>
                        Most apps just show verses
                    </RevealText>
                    <RevealText show={isInView} delay={0.5} color="text-red-400">
                        No one teaches you how to READ
                    </RevealText>
                </div>

                {/* 2. Dramatic Pause */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="pt-12"
                >
                    <h2 className="text-4xl md:text-6xl font-bold font-english text-white">
                        Until now.
                    </h2>
                </motion.div>

                {/* 3. Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Link href="/onboarding" className="text-[#D4AF37] border-b border-[#D4AF37] pb-1 text-lg hover:text-white hover:border-white transition-colors">
                        See how it works ↓
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}

function RevealText({ children, show, delay, color = "text-gray-400" }: { children: React.ReactNode, show: boolean, delay: number, color?: string }) {
    return (
        <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ delay, duration: 0.5 }}
            className={color}
        >
            {children}
        </motion.p>
    );
}
