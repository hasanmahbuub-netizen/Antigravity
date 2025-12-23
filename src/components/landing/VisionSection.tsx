"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function VisionSection() {
    return (
        <section className="relative w-full bg-[#FAFAF5] py-32 md:py-48">
            {/* Content Column */}
            <div className="max-w-[600px] mx-auto px-6 text-center">

                {/* Mission Statement */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[20px] md:text-[24px] text-[#2B2B2B] leading-relaxed">
                        There are 2 billion Muslims in the world.
                    </p>
                    <p className="text-[20px] md:text-[24px] text-[#2B2B2B] leading-relaxed">
                        Most of us can't read the Quran properly.
                    </p>
                    <p className="text-[18px] md:text-[20px] text-[#6B6B6B] leading-relaxed">
                        Not because we don't care.<br />
                        But because no one made it easy.
                    </p>
                </motion.div>

                {/* The Declaration */}
                <motion.div
                    className="mt-12 mb-16"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <p className="font-serif text-[28px] md:text-[36px] text-[#2D5F5D] italic leading-snug">
                        We're changing that.
                    </p>
                    <p className="text-[16px] md:text-[18px] text-[#6B6B6B] mt-4">
                        One verse at a time.<br />
                        One person at a time.
                    </p>
                </motion.div>

                {/* Primary CTA */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Link href="/quran/1/1">
                        <motion.button
                            className="bg-[#2D5F5D] text-white text-lg font-medium px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                            whileHover={{ y: -2, backgroundColor: "#356b69" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Start with Al-Fatiha
                        </motion.button>
                    </Link>

                    {/* Sub-text */}
                    <p className="text-sm text-[#9B9B9B]">
                        Free. Takes 5 minutes.
                    </p>

                    {/* Secondary Link */}
                    <p className="text-sm text-[#6B6B6B] pt-4">
                        Or{" "}
                        <Link
                            href="/quran"
                            className="text-[#2D5F5D] underline underline-offset-4 hover:text-[#1A3B3A] transition-colors"
                        >
                            explore all surahs
                        </Link>
                        {" "}if you're ready
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
