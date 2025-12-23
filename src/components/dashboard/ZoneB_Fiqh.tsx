"use client";

import { useState, useEffect } from "react";
import { Search, Mic, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DEFAULT_TOPICS = [
    "Prayer",
    "Fasting",
    "Marriage",
    "Zakat"
];

export default function ZoneB_Fiqh() {
    const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchFiqhHistory = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('fiqh_questions')
                    .select('question, id')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(2); // Reduced to 2 to make space for search bar

                setRecentQuestions(data || []);
            } catch (err) {
                console.error("Fiqh history fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiqhHistory();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/fiqh?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="h-full flex flex-col gap-3">
            {/* Heading */}
            <h2 className="text-sm font-bold tracking-widest text-muted uppercase pl-1 font-sans shrink-0">
                Ask a Question
            </h2>

            {/* Search Bar - ALWAYS VISIBLE */}
            <form onSubmit={handleSubmit} className="shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about prayer, fasting..."
                            className="w-full h-12 pl-10 pr-4 rounded-full bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors shrink-0"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {/* Recent Questions - Scrollable below search */}
            {loading ? (
                <div className="flex-1 bg-card rounded-[16px] border border-border flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-primary/30 animate-spin" />
                </div>
            ) : recentQuestions.length > 0 ? (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar min-h-0">
                    <p className="text-xs text-muted font-medium pl-1">Recent:</p>
                    {recentQuestions.map((q) => (
                        <Link
                            key={q.id}
                            href={`/fiqh?q=${encodeURIComponent(q.question)}`}
                            className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all flex items-start gap-2 group"
                        >
                            <MessageCircle className="w-3.5 h-3.5 text-primary/40 mt-0.5 group-hover:text-primary transition-colors shrink-0" />
                            <p className="text-xs text-foreground font-medium line-clamp-1 leading-relaxed">
                                {q.question}
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-muted text-center">
                        Type a question above to get started
                    </p>
                </div>
            )}

            {/* Suggested Topic Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
                {DEFAULT_TOPICS.map((topic) => (
                    <Link
                        key={topic}
                        href={`/fiqh?q=${encodeURIComponent(topic)}`}
                        className="px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted hover:text-foreground hover:border-primary/30 active:scale-95 transition-all whitespace-nowrap"
                    >
                        {topic}
                    </Link>
                ))}
            </div>
        </section>
    );
}
