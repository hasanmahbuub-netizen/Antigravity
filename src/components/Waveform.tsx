'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveformProps {
    isPlaying: boolean;
    color?: string;
    barCount?: number;
}

export default function Waveform({
    isPlaying,
    color = '#2DD4BF',
    barCount = 20
}: WaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const barsRef = useRef<number[]>([]);

    // Initialize bars
    useEffect(() => {
        barsRef.current = Array.from({ length: barCount }, () =>
            Math.random() * 0.5 + 0.2
        );
    }, [barCount]);

    // Animate when playing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const barWidth = 3;
        const gap = 3;
        const maxHeight = 40;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < barCount; i++) {
                // Animate bars when playing
                if (isPlaying) {
                    barsRef.current[i] = Math.random() * 0.7 + 0.3;
                }

                const height = barsRef.current[i] * maxHeight;
                const x = i * (barWidth + gap);
                const y = (canvas.height - height) / 2;

                ctx.fillStyle = isPlaying ? color : '#4B5563';
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, height, 2);
                ctx.fill();
            }

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(draw);
            }
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, color, barCount]);

    return (
        <canvas
            ref={canvasRef}
            width={barCount * 6}
            height={50}
            className="flex-1"
        />
    );
}

// Animated Waveform using Framer Motion (alternative)
export function AnimatedWaveform({
    isPlaying,
    color = '#2DD4BF',
    barCount = 15
}: WaveformProps) {
    return (
        <div className="flex items-center gap-1 h-10">
            {Array.from({ length: barCount }).map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{ backgroundColor: isPlaying ? color : '#4B5563' }}
                    animate={{
                        height: isPlaying
                            ? [10, 30, 15, 35, 20][i % 5] + Math.random() * 10
                            : [8, 12, 10, 14, 11][i % 5]
                    }}
                    transition={{
                        duration: 0.2,
                        repeat: isPlaying ? Infinity : 0,
                        repeatType: 'reverse',
                        delay: i * 0.05
                    }}
                />
            ))}
        </div>
    );
}

