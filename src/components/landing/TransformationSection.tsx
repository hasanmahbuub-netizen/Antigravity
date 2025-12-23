"use client";

import { motion } from "framer-motion";

const STORIES = [
    {
        name: "Ahmed, 24",
        role: "Tech Professional",
        before: "I felt embarrassed. I'm Muslim but I couldn't read Surah Al-Fatiha correctly. Every prayer felt incomplete.",
        after: "After 7 days with MEEK, I can recite Al-Fatiha perfectly. Now prayer feels different. I understand what I'm saying."
    },
    {
        name: "Sara, 19",
        role: "University Student",
        before: "I had so many questions about hijab and university life. Google gave me 100 confusing answers.",
        after: "MEEK give me ONE clear answer with context. No more confusion. Just clarity."
    },
    {
        name: "Tariq, 32",
        role: "Father",
        before: "I wanted to teach my daughter Quran but I didn't know tajweed properly myself.",
        after: "We practice together now. The voice feedback helps both of us. she's learning correctly from day one."
    }
];

export default function TransformationSection() {
    return (
        <section className="min-h-screen bg-gradient-to-b from-[#FFF] to-[#F5F1E8] py-20 px-6">
            <h2 className="text-3xl font-english font-bold text-center text-[#422B1E] mb-20">
                Real stories. Real change.
            </h2>

            <div className="max-w-4xl mx-auto space-y-12">
                {STORIES.map((story, i) => (
                    <StoryCard key={i} story={story} index={i} />
                ))}
            </div>
        </section>
    );
}

function StoryCard({ story, index }: { story: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#E4DDD4] flex flex-col md:flex-row gap-8"
        >
            <div className="md:w-1/3 border-r border-gray-100 pr-8">
                <h3 className="font-bold text-[#422B1E] text-lg">{story.name}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{story.role}</p>
                <div className="mt-6">
                    <p className="text-xs font-bold text-gray-300 mb-2">BEFORE</p>
                    <p className="font-english text-gray-500 italic">"{story.before}"</p>
                </div>
            </div>

            <div className="md:w-2/3 flex flex-col justify-center">
                <p className="text-xs font-bold text-[#D4AF37] mb-2">AFTER MEEK</p>
                <p className="font-english text-xl md:text-2xl font-medium text-[#0A1628] leading-relaxed">
                    "{story.after}"
                </p>
            </div>
        </motion.div>
    );
}

