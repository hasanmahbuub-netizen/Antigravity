"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
    "How to pray",
    "Zakat rules",
    "Halal food",
    "Morning Adhkar"
];

export default function ZoneB_Fiqh() {
    return (
        <section className="flex flex-col space-y-4">
            {/* Heading */}
            <h2 className="text-lg font-medium text-foreground font-sans pl-1">
                Seek Clarity
            </h2>

            {/* Search Input */}
            <Link href="/fiqh" className="block relative">
                <div className="h-14 w-full px-4 rounded-[16px] border border-border bg-background flex items-center shadow-sm transition-transform active:scale-[0.99]">
                    <span className="text-lg text-muted truncate font-sans">
                        Ask about prayer, fasting...
                    </span>
                    <div className="absolute right-4 top-4 text-primary">
                        <Search className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                </div>
            </Link>

            {/* Suggested Chips */}
            <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar pl-1">
                {SUGGESTED_QUESTIONS.map((q) => (
                    <Link
                        key={q}
                        href={`/fiqh?q=${encodeURIComponent(q)}`}
                        className="bg-card border border-border rounded-full px-5 py-2.5 text-sm font-medium text-muted whitespace-nowrap active:bg-muted/5 transition-colors font-sans"
                    >
                        {q}
                    </Link>
                ))}
            </div>
        </section>
    );
}
