"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen, ThumbsUp, ThumbsDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerViewProps {
    question: string;
    onAskAnother: () => void;
}

export default function AnswerView({ question, onAskAnother }: AnswerViewProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-8">

            {/* 1. Header & Context */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest">
                        YOUR MADHAB: HANAFI
                    </span>
                </div>
                <h1 className="font-english text-xl font-medium text-foreground leading-relaxed">
                    "{question}"
                </h1>
            </div>

            {/* 2. Direct Answer */}
            <div className="p-6 bg-card rounded-[24px] border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-green-700 font-bold text-sm uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Answer
                </div>
                <p className="font-english text-lg leading-relaxed text-foreground font-medium">
                    In the Hanafi school, you say "Ameen" <strong>silently</strong> after reciting Al-Fatiha in prayer, not out loud. This is the standard practice regardless of whether you are praying alone or behind an Imam.
                </p>
            </div>

            {/* 3. Reasoning (Accordion) */}
            <AccordionItem
                title="Why? See the reasoning"
                isOpen={expandedSection === "reasoning"}
                onClick={() => toggleSection("reasoning")}
                icon={<Info className="w-4 h-4" />}
            >
                <div className="space-y-4 text-sm text-muted leading-relaxed">
                    <p>
                        The evidence for this position comes from the narration of Abdullah ibn Mas'ud (may Allah be pleased with him) who said that the Prophet (ﷺ) would say Ameen silently.
                    </p>
                    <p>
                        The general principle in the Hanafi madhab is that supplications (du'a) in prayer should be silent unless there is specific evidence to say them aloud. Since "Ameen" is a du'a meaning "O Allah, answer our prayer", it falls under this rule.
                    </p>
                </div>
            </AccordionItem>

            {/* 4. Other Views (Accordion) */}
            <AccordionItem
                title="Other Schools of Thought"
                isOpen={expandedSection === "other"}
                onClick={() => toggleSection("other")}
                icon={<BookOpen className="w-4 h-4" />}
            >
                <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/5 border border-border/50">
                        <p className="font-bold text-foreground text-sm mb-1">Shafi'i & Hanbali</p>
                        <p className="text-sm text-muted">Recommend saying Ameen <strong>out loud</strong> in audible prayers (Fajr, Maghrib, Isha).</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/5 border border-border/50">
                        <p className="font-bold text-foreground text-sm mb-1">Maliki</p>
                        <p className="text-sm text-muted">Traditionally recommends <strong>not saying Ameen at all</strong> out loud, and distinct views on silent recitation.</p>
                    </div>
                </div>
            </AccordionItem>

            {/* 5. Sources */}
            <div className="pt-4 border-t border-border">
                <button
                    onClick={() => toggleSection("sources")}
                    className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
                >
                    <BookOpen className="w-3 h-3" />
                    {expandedSection === "sources" ? "Hide Sources" : "View Sources & Citations"}
                </button>

                <AnimatePresence>
                    {expandedSection === "sources" && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-2 text-xs text-muted overflow-hidden"
                        >
                            <li>• Sahih Bukhari, Hadith 780</li>
                            <li>• Al-Hidayah, Vol 1, Page 45</li>
                            <li>• Radd al-Muhtar, Ibn Abidin</li>
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            {/* 6. Feedback & Actions */}
            <div className="space-y-6 pt-8">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-xs text-muted font-medium">Was this helpful?</span>
                    <div className="flex gap-4">
                        <button className="p-3 rounded-full bg-card border border-border hover:bg-muted/10 transition-colors text-muted hover:text-green-600">
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full bg-card border border-border hover:bg-muted/10 transition-colors text-muted hover:text-red-500">
                            <ThumbsDown className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={onAskAnother}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                    Ask Another Question
                </button>
            </div>

        </div>
    );
}

function AccordionItem({ title, isOpen, onClick, children, icon }: any) {
    return (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/5 transition-colors"
            >
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <span className="p-1.5 bg-muted/10 rounded-md text-muted">
                        {icon}
                    </span>
                    {title}
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-border/50">
                            <div className="pt-4">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
