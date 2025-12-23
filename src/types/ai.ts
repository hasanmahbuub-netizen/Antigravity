/**
 * Shared TypeScript types for AI services
 */

export interface TajweedFeedback {
    score: number;
    positives: string[];
    improvements: string[];
    details: string;
}

export interface FiqhAnswer {
    directAnswer: string;
    reasoning: string;
    otherSchools: string;
    citations: string[];
}
