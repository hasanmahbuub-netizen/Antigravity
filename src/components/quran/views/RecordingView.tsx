"use client";

import { motion } from "framer-motion";
import { Square, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

interface RecordingViewProps {
    onCancel: () => void;
    onStop: (audioBlob: Blob | null) => void;
}

export default function RecordingView({ onCancel, onStop }: RecordingViewProps) {
    const [seconds, setSeconds] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState<number[]>(Array(20).fill(10));

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    // Initialize MediaRecorder
    useEffect(() => {
        const startRecording = async () => {
            try {
                // Request microphone access
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }
                });
                streamRef.current = stream;

                // Setup audio analysis for visualization
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 64;
                source.connect(analyser);
                analyserRef.current = analyser;

                // Visualize audio levels
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                const updateLevels = () => {
                    analyser.getByteFrequencyData(dataArray);
                    const levels = Array.from({ length: 20 }, (_, i) => {
                        const idx = Math.floor(i * dataArray.length / 20);
                        return Math.max(10, (dataArray[idx] / 255) * 80);
                    });
                    setAudioLevel(levels);
                    animationRef.current = requestAnimationFrame(updateLevels);
                };
                updateLevels();

                // Create MediaRecorder
                const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                    ? 'audio/webm'
                    : 'audio/mp4';

                const mediaRecorder = new MediaRecorder(stream, { mimeType });
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                    console.log('📼 Recording stopped, blob size:', audioBlob.size);
                    onStop(audioBlob);
                };

                mediaRecorder.start(100); // Collect data every 100ms
                console.log('🎤 Recording started...');

            } catch (err: unknown) {
                console.error('Microphone access denied:', err);
                setError('Could not access microphone. Please allow microphone access and try again.');
            }
        };

        startRecording();

        return cleanup;
    }, [cleanup, onStop]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => {
                if (s >= 59) { // Max 60 seconds
                    handleStop();
                    return s;
                }
                return s + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleStop = () => {
        cleanup();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        } else {
            onStop(null);
        }
    };

    const handleCancel = () => {
        cleanup();
        onCancel();
    };

    // Format MM:SS
    const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center text-center p-6"
            >
                <div className="flex-1 flex flex-col items-center justify-center max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-medium text-foreground mb-4">Microphone Access Required</h2>
                    <p className="text-sm text-muted mb-8">{error}</p>
                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center text-center p-6"
        >
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">

                {/* 1. Status */}
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-bold tracking-widest text-primary uppercase">Recording</span>
                    <span className="font-mono text-muted w-12 text-left">{formattedTime}</span>
                </div>

                {/* 2. Real Waveform Visualization */}
                <div className="h-40 flex items-center justify-center gap-1 mb-12 w-full">
                    {audioLevel.map((level, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: level }}
                            transition={{ duration: 0.1 }}
                            className="w-2 bg-primary/60 rounded-full"
                        />
                    ))}
                </div>

                {/* 3. Prompt */}
                <h2 className="font-english text-xl font-medium text-foreground mb-4">
                    Recite the verse...
                </h2>

                {/* 4. Stop Action */}
                <button
                    onClick={handleStop}
                    className="mt-8 w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors border-2 border-red-500/20"
                >
                    <Square className="w-6 h-6 fill-current" />
                </button>
                <p className="mt-4 text-sm text-muted">Tap to stop</p>

            </div>

            {/* 5. Footer / Cancel */}
            <div className="pb-10">
                <button
                    onClick={handleCancel}
                    className="text-sm text-muted hover:text-red-500 font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </motion.div>
    );
}

