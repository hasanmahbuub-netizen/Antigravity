"use client";

import { motion } from "framer-motion";
import { Play, Mic, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function DemoSection() {
    return (
        <section className="min-h-screen bg-white text-[#0A1628] py-20 px-6 overflow-hidden">

            {/* Headline */}
            <div className="text-center mb-20 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-english font-bold mb-6">
                    Every other app shows you the Quran.
                    <span className="block text-[#008080]">Imanos teaches you to READ it.</span>
                </h2>
            </div>

            {/* Split Screen Demo */}
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto items-center md:items-stretch">

                {/* 1. Traditional App (The Old Way) */}
                <div className="flex-1 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 scale-95">
                    <div className="bg-gray-100 rounded-[32px] p-8 h-[600px] border border-gray-200 relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" /> {/* Notch */}
                        <div className="mt-8 space-y-4">
                            <div className="h-6 w-32 bg-gray-300 rounded" />
                            <div className="h-40 bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-center">
                                <span className="font-amiri text-2xl text-gray-400">بِسْمِ ٱللَّهِ</span>
                            </div>
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-2/3 bg-gray-200 rounded" />
                        </div>
                        <p className="mt-8 text-center font-bold text-gray-500">TRADITIONAL APP</p>
                        <p className="text-center text-sm text-gray-400">Static. Passive. Lonely.</p>
                    </div>
                </div>

                {/* 2. Imanos Experience (The New Way) */}
                <div className="flex-1">
                    <div className="bg-[#F8F5F2] rounded-[32px] p-0 h-[640px] border-4 border-[#0A1628] relative overflow-hidden shadow-2xl">
                        {/* Status Bar */}
                        <div className="h-12 bg-white flex items-center justify-between px-6 border-b border-gray-100">
                            <span className="text-xs font-bold">9:41</span>
                            <div className="flex gap-1">
                                <div className="w-4 h-4 rounded-full bg-black/10" />
                                <div className="w-4 h-4 rounded-full bg-black/10" />
                            </div>
                        </div>

                        {/* Interactive Card */}
                        <InteractiveCard />

                    </div>
                    <p className="mt-8 text-center font-bold text-[#008080]">IMANOS EXPERIENCE</p>
                    <p className="text-center text-sm text-gray-600">Active. Guided. Alive.</p>
                </div>

            </div>

        </section>
    );
}

function InteractiveCard() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-bold tracking-widest mb-8">DAILY PRACTICE</span>

                <h3 className="font-amiri text-4xl leading-loose text-[#422B1E] mb-6">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </h3>

                <p className="font-english text-gray-400 text-sm mb-12">
                    Hold to practice pronunciation
                </p>

                {/* Mic Interaction */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-24 h-24 rounded-full bg-[#008080] text-white flex items-center justify-center shadow-lg shadow-[#008080]/30"
                >
                    <Mic className="w-8 h-8" />
                </motion.button>
            </div>

            {/* Bottom Sheet */}
            <div className="h-20 bg-white border-t border-gray-100 flex items-center justify-around">
                <button className="text-[#008080] font-medium flex flex-col items-center text-xs gap-1">
                    <Play className="w-5 h-5" />
                    Listen
                </button>
                <button className="text-gray-400 font-medium flex flex-col items-center text-xs gap-1">
                    <ChevronRight className="w-5 h-5" />
                    Next
                </button>
            </div>
        </div>
    );
}
