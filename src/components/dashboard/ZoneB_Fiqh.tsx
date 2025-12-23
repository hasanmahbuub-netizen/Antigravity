"use client";

import { useState, useEffect } from "react";
import { Search, Mic, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
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
                    .limit(3);

                setRecentQuestions(data || []);
            } catch (err) {
                console.error("Fiqh history fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiqhHistory();
    }, []);

    return (
        <section className="h-full flex flex-col gap-4">
            {/* Heading */}
            <h2 className="text-sm font-bold tracking-widest text-muted uppercase pl-1 font-sans">
                {recentQuestions.length > 0 ? "Your Recent Questions" : "Ask a Question"}
            </h2>

            {/* Recent History or Suggestions */}
            {loading ? (
                <div className="flex-1 bg-card rounded-[24px] border border-border flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-primary/30 animate-spin" />
                </div>
            ) : recentQuestions.length > 0 ? (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                    {recentQuestions.map((q) => (
                        <Link
                            key={q.id}
                            href={`/fiqh?q=${encodeURIComponent(q.question)}`}
                            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all flex items-start gap-3 group"
                        >
                            <MessageCircle className="w-4 h-4 text-primary/40 mt-0.5 group-hover:text-primary transition-colors" />
                            <p className="text-sm text-foreground font-medium line-clamp-2 leading-relaxed">
                                {q.question}
                            </p>
                        </Link>
                    ))}
                    <Link href="/fiqh" className="text-xs font-bold text-primary mt-1 text-center py-2 hover:underline">
                        Ask Something New →
                    </Link>
                </div>
            ) : (
                <Link href="/fiqh" className="block relative flex-1 min-h-0 group">
                    <div className="h-full w-full p-6 rounded-[24px] border border-border bg-card shadow-sm group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between">
                        <div className="space-y-2">
                            <p className="text-lg text-muted font-english leading-relaxed">
                                About prayer, fasting, <br />
                                daily life & relationships...
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-12 bg-background rounded-full border border-border flex items-center px-4 text-muted text-sm group-hover:border-primary/30 transition-colors">
                                Tap to ask...
                            </div>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Mic className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            )}

            {/* Suggested Topic Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
                {DEFAULT_TOPICS.map((topic) => (
                    <Link
                        key={topic}
                        href={`/fiqh?q=${encodeURIComponent(topic)}`}
                        className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-muted hover:text-foreground hover:border-primary/30 active:scale-95 transition-all whitespace-nowrap"
                    >
                        {topic}
                    </Link>
                ))}
            </div>
        </section>
    );
}

