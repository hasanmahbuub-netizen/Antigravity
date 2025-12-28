"use client";

import InlineRecording from "./InlineRecording";

interface TajweedFeedback {
    score: number;
    positives: string[];
    improvements: string[];
    details: string;
}

interface PracticeTabProps {
    arabic: string;
    surahId: number;
    verseId: number;
    sheikhAudioUrl?: string;
    onRecordingComplete?: (feedback: TajweedFeedback) => void;
    onMarkComplete?: () => void;
}

export default function PracticeTab({
    arabic,
    surahId,
    verseId,
    sheikhAudioUrl,
    onRecordingComplete,
    onMarkComplete
}: PracticeTabProps) {
    return (
        <InlineRecording
            arabic={arabic}
            surahId={surahId}
            verseId={verseId}
            sheikhAudioUrl={sheikhAudioUrl}
            onComplete={onRecordingComplete}
            onMarkComplete={onMarkComplete}
        />
    );
}

