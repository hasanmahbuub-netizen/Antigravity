"use client";

import { motion } from "framer-motion";
import { Search, ChevronLeft, Star, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SurahSelectorModalProps {
    onClose: () => void;
    onSelect: (surah: string) => void;
}

const ALL_SURAHS = [
    { number: 1, name: "Al-Fatiha", type: "Meccan", verses: 7 },
    { number: 2, name: "Al-Baqarah", type: "Medinan", verses: 286 },
    { number: 3, name: "Al-Imran", type: "Medinan", verses: 200 },
    { number: 4, name: "An-Nisa", type: "Medinan", verses: 176 },
    { number: 112, name: "Al-Ikhlas", type: "Meccan", verses: 4 },
    { number: 113, name: "Al-Falaq", type: "Meccan", verses: 5 },
    { number: 114, name: "An-Nas", type: "Meccan", verses: 6 },
];

export default function SurahSelectorModal({ onClose, onSelect }: SurahSelectorModalProps) {
    const [search, setSearch] = useState("");

    const filteredSurahs = ALL_SURAHS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.number.toString().includes(search)
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background flex flex-col h-full w-full"
        >
            {/* Header */}
            <header className="px-6 py-4 flex items-center gap-4 border-b border-border/50 shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 text-muted hover:text-foreground">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-sm font-bold tracking-widest text-muted uppercase">Choose Surah</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search surahs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm placeholder:text-muted/50"
                    />
                </div>

                {!search && (
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Recommended For You</h3>

                        {/* Al-Fatiha Card */}
                        <div
                            onClick={() => onSelect("Al-Fatiha")}
                            className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-foreground">Al-Fatiha</h4>
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Essential</span>
                                </div>
                                <p className="text-xs text-muted mb-2">7 verses</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                    </div>
                                    <span className="text-[10px] text-muted font-medium">28% done</span>
                                </div>
                            </div>
                        </div>

                        {/* Al-Ikhlas Card */}
                        <div
                            onClick={() => onSelect("Al-Ikhlas")}
                            className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground font-bold font-english text-sm">
                                112
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-foreground mb-1">Al-Ikhlas</h4>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted">4 verses • Next up</p>
                                    <span className="text-[10px] text-muted border border-border px-2 py-0.5 rounded-full">Not started</span>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* All Surahs */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">All Surahs</h3>
                    <div className="space-y-2">
                        {filteredSurahs.map((surah) => (
                            <div
                                key={surah.number}
                                onClick={() => onSelect(surah.name)}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/5 border border-transparent hover:border-border transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-muted w-6">{surah.number}.</span>
                                    <div>
                                        <p className="font-medium text-foreground">{surah.name}</p>
                                        <p className="text-xs text-muted">{surah.type} • {surah.verses} verses</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground" />
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </motion.div>
    );
}
