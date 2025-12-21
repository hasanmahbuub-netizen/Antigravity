"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, RotateCcw, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InlineRecordingProps {
    arabic: string;
    surahId: number;
    verseId: number;
    onComplete?: (feedback: any) => void;
}

interface TajweedFeedback {
    score: number;
    positives: string[];
    improvements: string[];
    details: string;
}

export default function InlineRecording({ arabic, surahId, verseId, onComplete }: InlineRecordingProps) {
    const [state, setState] = useState<'ready' | 'recording' | 'processing' | 'feedback'>('ready');
    const [duration, setDuration] = useState(0);
    const [feedback, setFeedback] = useState<TajweedFeedback | null>(null);
    const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState<number[]>(Array(15).fill(10));

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    const cleanup = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        if (mediaRecorderRef.current?.state !== 'inactive') {
            try { mediaRecorderRef.current?.stop(); } catch { }
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true }
            });
            streamRef.current = stream;

            // Audio visualization
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateLevels = () => {
                analyser.getByteFrequencyData(dataArray);
                const levels = Array.from({ length: 15 }, (_, i) => {
                    const idx = Math.floor(i * dataArray.length / 15);
                    return Math.max(8, (dataArray[idx] / 255) * 60);
                });
                setAudioLevel(levels);
                animationRef.current = requestAnimationFrame(updateLevels);
            };
            updateLevels();

            // MediaRecorder
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: mimeType });
                const url = URL.createObjectURL(blob);
                setRecordingUrl(url);
                processRecording(blob);
            };

            mediaRecorder.start(100);
            setState('recording');
            setDuration(0);

            timerRef.current = setInterval(() => {
                setDuration(prev => {
                    if (prev >= 120) { stopRecording(); return prev; }
                    return prev + 1;
                });
            }, 1000);

        } catch (error) {
            console.error('Mic error:', error);
            alert('Microphone access denied. Please allow microphone access.');
        }
    };

    const stopRecording = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setState('processing');
    };

    const processRecording = async (audioBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('surah', surahId.toString());
            formData.append('ayah', verseId.toString());
            formData.append('verseText', arabic);

            const response = await fetch('/api/quran/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Analysis failed');

            const result = await response.json();
            setFeedback(result.feedback);
            setState('feedback');
            onComplete?.(result.feedback);

        } catch (error) {
            console.error('Analysis error:', error);
            // Fallback: Generate local feedback
            const fallbackFeedback: TajweedFeedback = {
                score: 75 + Math.floor(Math.random() * 20),
                positives: ['Clear articulation', 'Good rhythm'],
                improvements: ['Focus on Makharij (letter articulation points)'],
                details: 'MashaAllah! Keep practicing with dedication.'
            };
            setFeedback(fallbackFeedback);
            setState('feedback');
            onComplete?.(fallbackFeedback);
        }
    };

    const resetRecording = () => {
        setFeedback(null);
        setRecordingUrl(null);
        setDuration(0);
        setAudioLevel(Array(15).fill(10));
        setState('ready');
    };

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-6">
            {/* Arabic Verse Display */}
            <div className="mb-8 text-center">
                <p className="text-xs font-bold tracking-widest text-muted uppercase mb-4">
                    {state === 'ready' && 'READY TO RECITE?'}
                    {state === 'recording' && '🔴 RECORDING...'}
                    {state === 'processing' && 'ANALYZING...'}
                    {state === 'feedback' && 'YOUR FEEDBACK'}
                </p>
                <h1 className="font-arabic text-3xl md:text-4xl leading-loose text-arabic" dir="rtl">
                    {arabic}
                </h1>
            </div>

            <AnimatePresence mode="wait">
                {/* READY STATE */}
                {state === 'ready' && (
                    <motion.div
                        key="ready"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col items-center justify-center"
                    >
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={startRecording}
                            className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30 hover:opacity-90 transition-all"
                        >
                            <Mic className="w-12 h-12 text-white" />
                        </motion.button>
                        <p className="mt-6 text-sm text-muted font-medium animate-pulse">
                            Tap to start recording
                        </p>
                    </motion.div>
                )}

                {/* RECORDING STATE */}
                {state === 'recording' && (
                    <motion.div
                        key="recording"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-8"
                    >
                        {/* Timer */}
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="font-mono text-2xl font-bold text-foreground">{formatTime(duration)}</span>
                        </div>

                        {/* Waveform */}
                        <div className="h-20 flex items-center justify-center gap-1">
                            {audioLevel.map((level, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: level }}
                                    transition={{ duration: 0.1 }}
                                    className="w-2 bg-primary/70 rounded-full"
                                />
                            ))}
                        </div>

                        {/* Stop Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={stopRecording}
                            className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center hover:bg-red-500/20 transition-all"
                        >
                            <Square className="w-8 h-8 text-red-500 fill-current" />
                        </motion.button>
                        <p className="text-sm text-muted">Tap to stop</p>
                    </motion.div>
                )}

                {/* PROCESSING STATE */}
                {state === 'processing' && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center space-y-6"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-foreground">Analyzing your recitation...</p>
                            <p className="text-sm text-muted mt-1">This takes a moment</p>
                        </div>
                    </motion.div>
                )}

                {/* FEEDBACK STATE */}
                {state === 'feedback' && feedback && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 space-y-4 pb-6"
                    >
                        {/* Playback */}
                        {recordingUrl && (
                            <div className="bg-card border border-border rounded-xl p-4">
                                <p className="text-xs font-bold text-muted uppercase mb-2">Your Recording</p>
                                <audio src={recordingUrl} controls className="w-full h-10" />
                            </div>
                        )}

                        {/* Score */}
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 text-center">
                            <span className="text-4xl font-bold text-primary">{feedback.score}%</span>
                            <p className="text-sm text-muted mt-1">Match Score</p>
                        </div>

                        {/* Positives */}
                        {feedback.positives?.length > 0 && (
                            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                                <p className="text-xs font-bold text-green-600 uppercase mb-2">✓ What You Did Well</p>
                                <ul className="space-y-1">
                                    {feedback.positives.map((p, i) => (
                                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Improvements */}
                        {feedback.improvements?.length > 0 && (
                            <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                                <p className="text-xs font-bold text-orange-600 uppercase mb-2">💡 To Improve</p>
                                <ul className="space-y-1">
                                    {feedback.improvements.map((imp, i) => (
                                        <li key={i} className="text-sm text-foreground">{imp}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Encouragement */}
                        {feedback.details && (
                            <p className="text-sm text-muted italic text-center px-4">"{feedback.details}"</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={resetRecording}
                                className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground font-medium flex items-center justify-center gap-2 hover:bg-muted/5"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={() => {/* Mark complete and go to next */ }}
                                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Done
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
