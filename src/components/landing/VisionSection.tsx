"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function VisionSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.5 });

    return (
        <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-[#1C1B18] text-white text-center px-6 py-20">
            <div className="max-w-3xl space-y-16">
                <RevealLine show={isInView} delay={0.1}>
                    170 million Muslims in Bangladesh.
                </RevealLine>

                <RevealLine show={isInView} delay={0.2}>
                    Imagine if every single one could read<br />the Quran fluently.
                </RevealLine>

                <RevealLine show={isInView} delay={0.3}>
                    Could ask any Islamic question<br />and get clear guidance.
                </RevealLine>

                <RevealLine show={isInView} delay={0.4}>
                    Could practice faith with confidence,<br />not confusion.
                </RevealLine>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="pt-8"
                >
                    <h2 className="text-4xl md:text-6xl font-english font-bold text-[#D4AF37]">
                        That's what we're building.
                    </h2>
                    <p className="mt-4 text-gray-400">And it starts with you.</p>
                </motion.div>
            </div>
        </section>
    );
}

function RevealLine({ children, show, delay }: { children: React.ReactNode, show: boolean, delay: number }) {
    return (
        <motion.p
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={show ? { opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ delay, duration: 0.5 }}
            className="text-xl md:text-3xl font-light text-gray-200"
        >
            {children}
        </motion.p>
    );
}

