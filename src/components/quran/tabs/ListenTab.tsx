"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ListenTabProps {
    arabic: string;
    translation: string;
    audioUrl: string;
    surahId?: number;
    verseId?: number;
}

interface WordData {
    text_uthmani: string;
    transliteration?: { text: string };
    translation?: { text: string };
    audio?: { url: string };
}

export default function ListenTab({ arabic, translation, audioUrl, surahId = 1, verseId = 1 }: ListenTabProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [wordMeanings, setWordMeanings] = useState<WordData[]>([]);
    const [playingWordIndex, setPlayingWordIndex] = useState<number | null>(null);
    const [loadingWords, setLoadingWords] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const wordAudioRef = useRef<HTMLAudioElement | null>(null);

    // Load word-by-word data from Quran.com API
    useEffect(() => {
        async function loadWords() {
            if (!surahId || !verseId) return;

            setLoadingWords(true);
            try {
                const verseKey = `${surahId}:${verseId}`;
                const response = await fetch(
                    `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,transliteration&translations=20&audio=7`
                );

                if (response.ok) {
                    const data = await response.json();
                    setWordMeanings(data.verse?.words || []);
                }
            } catch (err) {
                console.error("Failed to load words:", err);
                // Fallback to simple word split
                setWordMeanings(arabic.split(' ').filter(w => w.trim()).map(word => ({
                    text_uthmani: word,
                    transliteration: { text: '' },
                    translation: { text: '' }
                })));
            } finally {
                setLoadingWords(false);
            }
        }

        loadWords();
    }, [surahId, verseId, arabic]);

    useEffect(() => {
        // Create audio element for main recitation
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

    const playWord = async (word: WordData, idx: number) => {
        // Stop any currently playing word audio
        if (wordAudioRef.current) {
            wordAudioRef.current.pause();
            wordAudioRef.current = null;
        }

        // Check if word has audio URL
        const audioUrl = word.audio?.url;
        if (!audioUrl) {
            // No word audio available, just highlight
            setPlayingWordIndex(idx);
            setTimeout(() => setPlayingWordIndex(null), 500);
            return;
        }

        setPlayingWordIndex(idx);

        try {
            const audio = new Audio(`https://audio.qurancdn.com/${audioUrl}`);
            wordAudioRef.current = audio;

            audio.onended = () => {
                setPlayingWordIndex(null);
                wordAudioRef.current = null;
            };
            audio.onerror = () => {
                setPlayingWordIndex(null);
                wordAudioRef.current = null;
            };

            await audio.play();
        } catch (err) {
            console.error("Word audio error:", err);
            setPlayingWordIndex(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto px-6 pb-6">
            {/* Main Verse Display */}
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
                <h1 className="font-arabic text-3xl md:text-5xl leading-loose text-arabic" dir="rtl">
                    {arabic || "Loading..."}
                </h1>

                <p className="text-xs text-muted uppercase tracking-widest">
                    Listen & repeat • Tap words to hear pronunciation
                </p>

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

            {/* Word by Word with Audio */}
            <section className="space-y-4 mt-6">
                <h3 className="text-xs font-bold tracking-widest text-muted uppercase flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Word-by-Word (Tap to Hear)
                </h3>

                {loadingWords ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="p-4 rounded-2xl bg-muted/10 animate-pulse">
                                <div className="h-6 bg-muted/20 rounded mb-2" />
                                <div className="h-3 bg-muted/20 rounded w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {wordMeanings.filter(w => w.text_uthmani && !w.text_uthmani.includes('۞')).map((word, idx) => (
                            <motion.button
                                key={idx}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => playWord(word, idx)}
                                className={`p-4 rounded-2xl text-center transition-all relative ${playingWordIndex === idx
                                    ? 'bg-primary text-primary-foreground ring-2 ring-primary shadow-lg shadow-primary/20'
                                    : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
                                    }`}
                            >
                                {/* Sequence Number */}
                                <div className={`absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${playingWordIndex === idx ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted/20 text-muted'
                                    }`}>
                                    {idx + 1}
                                </div>

                                <div className="text-2xl mb-2 font-arabic text-primary" dir="rtl">
                                    {word.text_uthmani}
                                </div>
                                {word.transliteration?.text && (
                                    <div className="text-xs text-muted italic mb-1 tracking-wide">
                                        {word.transliteration.text}
                                    </div>
                                )}
                                {word.translation?.text && (
                                    <div className="text-sm font-medium text-foreground/80">
                                        {word.translation.text}
                                    </div>
                                )}
                                {playingWordIndex === idx && (
                                    <Volume2 className="w-3 h-3 mx-auto mt-2 animate-pulse" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

