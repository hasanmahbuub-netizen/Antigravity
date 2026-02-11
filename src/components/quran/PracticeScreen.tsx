"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import ListenTab from "./tabs/ListenTab";
import MeaningTab from "./tabs/MeaningTab";
import PracticeTab from "./tabs/PracticeTab";

import { quranApi } from "@/lib/quran-api";
import type { TajweedFeedback } from "@/lib/ai-service";
import { ALL_114_SURAHS, getSurahById } from "@/lib/surah-list";

// New Views
import RecordingView from "./views/RecordingView";
import ProcessingView from "./views/ProcessingView";
import FeedbackView from "./views/FeedbackView";
import VerseCompletedModal from "./modals/VerseCompletedModal";
import SurahSelectorModal from "./modals/SurahSelector";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "listen" | "meaning" | "practice";
type ViewMode = "tabs" | "recording" | "processing" | "feedback";

// Use all 114 surahs from the surah list
const SURAHS = ALL_114_SURAHS;

export default function PracticeScreen() {
    const [activeTab, setActiveTab] = useState<Tab>("listen");
    const [viewMode, setViewMode] = useState<ViewMode>("tabs");
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showSurahSelector, setShowSurahSelector] = useState(false);
    const [currentSurah, setCurrentSurah] = useState("Al-Fatiha");

    const [currentSurahId, setCurrentSurahId] = useState(1);
    const [currentVerseId, setCurrentVerseId] = useState(1);
    const [totalAyahs, setTotalAyahs] = useState(7);
    const [verseData, setVerseData] = useState<{ arabic: string, translation: string, audio_url: string } | null>(null);
    const [loadingVerse, setLoadingVerse] = useState(true);
    const [feedback, setFeedback] = useState<TajweedFeedback | null>(null);

    // Smart gesture handling - angle-based detection to distinguish scroll from swipe
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);

    // Load saved progress on mount
    useEffect(() => {
        const savedProgress = localStorage.getItem('quran_progress');
        if (savedProgress) {
            try {
                const { surahId, verseId, surahName, totalVerses } = JSON.parse(savedProgress);
                if (surahId && verseId) {
                    setCurrentSurahId(surahId);
                    setCurrentVerseId(verseId);
                    setCurrentSurah(surahName || 'Al-Fatiha');
                    setTotalAyahs(totalVerses || 7);
                }
            } catch (e) {
                console.error('Failed to load saved progress:', e);
            }
        }
    }, []);

    // Save progress when surah or verse changes
    useEffect(() => {
        localStorage.setItem('quran_progress', JSON.stringify({
            surahId: currentSurahId,
            verseId: currentVerseId,
            surahName: currentSurah,
            totalVerses: totalAyahs
        }));
    }, [currentSurahId, currentVerseId, currentSurah, totalAyahs]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const deltaX = endX - touchStartX.current;
        const deltaY = endY - touchStartY.current;

        // Calculate gesture angle (0° = horizontal, 90° = vertical)
        const angle = Math.abs(Math.atan2(deltaY, deltaX) * (180 / Math.PI));
        const horizontalDistance = Math.abs(deltaX);

        // Only trigger swipe if:
        // 1. Angle is mostly horizontal (< 30° or > 150°)
        // 2. Minimum 100px horizontal movement
        const isHorizontalSwipe = (angle < 30 || angle > 150) && horizontalDistance > 100;

        if (!isHorizontalSwipe) return; // It's a scroll, not a swipe

        if (deltaX < 0) {
            // Swiped left -> go to next tab
            if (activeTab === "listen") setActiveTab("meaning");
            else if (activeTab === "meaning") setActiveTab("practice");
        } else if (deltaX > 0) {
            // Swiped right -> go to previous tab
            if (activeTab === "practice") setActiveTab("meaning");
            else if (activeTab === "meaning") setActiveTab("listen");
        }
    };

    // Fetch Verse Data
    useEffect(() => {
        const fetchData = async () => {
            setLoadingVerse(true);
            try {
                const [textData, audioData] = await Promise.all([
                    quranApi.getVerseData(currentSurahId, currentVerseId),
                    quranApi.getTeacherRecitation(currentSurahId, currentVerseId)
                ]);
                setVerseData({
                    arabic: textData.arabic,
                    translation: textData.translation,
                    audio_url: audioData.audio_url
                });
            } catch (err) {
                console.error("Failed to fetch verse data:", err);
            } finally {
                setLoadingVerse(false);
            }
        };
        fetchData();
    }, [currentSurahId, currentVerseId]);

    const handleStartRecording = () => {
        setViewMode("recording");
    };

    const handleStopRecording = async (audioBlob: Blob | null) => {
        setViewMode("processing");
        setFeedback(null);

        try {
            // Create form data for API call
            const formData = new FormData();
            if (audioBlob) {
                formData.append('audio', audioBlob, 'recording.webm');
            }
            formData.append('surah', currentSurahId.toString());
            formData.append('ayah', currentVerseId.toString());

            // Use fetchWithAuth for resilient API calls
            const { fetchWithAuth } = await import('@/lib/fetchWithAuth');
            const response = await fetchWithAuth('/api/quran/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();
            setFeedback(result.feedback);
            setViewMode("feedback");

        } catch (error) {
            console.error('Recording analysis failed:', error);
            // Show mock feedback as fallback
            setFeedback({
                score: 75,
                positives: ["Good attempt at pronunciation"],
                improvements: ["Try again for better analysis"],
                details: "We couldn't analyze your recording. Please try again."
            });
            setViewMode("feedback");
        }
    };

    const handleMarkComplete = async () => {
        setShowCompletionModal(true);

        // Sync progress to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Type assertion needed - Supabase client lacks typed schema for this table
            await (supabase.from('quran_verse_progress') as ReturnType<typeof supabase.from>).insert({
                user_id: user.id,
                surah: currentSurahId,
                ayah: currentVerseId
            });
        }
    };

    const handleRetry = () => {
        setViewMode("tabs");
        setActiveTab("practice");
    };

    const handleContinueNextVerse = () => {
        setShowCompletionModal(false);
        setViewMode("tabs");
        setActiveTab("listen");
        if (currentVerseId < totalAyahs) {
            setCurrentVerseId(prev => prev + 1);
        }
    };

    const handlePrevVerse = () => {
        if (currentVerseId > 1) {
            setCurrentVerseId(prev => prev - 1);
            setActiveTab("listen");
        }
    };

    const handleNextVerse = () => {
        if (currentVerseId < totalAyahs) {
            setCurrentVerseId(prev => prev + 1);
            setActiveTab("listen");
        }
    };

    const handleSurahSelect = (surahId: number, surahName: string, totalVerses: number) => {
        setCurrentSurahId(surahId);
        setTotalAyahs(totalVerses);
        setCurrentSurah(surahName);
        setShowSurahSelector(false);
        setActiveTab("listen");
        setViewMode("tabs");
        setCurrentVerseId(1);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground relative">

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
                <div className="py-4 px-6 flex justify-center items-center shrink-0">
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
            <main className="flex-1 relative flex flex-col">

                {/* 1. TABS MODE with Swipe Gesture Support */}
                {viewMode === "tabs" && (
                    <>
                        {loadingVerse ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : verseData && (
                            <div
                                className="flex flex-col"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {activeTab === "listen" && (
                                    <ListenTab
                                        arabic={verseData.arabic}
                                        translation={verseData.translation}
                                        audioUrl={verseData.audio_url}
                                        surahId={currentSurahId}
                                        verseId={currentVerseId}
                                    />
                                )}
                                {activeTab === "meaning" && (
                                    <MeaningTab
                                        translation={verseData.translation}
                                        arabic={verseData.arabic}
                                        surahId={currentSurahId}
                                        verseId={currentVerseId}
                                    />
                                )}
                                {activeTab === "practice" && (
                                    <PracticeTab
                                        arabic={verseData.arabic}
                                        surahId={currentSurahId}
                                        verseId={currentVerseId}
                                        sheikhAudioUrl={verseData.audio_url}
                                        onRecordingComplete={(feedback) => {
                                            setFeedback(feedback);
                                        }}
                                        onMarkComplete={handleMarkComplete}
                                    />
                                )}

                                {/* Verse Navigation Footer - Only on Listen & Meaning tabs */}
                                {(activeTab === "listen" || activeTab === "meaning") && (
                                    <footer className="h-16 border-t border-border bg-background/80 backdrop-blur-sm px-4 flex items-center justify-between shrink-0 sticky bottom-0 mt-auto">
                                        <button
                                            onClick={handlePrevVerse}
                                            disabled={currentVerseId === 1}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Go to previous verse"
                                        >
                                            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                                            <span>Prev</span>
                                        </button>

                                        <span className="text-xs text-foreground/60">
                                            Verse {currentVerseId} of {totalAyahs}
                                        </span>

                                        <button
                                            onClick={handleNextVerse}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-primary hover:opacity-80 transition-colors"
                                            aria-label="Go to next verse"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                                        </button>
                                    </footer>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* 2. FEEDBACK MODE */}
                {viewMode === "feedback" && (
                    <FeedbackView
                        onRetry={handleRetry}
                        onComplete={handleMarkComplete}
                        onNextVerse={handleContinueNextVerse}
                        feedback={feedback}
                        surahName={currentSurah}
                        verseNumber={currentVerseId}
                        teacherAudioUrl={verseData?.audio_url || ""}
                    />
                )}

                {/* 3. OVERLAYS */}
                <AnimatePresence>
                    {viewMode === "recording" && (
                        <RecordingView
                            key="rec"
                            onCancel={() => setViewMode("tabs")}
                            onStop={handleStopRecording}
                        />
                    )}
                    {showSurahSelector && (
                        <SurahSelectorModal
                            key="selector"
                            onClose={() => setShowSurahSelector(false)}
                            onSelect={handleSurahSelect}
                            currentSurahId={currentSurahId}
                        />
                    )}
                </AnimatePresence>

                {viewMode === "processing" && <ProcessingView />}

            </main>

            {/* MODALS */}
            {showCompletionModal && (
                <VerseCompletedModal onContinue={handleContinueNextVerse} />
            )}

        </div>
    );
}

