"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";

interface ListenTabProps {
    arabic: string;
    translation: string;
    audioUrl: string;
}

export default function ListenTab({ arabic, translation, audioUrl }: ListenTabProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Parse Arabic words for word-by-word display
    const arabicWords = arabic ? arabic.split(' ').filter(w => w.trim()) : [];

    useEffect(() => {
        // Create audio element
        if (audioUrl) {
            audioRef.current = new Audio(audioUrl);

            audioRef.current.onended = () => setIsPlaying(false);
            audioRef.current.onplay = () => {
                setIsPlaying(true);
                setIsLoading(false);
            };
            audioRef.current.onpause = () => setIsPlaying(false);
            audioRef.current.onerror = () => {
                setError("Audio failed to load");
                setIsLoading(false);
                setIsPlaying(false);
            };
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    const toggleAudio = async () => {
        if (!audioRef.current) {
            setError("No audio available");
            return;
        }

        try {
            setError(null);
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                setIsLoading(true);
                await audioRef.current.play();
            }
        } catch (err) {
            console.error("Audio play error:", err);
            setError("Failed to play audio");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Main Verse Display */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                <h1 className="font-arabic text-3xl md:text-5xl leading-loose text-arabic" dir="rtl">
                    {arabic || "Loading..."}
                </h1>

                <div className="space-y-1">
                    <p className="font-english text-base text-muted font-medium">
                        "{translation || "Translation loading..."}"
                    </p>
                </div>

                {/* Audio Player CTA */}
                <button
                    onClick={toggleAudio}
                    disabled={isLoading || !audioUrl}
                    className="w-full py-4 rounded-xl bg-card border border-border flex items-center justify-center gap-3 text-primary font-medium shadow-sm hover:bg-muted/5 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : isPlaying ? (
                        <>
                            <Pause className="w-5 h-5 fill-current" />
                            <span>Pause</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" />
                            <span>Play Sheikh</span>
                        </>
                    )}
                </button>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
            </div>

            <div className="h-[1px] bg-border w-full my-2" />

            {/* Word by Word (Dynamic from verse) */}
            <div className="h-[200px] overflow-y-auto px-6 pb-6 space-y-4">
                <h3 className="text-xs font-bold tracking-widest text-muted uppercase mb-4 sticky top-0 bg-background py-2">
                    Word-by-Word Breakdown
                </h3>

                {arabicWords.length > 0 ? (
                    arabicWords.map((word, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/5 transition-colors border-b border-border/40 last:border-0 cursor-pointer group">
                            <div className="flex flex-col text-left">
                                <span className="font-english text-xs text-muted/60">Word {i + 1}</span>
                                <span className="font-english text-sm font-medium text-foreground">-</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-arabic text-xl text-arabic" dir="rtl">{word}</span>
                                <button className="p-2 rounded-full bg-muted/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Volume2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-sm text-center py-4">Loading words...</p>
                )}
            </div>
        </div>
    );
}
