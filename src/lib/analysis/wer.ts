/**
 * Word Error Rate (WER) Calculator for Arabic Speech
 * Measures accuracy of transcription vs expected text
 */

import { normalizeArabic, extractArabicWords } from '../providers/whisper';

export interface WERResult {
    wer: number; // Word Error Rate (0-100%)
    matchedWords: number;
    totalExpected: number;
    totalTranscribed: number;
    substitutions: number;
    insertions: number;
    deletions: number;
    alignedPairs: AlignedWord[];
}

export interface AlignedWord {
    expected: string | null;
    transcribed: string | null;
    match: 'correct' | 'substitution' | 'insertion' | 'deletion';
}

/**
 * Calculate Word Error Rate using Levenshtein distance
 */
export function calculateWER(expectedText: string, transcribedText: string): WERResult {
    const expected = extractArabicWords(expectedText);
    const transcribed = extractArabicWords(transcribedText);

    if (expected.length === 0) {
        return {
            wer: transcribed.length > 0 ? 100 : 0,
            matchedWords: 0,
            totalExpected: 0,
            totalTranscribed: transcribed.length,
            substitutions: 0,
            insertions: transcribed.length,
            deletions: 0,
            alignedPairs: transcribed.map(w => ({
                expected: null,
                transcribed: w,
                match: 'insertion'
            })),
        };
    }

    // Dynamic programming for edit distance
    const m = expected.length;
    const n = transcribed.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // Initialize
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = normalizeArabic(expected[i - 1]) === normalizeArabic(transcribed[j - 1]) ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,     // Deletion
                dp[i][j - 1] + 1,     // Insertion
                dp[i - 1][j - 1] + cost // Substitution or match
            );
        }
    }

    // Backtrack to get aligned pairs
    const alignedPairs: AlignedWord[] = [];
    let i = m, j = n;
    let substitutions = 0, insertions = 0, deletions = 0;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 &&
            normalizeArabic(expected[i - 1]) === normalizeArabic(transcribed[j - 1])) {
            alignedPairs.unshift({
                expected: expected[i - 1],
                transcribed: transcribed[j - 1],
                match: 'correct'
            });
            i--; j--;
        } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
            alignedPairs.unshift({
                expected: expected[i - 1],
                transcribed: transcribed[j - 1],
                match: 'substitution'
            });
            substitutions++;
            i--; j--;
        } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
            alignedPairs.unshift({
                expected: null,
                transcribed: transcribed[j - 1],
                match: 'insertion'
            });
            insertions++;
            j--;
        } else {
            alignedPairs.unshift({
                expected: expected[i - 1],
                transcribed: null,
                match: 'deletion'
            });
            deletions++;
            i--;
        }
    }

    const editDistance = dp[m][n];
    const wer = Math.round((editDistance / m) * 100);
    const matchedWords = m - substitutions - deletions;

    return {
        wer: Math.min(100, wer),
        matchedWords,
        totalExpected: m,
        totalTranscribed: n,
        substitutions,
        insertions,
        deletions,
        alignedPairs,
    };
}

/**
 * Get accuracy from WER (inverted for 0-50% range)
 */
export function werToAccuracy(wer: number): number {
    // WER 0% = 50% accuracy (perfect word match, base score)
    // WER 20% = 40% accuracy
    // WER 50% = 25% accuracy
    // WER 100% = 0% accuracy
    return Math.max(0, 50 - (wer * 0.5));
}
