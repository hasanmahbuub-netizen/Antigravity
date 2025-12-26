"use client";

import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useState, useMemo } from "react";
import { ALL_114_SURAHS, SurahInfo } from "@/lib/surah-list";

interface SurahSelectorModalProps {
    onClose: () => void;
    onSelect: (surahId: number, surahName: string, totalVerses: number) => void;
    currentSurahId?: number;
}

export default function SurahSelectorModal({ onClose, onSelect, currentSurahId = 1 }: SurahSelectorModalProps) {
    const [search, setSearch] = useState("");

    // Reorder surahs: current surah first, then wrap around (57 -> 58...114, 1, 2...56)
    const reorderedSurahs = useMemo(() => {
        if (search) return ALL_114_SURAHS; // Don't reorder when searching

        const currentIndex = ALL_114_SURAHS.findIndex(s => s.id === currentSurahId);
        if (currentIndex === -1) return ALL_114_SURAHS;

        // Create wrapped order: from current to end, then from start to current-1
        const fromCurrent = ALL_114_SURAHS.slice(currentIndex);
        const beforeCurrent = ALL_114_SURAHS.slice(0, currentIndex);
        return [...fromCurrent, ...beforeCurrent];
    }, [currentSurahId, search]);

    const filteredSurahs = search
        ? ALL_114_SURAHS.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.nameArabic.includes(search) ||
            s.id.toString().includes(search)
        )
        : reorderedSurahs;

    const handleSelect = (surah: SurahInfo) => {
        onSelect(surah.id, surah.name, surah.verses);
    };

    // Current and next 3 surahs for highlight cards
    const currentSurah = ALL_114_SURAHS.find(s => s.id === currentSurahId) || ALL_114_SURAHS[0];
    const nextThreeSurahs = useMemo(() => {
        const result: SurahInfo[] = [];
        for (let i = 1; i <= 3; i++) {
            const nextId = currentSurahId + i > 114 ? (currentSurahId + i - 114) : currentSurahId + i;
            const surah = ALL_114_SURAHS.find(s => s.id === nextId);
            if (surah) result.push(surah);
        }
        return result;
    }, [currentSurahId]);

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

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

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

                {/* Current Surah - Highlighted (show only when not searching) */}
                {!search && (
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Currently Reading</h3>

                        {/* Current Surah Card (Featured) */}
                        <div
                            onClick={() => handleSelect(currentSurah)}
                            className="bg-primary/10 border-2 border-primary/30 p-4 rounded-2xl flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                {currentSurah.id}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-foreground">{currentSurah.name}</h4>
                                    <span className="text-lg font-arabic text-primary">{currentSurah.nameArabic}</span>
                                </div>
                                <p className="text-xs text-muted">{currentSurah.verses} verses • {currentSurah.type}</p>
                            </div>
                        </div>

                        {/* Next 3 Surahs */}
                        <div className="grid grid-cols-3 gap-2">
                            {nextThreeSurahs.map(surah => (
                                <div
                                    key={surah.id}
                                    onClick={() => handleSelect(surah)}
                                    className="bg-card border border-border p-3 rounded-xl text-center cursor-pointer hover:border-primary/30 transition-all active:scale-95"
                                >
                                    <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center text-muted text-sm font-medium mx-auto mb-2">
                                        {surah.id}
                                    </div>
                                    <span className="text-sm font-arabic text-foreground block">{surah.nameArabic}</span>
                                    <p className="text-[10px] text-muted mt-0.5">{surah.name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Surahs (reordered from current) */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">
                        {search ? `Search Results (${filteredSurahs.length})` : "All 114 Surahs"}
                    </h3>
                    <div className="space-y-1">
                        {filteredSurahs.map((surah) => {
                            const isCurrent = surah.id === currentSurahId;
                            const isNext = nextThreeSurahs.some(s => s.id === surah.id);

                            return (
                                <div
                                    key={surah.id}
                                    onClick={() => handleSelect(surah)}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group ${isCurrent
                                            ? 'bg-primary/10 border border-primary/30'
                                            : isNext
                                                ? 'bg-card border border-border hover:border-primary/20'
                                                : 'hover:bg-muted/5 border border-transparent hover:border-border'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-mono w-8 ${isCurrent ? 'text-primary font-bold' : 'text-muted'}`}>
                                            {surah.id}.
                                        </span>
                                        <div>
                                            <p className={`font-medium flex items-center gap-2 ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                                                {surah.name}
                                                <span className="font-arabic text-muted text-sm">{surah.nameArabic}</span>
                                            </p>
                                            <p className="text-xs text-muted">{surah.type} • {surah.verses} verses</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isCurrent && (
                                            <span className="text-[10px] font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                                                Current
                                            </span>
                                        )}
                                        <ChevronRight className={`w-4 h-4 ${isCurrent ? 'text-primary' : 'text-muted group-hover:text-foreground'}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </motion.div>
    );
}
