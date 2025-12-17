"use client";

import { Search, Mic } from "lucide-react";
import Link from "next/link";

const TOPICS = [
    "Prayer",
    "Fasting",
    "Work",
    "Family"
];

export default function ZoneB_Fiqh() {
    return (
        <section className="h-full flex flex-col gap-4">
            {/* Heading */}
            <h2 className="text-sm font-bold tracking-widest text-muted uppercase pl-1 font-sans">
                Ask a Question
            </h2>

            {/* Main Card (Input) */}
            <Link href="/fiqh" className="block relative flex-1 min-h-0 group">
                <div className="h-full w-full p-6 rounded-[24px] border border-border bg-card shadow-sm group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between">

                    {/* Prompt Text */}
                    <div className="space-y-2">
                        <p className="text-lg text-muted font-english leading-relaxed">
                            About prayer, fasting, <br />
                            daily life & relationships...
                        </p>
                    </div>

                    {/* Fake Input UI */}
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

            {/* Suggested Topic Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {TOPICS.map((topic) => (
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
