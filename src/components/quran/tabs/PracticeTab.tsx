"use client";

import InlineRecording from "./InlineRecording";

interface PracticeTabProps {
    onStartRecording?: () => void;
    arabic: string;
    surahId: number;
    verseId: number;
    onRecordingComplete?: (feedback: any) => void;
}

export default function PracticeTab({
    arabic,
    surahId,
    verseId,
    onRecordingComplete
}: PracticeTabProps) {
    return (
        <InlineRecording
            arabic={arabic}
            surahId={surahId}
            verseId={verseId}
            onComplete={onRecordingComplete}
        />
    );
}
