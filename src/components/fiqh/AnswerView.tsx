"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen, ThumbsUp, ThumbsDown, Info, FileText } from "lucide-react";

interface FiqhCitation {
    source: string;
    reference: string;
    text: string;
    verified?: boolean;
}

interface OtherMadhabPosition {
    madhab: string;
    position: string;
}

interface FiqhStructuredAnswer {
    directAnswer: string;
    reasoning: string;
    otherSchools: OtherMadhabPosition[];
    citations: FiqhCitation[];
    // Legacy fields for backwards compatibility
    answer?: string;
    sources?: string;
}

interface AnswerViewProps {
    question: string;
    answer: FiqhStructuredAnswer | null;
    madhab: string;
    onAskAnother: () => void;
}

export default function AnswerView({ question, answer, madhab, onAskAnother }: AnswerViewProps) {
    const [showReasoning, setShowReasoning] = useState(false);
    const [showOtherSchools, setShowOtherSchools] = useState(false);
    const [showCitations, setShowCitations] = useState(false);

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

    // Handle both old format (answer.answer) and new format (answer.directAnswer)
    const directAnswer = answer.directAnswer || answer.answer || "No answer available";
    const reasoning = answer.reasoning || answer.sources || "";
    const otherSchools = answer.otherSchools || [];
    const citations = answer.citations || [];

    return (
        <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-4">

            {/* Header & Context */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest">
                        YOUR MADHAB: {madhab.toUpperCase()}
                    </span>
                </div>
                <h1 className="font-english text-xl font-medium text-foreground leading-relaxed">
                    "{question}"
                </h1>
            </div>

            {/* Direct Answer Card - Green Dot Design */}
            <div className="p-6 bg-card rounded-[20px] border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-bold text-green-600 uppercase tracking-widest">ANSWER</span>
                </div>
                <div className="font-english text-lg leading-relaxed text-foreground">
                    {directAnswer}
                </div>
            </div>

            {/* Reasoning - Collapsible */}
            {reasoning && (
                <CollapsibleSection
                    title="Why? See the reasoning"
                    isOpen={showReasoning}
                    onToggle={() => setShowReasoning(!showReasoning)}
                    icon={<Info className="w-5 h-5" />}
                >
                    <p className="text-foreground/80 leading-relaxed">{reasoning}</p>
                </CollapsibleSection>
            )}

            {/* Other Schools - Collapsible */}
            {otherSchools.length > 0 && (
                <CollapsibleSection
                    title="Other Schools of Thought"
                    isOpen={showOtherSchools}
                    onToggle={() => setShowOtherSchools(!showOtherSchools)}
                    icon={<BookOpen className="w-5 h-5" />}
                >
                    <div className="space-y-4">
                        {otherSchools.map((school: OtherMadhabPosition, idx: number) => (
                            <div key={idx}>
                                <h4 className="text-accent font-semibold mb-2">{school.madhab}</h4>
                                <p className="text-foreground/80 leading-relaxed">{school.position}</p>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>
            )}

            {/* Citations - Collapsible */}
            {citations.length > 0 && (
                <CollapsibleSection
                    title="View Sources & Citations"
                    isOpen={showCitations}
                    onToggle={() => setShowCitations(!showCitations)}
                    icon={<FileText className="w-5 h-5" />}
                >
                    <div className="space-y-3">
                        {citations.map((citation: FiqhCitation, idx: number) => (
                            <div key={idx} className="bg-muted/5 p-4 rounded-lg border border-border/50">
                                <div className="text-primary font-semibold mb-1">
                                    {citation.source}: {citation.reference}
                                </div>
                                <p className="text-muted text-sm italic">
                                    "{citation.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-muted text-center py-4 px-6 bg-muted/5 rounded-xl">
                📚 This is educational information based on classical Islamic scholarship. For personal guidance, consult a qualified scholar.
            </p>

            {/* Feedback & Actions */}
            <div className="space-y-6 pt-4">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-xs text-muted font-medium">Was this helpful?</span>
                    <div className="flex gap-4">
                        <button className="p-3 rounded-full bg-card border border-border hover:bg-green-500/10 transition-colors text-muted hover:text-green-600">
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-full bg-card border border-border hover:bg-red-500/10 transition-colors text-muted hover:text-red-500">
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

// Collapsible Section Component
function CollapsibleSection({
    title,
    isOpen,
    onToggle,
    children,
    icon
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <div className="border border-border rounded-[16px] bg-card overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 hover:bg-muted/5 transition-colors"
            >
                <div className="flex items-center gap-3 text-foreground font-medium">
                    <span className="text-muted">{icon}</span>
                    {title}
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 border-t border-border/50">
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

