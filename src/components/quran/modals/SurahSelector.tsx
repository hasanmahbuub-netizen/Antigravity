"use client";

import { motion } from "framer-motion";
import { Search, ChevronLeft, Star, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ALL_114_SURAHS, SurahInfo } from "@/lib/surah-list";

interface SurahSelectorModalProps {
    onClose: () => void;
    onSelect: (surahId: number, surahName: string, totalVerses: number) => void;
}

export default function SurahSelectorModal({ onClose, onSelect }: SurahSelectorModalProps) {
    const [search, setSearch] = useState("");

    const filteredSurahs = search
        ? ALL_114_SURAHS.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.nameArabic.includes(search) ||
            s.id.toString().includes(search)
        )
        : ALL_114_SURAHS;

    const handleSelect = (surah: SurahInfo) => {
        onSelect(surah.id, surah.name, surah.verses);
    };

    // Popular/Essential surahs for beginners
    const essentialSurahs = ALL_114_SURAHS.filter(s =>
        [1, 112, 113, 114, 36, 67, 55, 56, 78].includes(s.id)
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
                <span className="ml-auto text-xs text-muted">{ALL_114_SURAHS.length} Surahs</span>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name or number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm placeholder:text-muted/50"
                    />
                </div>

                {/* Essential Surahs (show only when not searching) */}
                {!search && (
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Essential Surahs</h3>

                        {/* Al-Fatiha Card (Featured) */}
                        <div
                            onClick={() => handleSelect(ALL_114_SURAHS[0])}
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
                                <p className="text-xs text-muted">7 verses • The Opening</p>
                            </div>
                        </div>

                        {/* Quick access to short surahs */}
                        <div className="grid grid-cols-3 gap-2">
                            {[112, 113, 114].map(id => {
                                const surah = ALL_114_SURAHS.find(s => s.id === id)!;
                                return (
                                    <div
                                        key={id}
                                        onClick={() => handleSelect(surah)}
                                        className="bg-card border border-border p-3 rounded-xl text-center cursor-pointer hover:border-primary/30 transition-all active:scale-95"
                                    >
                                        <span className="text-lg font-arabic text-foreground">{surah.nameArabic}</span>
                                        <p className="text-xs text-muted mt-1">{surah.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* All Surahs */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">
                        {search ? `Search Results (${filteredSurahs.length})` : "All 114 Surahs"}
                    </h3>
                    <div className="space-y-1">
                        {filteredSurahs.map((surah) => (
                            <div
                                key={surah.id}
                                onClick={() => handleSelect(surah)}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/5 border border-transparent hover:border-border transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-muted w-8">{surah.id}.</span>
                                    <div>
                                        <p className="font-medium text-foreground flex items-center gap-2">
                                            {surah.name}
                                            <span className="font-arabic text-muted">{surah.nameArabic}</span>
                                        </p>
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
