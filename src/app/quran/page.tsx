"use client";

import { useState } from "react";
import { ChevronLeft, Volume2, Mic, RotateCcw, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ViewState = "read" | "context" | "practice";

export default function QuranPage() {
    const [view, setView] = useState<ViewState>("read");
    const [direction, setDirection] = useState(0);

    const switchView = (newView: ViewState) => {
        const order = ["read", "context", "practice"];
        const newIdx = order.indexOf(newView);
        const oldIdx = order.indexOf(view);
        setDirection(newIdx > oldIdx ? 1 : -1);
        setView(newView);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative text-foreground">
            {/* Navbar */}
            <div className="flex items-center p-6 border-b border-border bg-background">
                <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1 flex justify-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full transition-colors", view === 'read' ? 'bg-primary' : 'bg-border')} />
                    <div className={cn("w-2 h-2 rounded-full transition-colors", view === 'context' ? 'bg-primary' : 'bg-border')} />
                    <div className={cn("w-2 h-2 rounded-full transition-colors", view === 'practice' ? 'bg-primary' : 'bg-border')} />
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col p-5">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    {view === "read" && (
                        <ReadState key="read" onNext={() => switchView("context")} />
                    )}
                    {view === "context" && (
                        <ContextState key="context" onPrev={() => switchView("read")} onNext={() => switchView("practice")} />
                    )}
                    {view === "practice" && (
                        <PracticeState key="practice" onBack={() => switchView("context")} />
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Nav */}
            <div className="h-[80px] border-t border-border flex items-center justify-around text-xs font-medium text-muted bg-background/50 backdrop-blur-sm">
                <button onClick={() => switchView('read')} className={cn("flex flex-col items-center gap-1", view === 'read' && "text-primary")}>
                    <span>Read</span>
                </button>
                <button onClick={() => switchView('context')} className={cn("flex flex-col items-center gap-1", view === 'context' && "text-primary")}>
                    <span>Context</span>
                </button>
                <button onClick={() => switchView('practice')} className={cn("flex flex-col items-center gap-1", view === 'practice' && "text-primary")}>
                    <span>Practice</span>
                </button>
            </div>
        </div>
    );
}

function ReadState({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
                if (offset.x < -100) onNext();
            }}
        >
            <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-card rounded-[24px] w-full shadow-sm">
                <p className="font-arabic text-3xl text-arabic text-center leading-loose">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
                <p className="text-base text-muted max-w-[280px] text-center leading-relaxed font-sans">
                    In the name of Allah, the Entirely Merciful, the Especially Merciful.
                </p>
                <button className="text-primary font-medium active:scale-95 transition-transform duration-200 mt-4 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Listen to teacher
                </button>
            </div>

            <p className="mt-8 text-xs text-muted/60">Swipe for understanding</p>
        </motion.div>
    );
}

function ContextState({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
    return (
        <motion.div
            className="absolute inset-0 p-5 overflow-y-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
                if (offset.x < -100) onNext();
                if (offset.x > 100) onPrev();
            }}
        >
            <div className="p-6 space-y-6 bg-card rounded-[24px] shadow-sm w-full">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Translation</h3>
                    <p className="text-base text-muted leading-relaxed font-sans">
                        "In the name of Allah, the Entirely Merciful, the Especially Merciful."
                    </p>
                </div>

                <hr className="border-border" />

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Why this verse matters</h3>
                    <p className="text-sm text-muted leading-relaxed font-sans">
                        This is the key to every door. It reminds us that our relationship with the Creator begins with mercy, not judgment. Used before any action, it sanctifies our intention.
                    </p>
                </div>

                <hr className="border-border" />

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">One Key Idea</h3>
                    <p className="text-sm text-muted leading-relaxed font-sans">
                        Mercy is the default state of the Universe.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function PracticeState({ onBack }: { onBack: () => void }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    return (
        <motion.div
            className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
                if (offset.x > 100) onBack();
            }}
        >
            <div className="p-6 flex flex-col items-center space-y-8 bg-card rounded-[24px] w-full shadow-sm py-12">
                {!isFinished ? (
                    <>
                        <p className="text-muted font-sans">Recite the verse</p>
                        <button
                            className={cn("w-36 h-36 rounded-full border-4 border-primary flex items-center justify-center transition-all duration-300 active:scale-95",
                                isRecording ? "bg-primary/10 scale-105" : "bg-transparent"
                            )}
                            onPointerDown={() => setIsRecording(true)}
                            onPointerUp={() => { setIsRecording(false); setTimeout(() => setIsFinished(true), 500); }}
                            onPointerLeave={() => setIsRecording(false)}
                        >
                            <Mic className={cn("w-10 h-10", isRecording ? "text-primary" : "text-muted")} />
                        </button>
                        <p className="text-xs text-muted">Hold to record</p>
                    </>
                ) : (
                    <div className="flex flex-col items-center w-full">
                        <h2 className="text-xl font-medium text-foreground mb-8">Do you feel close?</h2>
                        <div className="flex gap-4 w-full">
                            <button className="flex-1 py-3 rounded-[16px] border border-border text-muted font-medium active:bg-muted/5 flex items-center justify-center gap-2" onClick={() => setIsFinished(false)}>
                                <RotateCcw className="w-4 h-4" />
                                <span>Retry</span>
                            </button>
                            <button className="flex-1 py-3 rounded-[16px] bg-primary text-white font-medium shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" />
                                <span>I got it</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
