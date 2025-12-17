"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ListenTab from "./tabs/ListenTab";
import MeaningTab from "./tabs/MeaningTab";
import PracticeTab from "./tabs/PracticeTab";

// New Views
import RecordingView from "./views/RecordingView";
import ProcessingView from "./views/ProcessingView";
import FeedbackView from "./views/FeedbackView";
import VerseCompletedModal from "./modals/VerseCompletedModal";
import SurahSelectorModal from "./modals/SurahSelector";
import { AnimatePresence } from "framer-motion";

type Tab = "listen" | "meaning" | "practice";
type ViewMode = "tabs" | "recording" | "processing" | "feedback";

export default function PracticeScreen() {
    const [activeTab, setActiveTab] = useState<Tab>("listen");
    const [viewMode, setViewMode] = useState<ViewMode>("tabs");
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showSurahSelector, setShowSurahSelector] = useState(false);
    const [currentSurah, setCurrentSurah] = useState("Surah Al-Fatiha");

    // Transition: Processing -> Feedback (Simulate AI)
    useEffect(() => {
        if (viewMode === "processing") {
            const timer = setTimeout(() => {
                setViewMode("feedback");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [viewMode]);

    const handleStartRecording = () => {
        setViewMode("recording");
    };

    const handleMarkComplete = () => {
        setShowCompletionModal(true);
    };

    const handleRetry = () => {
        setViewMode("tabs");
        setActiveTab("practice");
    };

    const handleContinueNextVerse = () => {
        setShowCompletionModal(false);
        setViewMode("tabs");
        setActiveTab("listen");
        // In a real app, increment verse ID here
    };

    const handleSurahSelect = (surahName: string) => {
        setCurrentSurah(`Surah ${surahName}`);
        setShowSurahSelector(false);
        setActiveTab("listen");
        setViewMode("tabs");
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative">

            {/* Top Header */}
            {viewMode !== "recording" && viewMode !== "processing" && viewMode !== "feedback" && (
                <header className="h-[60px] flex items-center justify-between px-6 border-b border-border/50 shrink-0 relative z-10">
                    <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground">
                        <X className="w-6 h-6" />
                    </Link>

                    <button
                        onClick={() => setShowSurahSelector(true)}
                        className="flex flex-col items-center group"
                    >
                        <span className="text-sm font-bold font-english flex items-center gap-1 group-hover:text-primary transition-colors">
                            {currentSurah}
                            <ChevronDown className="w-3 h-3 text-muted" />
                        </span>
                        <div className="flex gap-1 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                        </div>
                    </button>

                    <div className="w-10" />
                </header>
            )}

            {/* Tab Navigation */}
            {viewMode === "tabs" && (
                <div className="py-4 px-6 flex justify-center shrink-0">
                    <div className="bg-muted/10 p-1 rounded-full flex relative">
                        {["listen", "meaning", "practice"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as Tab)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-all relative z-10 capitalize",
                                    activeTab === tab ? "text-primary-foreground" : "text-muted hover:text-foreground"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                        <div className={cn(
                            "absolute top-1 bottom-1 rounded-full bg-primary transition-all duration-300",
                            activeTab === "listen" ? "left-1 right-[66.6%]" :
                                activeTab === "meaning" ? "left-[33.3%] right-[33.3%]" : "left-[66.6%] right-1"
                        )} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative flex flex-col">

                {/* 1. TABS MODE */}
                {viewMode === "tabs" && (
                    <>
                        {activeTab === "listen" && <ListenTab />}
                        {activeTab === "meaning" && <MeaningTab />}
                        {activeTab === "practice" && (
                            <PracticeTab
                                onStartRecording={handleStartRecording}
                            />
                        )}
                    </>
                )}

                {/* 2. FEEDBACK MODE */}
                {viewMode === "feedback" && (
                    <FeedbackView
                        onRetry={handleRetry}
                        onComplete={handleMarkComplete}
                        onNextVerse={handleContinueNextVerse}
                    />
                )}

                {/* 3. OVERLAYS */}
                <AnimatePresence>
                    {viewMode === "recording" && (
                        <RecordingView key="rec" onCancel={() => setViewMode("tabs")} />
                    )}
                    {showSurahSelector && (
                        <SurahSelectorModal
                            key="selector"
                            onClose={() => setShowSurahSelector(false)}
                            onSelect={handleSurahSelect}
                        />
                    )}
                </AnimatePresence>

                {viewMode === "processing" && <ProcessingView />}

            </main>

            {/* Bottom Navigation */}
            {viewMode === "tabs" && (
                <footer className="h-[80px] border-t border-border bg-background px-6 flex items-center justify-between shrink-0">
                    <button className="flex items-center gap-2 text-muted hover:text-foreground text-sm font-medium disabled:opacity-50">
                        <ChevronLeft className="w-5 h-5" />
                        Prev Verse
                    </button>
                    <span className="text-xs text-muted/40 font-mono">Verse 1 of 7</span>
                    <button className="flex items-center gap-2 text-primary text-sm font-medium hover:opacity-80">
                        Next Verse
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </footer>
            )}

            {/* MODALS */}
            {showCompletionModal && (
                <VerseCompletedModal onContinue={handleContinueNextVerse} />
            )}

        </div>
    );
}
