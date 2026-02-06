"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronDown, Loader2, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AnswerView from "@/components/fiqh/AnswerView";

// Topic data with curated questions
const TOPICS = [
    {
        id: "prayer",
        name: "Prayer",
        icon: "🕌",
        questions: [
            "What breaks wudu?",
            "How to pray Fajr step by step?",
            "Can I combine prayers when traveling?",
            "How to make up missed prayers?"
        ]
    },
    {
        id: "fasting",
        name: "Fasting",
        icon: "🌙",
        questions: [
            "What invalidates the fast?",
            "Can I brush my teeth while fasting?",
            "Is it okay to take medicine?",
            "What are Sunnah fasts?"
        ]
    },
    {
        id: "work",
        name: "Work",
        icon: "💼",
        questions: [
            "Is my job halal?",
            "Can I work in a bank?",
            "Is stock trading halal?",
            "Is dropshipping halal?"
        ]
    },
    {
        id: "family",
        name: "Family",
        icon: "👨‍👩‍👧",
        questions: [
            "What are parents' rights in Islam?",
            "What is the Nikah contract?",
            "Are contraceptives allowed?",
            "What are inheritance rules?"
        ]
    },
    {
        id: "zakat",
        name: "Zakat",
        icon: "💎",
        questions: [
            "How to calculate Zakat?",
            "What is the Nisab threshold?",
            "Can I give Zakat to relatives?",
            "Who can receive Zakat?"
        ]
    },
    {
        id: "hajj",
        name: "Hajj",
        icon: "🕋",
        questions: [
            "What are the steps of Hajj?",
            "Is Hajj mandatory for everyone?",
            "What is Tawaf?",
            "Can women go without Mahram?"
        ]
    }
];

// Fiqh structured answer type
interface FiqhStructuredAnswer {
    directAnswer: string;
    reasoning: string;
    otherSchools: { madhab: string; position: string }[];
    citations: { source: string; reference: string; text: string }[];
    answer?: string;
    sources?: string;
}

interface FiqhApiResponse {
    data?: FiqhStructuredAnswer;
    madhab?: string;
    success?: boolean;
}

function FiqhContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [viewState, setViewState] = useState<"input" | "loading" | "result">("input");
    const [answer, setAnswer] = useState<FiqhApiResponse | null>(null);
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
    const [recentQuestions, setRecentQuestions] = useState<string[]>([]);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    // Fetch recent questions
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('fiqh_questions')
                    .select('question')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(2);

                if (data) {
                    setRecentQuestions(data.map((d: { question: string }) => d.question));
                }
            } catch (err) {
                console.error("Failed to fetch recent:", err);
            }
        };
        fetchRecent();
    }, []);

    // Auto-search effect
    useEffect(() => {
        const fetchAnswer = async (q: string) => {
            setViewState("loading");
            try {
                const { data: { session } } = await supabase.auth.getSession();

                let madhab = 'hanafi';
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('madhab')
                        .eq('id', session.user.id)
                        .single();
                    madhab = (profile as { madhab?: string } | null)?.madhab || 'hanafi';
                }

                // CRITICAL FIX: Use absolute URL for API call
                // WebView might resolve relative URLs to localhost, failing connection
                const baseUrl = window.location.origin.includes('localhost') && window.navigator.userAgent.includes('MeekApp')
                    ? 'https://meek-zeta.vercel.app' // Force production URL in Capacitor Dev
                    : ''; // Browser/Production Web handles relative fine, or absolute if needed

                const response = await fetch(`${baseUrl}/api/fiqh/ask`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
                    },
                    body: JSON.stringify({ question: q, madhab })
                });

                if (!response.ok) throw new Error('Failed');

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

    // Loading state
    if (viewState === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <motion.div
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </motion.div>
                <h2 className="text-lg font-medium text-foreground">Thinking...</h2>
                <p className="text-sm text-muted mt-1">Consulting scholarly sources</p>
            </div>
        );
    }

    // Result state
    if (viewState === "result") {
        return (
            <div className="flex flex-col h-screen bg-background">
                <header className="h-14 flex items-center px-4 border-b border-border shrink-0">
                    <button onClick={handleClear} className="p-2 -ml-2 text-muted hover:text-foreground">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="ml-2 text-sm font-medium text-muted">Back</span>
                </header>
                <AnswerView
                    question={query}
                    answer={answer?.data ?? null}
                    madhab={answer?.madhab || 'Hanafi'}
                    onAskAnother={handleClear}
                />
            </div>
        );
    }

    // Main input view - Calm, minimal design
    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="h-14 flex items-center px-4 border-b border-border shrink-0">
                <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1 text-center">
                    <span className="text-xs font-medium text-muted uppercase tracking-widest">Fiqh</span>
                </div>
                <div className="w-9" />
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto pb-24">
                <div className="max-w-lg mx-auto px-6 py-8">

                    {/* Greeting */}
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl font-serif text-foreground mb-2">
                            {getGreeting()}
                        </h1>
                        <p className="text-muted text-sm">
                            What would you like to know?
                        </p>
                    </motion.div>

                    {/* Recent Questions */}
                    {recentQuestions.length > 0 && (
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <p className="text-xs text-muted uppercase tracking-widest mb-3">Recent</p>
                            <div className="flex flex-wrap gap-2">
                                {recentQuestions.map((q, i) => (
                                    <Link
                                        key={i}
                                        href={`/fiqh?q=${encodeURIComponent(q)}`}
                                        className="px-3 py-2 rounded-full bg-card border border-border text-xs text-foreground hover:border-primary/30 transition-all truncate max-w-[200px]"
                                    >
                                        {q}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Topics - Simple pills that expand */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-xs text-muted uppercase tracking-widest mb-3">Browse Topics</p>
                        <div className="space-y-2">
                            {TOPICS.map((topic) => (
                                <div key={topic.id}>
                                    {/* Topic Pill */}
                                    <button
                                        onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${expandedTopic === topic.id
                                            ? "bg-primary/5 border-primary/20"
                                            : "bg-card border-border hover:border-primary/20"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{topic.icon}</span>
                                            <span className="text-sm font-medium text-foreground">{topic.name}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${expandedTopic === topic.id ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Expanded Questions */}
                                    <AnimatePresence>
                                        {expandedTopic === topic.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-2 pl-10 space-y-1">
                                                    {topic.questions.map((q, i) => (
                                                        <Link
                                                            key={i}
                                                            href={`/fiqh?q=${encodeURIComponent(q)}`}
                                                            className="block py-2 px-3 text-sm text-muted hover:text-foreground hover:bg-card rounded-lg transition-all"
                                                        >
                                                            {q}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Coming Soon - Minimal */}
                    <motion.div
                        className="mt-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-xs text-muted">
                            <Sparkles className="w-3 h-3 inline-block mr-1" />
                            Investment & Lifestyle guidance coming 2025
                        </p>
                    </motion.div>
                </div>
            </main>

            {/* Sticky Bottom Search */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border">
                <form onSubmit={handleSearch} className="max-w-lg mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask anything..."
                            className="w-full h-12 pl-11 pr-12 rounded-full bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
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
