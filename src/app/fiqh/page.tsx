"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronRight, ChevronLeft, HelpCircle, Loader2, Mic, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AnswerView from "@/components/fiqh/AnswerView";

const COMMON_QUESTIONS = [
    { q: "When do I say Ameen in prayer?", icon: "🤲" },
    { q: "How do I make up missed prayers?", icon: "⏰" },
    { q: "Is dropshipping halal?", icon: "💼" },
    { q: "Does bleeding break wudu?", icon: "💧" },
    { q: "Can I pay Zakat to my siblings?", icon: "💰" }
];

const TOPICS = [
    { name: "Prayer", icon: "🕌" },
    { name: "Fasting", icon: "🌙" },
    { name: "Work", icon: "💼" },
    { name: "Family", icon: "👨‍👩‍👧" },
    { name: "Zakat", icon: "💎" },
    { name: "Hajj", icon: "🕋" }
];

function FiqhContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [viewState, setViewState] = useState<"input" | "loading" | "result">("input");
    const [answer, setAnswer] = useState<any>(null);

    // Auto-search effect
    useEffect(() => {
        const fetchAnswer = async (q: string) => {
            setViewState("loading");
            try {
                const { data: { session } } = await supabase.auth.getSession();

                // Get user madhab preference
                let madhab = 'hanafi';
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('madhab')
                        .eq('id', session.user.id)
                        .single();
                    madhab = (profile as any)?.madhab || 'hanafi';
                }

                // Call the API endpoint
                const response = await fetch('/api/fiqh/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
                    },
                    body: JSON.stringify({
                        question: q,
                        madhab: madhab
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to get answer');
                }

                const result = await response.json();
                setAnswer(result);
                setViewState("result");
            } catch (err) {
                console.error("Fiqh API failed:", err);
                setViewState("input");
            }
        };

        const q = searchParams.get("q");
        if (q) {
            setQuery(q);
            fetchAnswer(q);
        } else {
            setViewState("input");
            setQuery("");
            setAnswer(null);
        }
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/fiqh?q=${encodeURIComponent(query)}`);
    };

    const handleClear = () => {
        router.push("/fiqh");
    };

    if (viewState === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
                <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </motion.div>
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Consulting Islamic Scholars...</h2>
                    <p className="text-sm text-muted">Searching classical fiqh sources</p>
                </div>
            </div>
        );
    }

    if (viewState === "result") {
        return (
            <div className="flex flex-col h-screen bg-background">
                <header className="h-[60px] flex items-center px-4 border-b border-border">
                    <button onClick={handleClear} className="p-2 -ml-2 text-muted hover:text-foreground transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2 ml-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm uppercase tracking-widest text-muted">Fiqh Intelligence</span>
                    </div>
                </header>
                <AnswerView
                    question={query}
                    answer={answer?.data || answer}
                    madhab={answer?.madhab || 'Hanafi'}
                    onAskAnother={handleClear}
                />
            </div>
        );
    }

    // Default: Input View with Premium Design
    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <header className="h-[60px] flex items-center px-4 border-b border-border">
                <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2 ml-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm uppercase tracking-widest text-muted">Ask a Question</span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Premium Search Input */}
                <form onSubmit={handleSearch}>
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="relative rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-[1px]">
                            <div className="relative bg-card rounded-2xl">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
                                <input
                                    type="text"
                                    placeholder="What would you like to know?"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-transparent border-none focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted/50 font-medium"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </form>

                {/* Common Questions - Premium Cards */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary/60" />
                        <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Common Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {COMMON_QUESTIONS.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={`/fiqh?q=${encodeURIComponent(item.q)}`}
                                    className="group block p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                            {item.q}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Topics - Premium Pills */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Browse by Topic</h2>
                    <div className="flex flex-wrap gap-3">
                        {TOPICS.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                            >
                                <Link
                                    href={`/fiqh?q=${encodeURIComponent(t.name)}`}
                                    className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:border-primary/30 hover:bg-primary/5 text-sm font-medium text-muted hover:text-foreground active:scale-95 transition-all"
                                >
                                    <span>{t.icon}</span>
                                    <span>{t.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Disclaimer */}
                <motion.div
                    className="p-4 rounded-2xl bg-muted/10 border border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="text-xs text-muted text-center">
                        <Sparkles className="w-3 h-3 inline-block mr-1 text-primary" />
                        Powered by AI. Answers are based on classical fiqh sources.
                        Always consult a qualified scholar for personal rulings.
                    </p>
                </motion.div>

            </main>
        </div>
    );
}

export default function FiqhPage() {
    return (
        <Suspense fallback={null}>
            <FiqhContent />
        </Suspense>
    );
}
