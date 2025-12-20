"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronRight, ChevronLeft, Info, HelpCircle, Loader2, Mic } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { aiService } from "@/lib/ai-service";
import AnswerView from "@/components/fiqh/AnswerView";

const COMMON_QUESTIONS = [
    "When do I say Ameen in prayer?",
    "How do I make up missed prayers?",
    "Is dropshipping halal?",
    "Does bleeding break wudu?",
    "Can I pay Zakat to my siblings?"
];

const TOPICS = [
    "Prayer", "Fasting", "Work", "Family", "Zakat", "Hajj"
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
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                    <h2 className="text-xl font-medium text-foreground mb-2">Consulting Hanafi Sources...</h2>
                    <p className="text-sm text-muted">Searching Radd al-Muhtar & Al-Hidayah</p>
                </div>
            </div>
        );
    }

    if (viewState === "result") {
        return (
            <div className="flex flex-col h-screen bg-background">
                <header className="h-[60px] flex items-center px-4 border-b border-border">
                    <button onClick={handleClear} className="p-2 -ml-2 text-muted hover:text-foreground">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="ml-2 font-bold text-sm uppercase tracking-widest text-muted">Fiqh Intelligence</span>
                </header>
                <AnswerView question={query} answer={answer} madhab={answer?.madhab || 'hanafi'} onAskAnother={handleClear} />
            </div>
        );
    }

    // Default: Input View
    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <header className="h-[60px] flex items-center px-4 border-b border-border">
                <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <span className="ml-2 font-bold text-sm uppercase tracking-widest text-muted">Ask a Question</span>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                            type="text"
                            placeholder="Type a question..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-12 rounded-[24px] bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted/50 font-medium"
                            autoFocus
                        />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hover:bg-muted/10 flex items-center justify-center text-primary transition-colors">
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                {/* Common Questions */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Common Questions</h2>
                    <div className="space-y-2">
                        {COMMON_QUESTIONS.map((q, i) => (
                            <Link
                                key={i}
                                href={`/fiqh?q=${encodeURIComponent(q)}`}
                                className="block p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-sm font-medium text-foreground"
                            >
                                {q}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Topics */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold tracking-widest text-muted uppercase">Browse by Topic</h2>
                    <div className="flex flex-wrap gap-2">
                        {TOPICS.map((t) => (
                            <Link
                                key={t}
                                href={`/fiqh?q=${encodeURIComponent(t)}`}
                                className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-muted hover:text-foreground hover:border-primary/30 active:scale-95 transition-all"
                            >
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>

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
