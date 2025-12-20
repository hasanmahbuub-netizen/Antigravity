"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen, ThumbsUp, ThumbsDown, Info } from "lucide-react";

interface AnswerViewProps {
    question: string;
    answer: any;
    madhab: string;
    onAskAnother: () => void;
}

export default function AnswerView({ question, answer, madhab, onAskAnother }: AnswerViewProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Show loading if no answer yet
    if (!answer) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-primary mb-4">⏳</div>
                    <p className="text-muted">Loading answer...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-8">

            {/* 1. Header & Context */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest">
                        YOUR MADHAB: {madhab.toUpperCase()}
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
                <div className="font-english text-lg leading-relaxed text-foreground font-medium whitespace-pre-wrap">
                    {answer.answer || "No answer available"}
                </div>
            </div>

            {/* 3. Sources & Context */}
            {answer.sources && (
                <AccordionItem
                    title="Sources & Context"
                    isOpen={expandedSection === "sources"}
                    onClick={() => toggleSection("sources")}
                    icon={<BookOpen className="w-4 h-4" />}
                >
                    <div className="space-y-4 text-sm text-muted leading-relaxed">
                        <p>{answer.sources}</p>
                    </div>
                </AccordionItem>
            )}

            {/* 4. Other Views (if available) */}
            {answer.differences && (
                <AccordionItem
                    title="Other Schools of Thought"
                    isOpen={expandedSection === "other"}
                    onClick={() => toggleSection("other")}
                    icon={<Info className="w-4 h-4" />}
                >
                    <div className="space-y-4 text-sm text-muted leading-relaxed">
                        <p>{answer.differences}</p>
                    </div>
                </AccordionItem>
            )}

            {/* 5. Feedback & Actions */}
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
