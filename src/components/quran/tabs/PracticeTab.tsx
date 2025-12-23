"use client";

import InlineRecording from "./InlineRecording";

interface PracticeTabProps {
    arabic: string;
    surahId: number;
    verseId: number;
    sheikhAudioUrl?: string;
    onRecordingComplete?: (feedback: any) => void;
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
