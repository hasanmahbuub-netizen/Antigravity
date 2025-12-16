"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, Check, Search } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data
const ANSWERS: Record<string, { answer: string; reason: string; context: string; action: string }> = {
    "default": {
        answer: "No. Nail polish prevents water from reaching the nails, so wudu is not valid.",
        reason: "Water must touch the skin and nails completely for wudu (ablution) to be ritually accepted. Standard cleaning is not enough.",
        context: "All four major madhabs agree on this requirement. Breathable nail polish is a debated exception, but caution is recommended.",
        action: "Remove polish before wudu."
    },
    "How to pray": {
        answer: "Stand, face Qibla, reform your intention, and recite Al-Fatiha.",
        reason: "Prayer (Salah) is a structured connection with Allah involving standing, bowing, and prostrating.",
        context: "The Prophet (ﷺ) said, 'Pray as you have seen me pray.' (Bukhari)",
        action: "Begin with 'Allahu Akbar'."
    },
    "Zakat rules": {
        answer: "2.5% of your qualifying wealth held for one lunar year.",
        reason: "Zakat purifies your wealth and is a mandatory right of the poor upon the rich.",
        context: "Applied to gold, silver, cash, and business merchandise above the Nisab threshold.",
        action: "Calculate your assets today."
    },
    "Halal food": {
        answer: "All pure food is Halal except pork, alcohol, blood, and improperly slaughtered meat.",
        reason: "Allah has permitted the good and forbidden the harmful.",
        context: "Seafood is permissible (with minor differences in Hanafi school regarding shellfish).",
        action: "Check ingredients for gelatin/alcohol."
    },
    "Morning Adhkar": {
        answer: "Recite Ayatul Kursi and the 3 Quls (Ikhlas, Falaq, Nas).",
        reason: "These protect you from harm until the evening.",
        context: "Authentically reported for protection and peace of mind.",
        action: "Read them now."
    }
};

function FiqhContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialQuery) {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 800);
        }
    }, [initialQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setSubmittedQuery(query);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 600);
        router.replace(`/fiqh?q=${encodeURIComponent(query)}`);
    };

    const data = ANSWERS[submittedQuery] || ANSWERS["default"];

    // Accordion states
    const [expandReason, setExpandReason] = useState(false);
    const [expandContext, setExpandContext] = useState(false);

    if (!submittedQuery) {
        // Empty State
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <div className="flex-1 flex flex-col pt-10 px-5">
                    <h1 className="text-2xl font-medium mb-6 font-sans text-foreground">What is unclear?</h1>
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            className="w-full h-14 pl-12 pr-4 rounded-[16px] border border-border bg-background shadow-sm text-lg outline-none focus:border-primary text-foreground transition-colors font-sans placeholder:text-muted"
                            placeholder="Ask about rules..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <Search className="absolute left-4 top-4 text-primary w-6 h-6" />
                    </form>

                    <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
                        <div className="w-60 h-6 bg-border rounded-full animate-pulse"></div>
                        <div className="w-40 h-6 bg-border rounded-full animate-pulse"></div>
                        <p className="text-muted text-sm text-center font-sans">Nothing to review yet. Return when you’re ready.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />

            <div className="px-5 pt-2 pb-6 border-b border-border bg-background sticky top-0 z-20">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-background border border-border text-foreground outline-none focus:ring-1 focus:ring-primary/20 font-sans text-base"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-primary w-5 h-5" />
                </form>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col gap-4 mt-4 animate-pulse">
                        {/* Loading Skeleton */}
                        <div className="h-[120px] bg-border/40 rounded-[20px]" />
                        <div className="h-[60px] bg-border/40 rounded-[20px]" />
                        <div className="h-[60px] bg-border/40 rounded-[20px]" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {/* Accordion Style Container */}
                        <div className="bg-card rounded-[24px] p-4 shadow-sm space-y-3 border border-border/50">

                            {/* Layer 1 - Answer (The Head) */}
                            <div className="cursor-pointer p-5 border border-border rounded-[16px] bg-background">
                                <p className="text-foreground font-medium text-lg leading-relaxed font-sans">{data.answer}</p>
                            </div>

                            {/* Layer 2 - Reasoning (The Body) */}
                            <div className="overflow-hidden rounded-xl bg-background border-l-4 border-secondary">
                                <button
                                    onClick={() => setExpandReason(!expandReason)}
                                    className="w-full flex justify-between items-center p-4 text-left active:bg-muted/5"
                                >
                                    <span className="font-medium text-muted font-sans">Why?</span>
                                    <ChevronDown className={cn("w-5 h-5 text-muted transition-transform", expandReason && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {expandReason && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 pt-0 text-muted leading-relaxed font-sans">
                                                {data.reason}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Layer 3 - Context (The Soul) */}
                            <div className="overflow-hidden rounded-xl bg-background border-l-4 border-primary">
                                <button
                                    onClick={() => setExpandContext(!expandContext)}
                                    className="w-full flex justify-between items-center p-4 text-left active:bg-muted/5"
                                >
                                    <span className="font-medium text-muted font-sans">Scholarly Context</span>
                                    <ChevronDown className={cn("w-5 h-5 text-muted transition-transform", expandContext && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {expandContext && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 pt-0 text-muted text-sm leading-relaxed font-sans">
                                                {data.context}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Header() {
    return (
        <div className="flex items-center p-6 pb-2">
            <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
            </Link>
        </div>
    );
}

export default function FiqhPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <FiqhContent />
        </Suspense>
    );
}
