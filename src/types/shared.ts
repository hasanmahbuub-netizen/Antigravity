/**
 * Shared TypeScript Type Definitions
 * 
 * Central location for all shared types used across the application.
 * This eliminates the need for 'any' types and provides proper type safety.
 */

// ============================================
// FIQH TYPES
// ============================================

/**
 * Citation from Islamic sources
 */
export interface FiqhCitation {
    source: 'Quran' | 'Hadith' | 'Scholar' | 'Ijma' | 'Qiyas' | string;
    reference: string;
    text: string;
    verified?: boolean;
}

/**
 * Other madhab position on a fiqh question
 */
export interface OtherMadhabPosition {
    madhab: string;
    position: string;
}

/**
 * Source verification metadata
 */
export interface SourceVerification {
    primarySourcesUsed: boolean;
    hallucinationRisk: string;
    confidenceLevel: string;
}

/**
 * Complete structured answer from Fiqh AI
 */
export interface FiqhStructuredAnswer {
    directAnswer: string;
    reasoning: string;
    otherSchools: OtherMadhabPosition[];
    citations: FiqhCitation[];
    sourceVerification?: SourceVerification;
}

/**
 * Fiqh question record from database
 */
export interface FiqhQuestion {
    id: string;
    user_id: string;
    question: string;
    madhab: string;
    answer: string | FiqhStructuredAnswer;
    response_time_ms?: number;
    hallucination_risk?: string;
    confidence_level?: string;
    created_at: string;
}

// ============================================
// QURAN TYPES
// ============================================

/**
 * Quran chapter (Surah)
 */
export interface QuranChapter {
    id: number;
    name_simple: string;
    name_arabic: string;
    verses_count: number;
    revelation_place: 'makkah' | 'madinah';
    revelation_order: number;
}

/**
 * Quran verse (Ayah)
 */
export interface QuranVerse {
    id: number;
    verse_key: string;
    text_uthmani: string;
    text_imlaei?: string;
    page_number: number;
    juz_number: number;
}

/**
 * Verse translation
 */
export interface VerseTranslation {
    id: number;
    resource_id: number;
    text: string;
}

/**
 * Tajweed analysis feedback
 */
export interface TajweedFeedback {
    score: number;
    positives: string[];
    improvements: string[];
    details: string;
}

/**
 * Recording result from practice session
 */
export interface RecordingResult {
    audioBlob?: Blob;
    duration: number;
    feedback?: TajweedFeedback;
}

/**
 * Verse progress tracking
 */
export interface VerseProgress {
    id: string;
    user_id: string;
    surah: number;
    ayah: number;
    score: number;
    recorded_at: string;
}

// ============================================
// USER & PROFILE TYPES
// ============================================

/**
 * User profile from database
 */
export interface UserProfile {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    madhab: 'Hanafi' | 'Maliki' | 'Shafii' | 'Hanbali';
    current_surah?: number;
    current_ayah?: number;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
    user_id: string;
    prayer_start: boolean;
    prayer_ending: boolean;
    dua_reminders: boolean;
    timezone: string;
    latitude?: number;
    longitude?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timing?: number;
}

/**
 * Fiqh API response
 */
export interface FiqhApiResponse extends ApiResponse<FiqhStructuredAnswer> {
    madhab: string;
    provider: 'groq' | 'gemini' | 'openai' | 'fallback' | 'cache';
    cached?: boolean;
    sourceVerification?: SourceVerification;
}

/**
 * Quran analyze API response
 */
export interface QuranAnalyzeResponse extends ApiResponse<TajweedFeedback> {
    audioSize?: number;
    practiceMode?: boolean;
    disclaimer?: string;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

/**
 * Recording component props
 */
export interface RecordingComponentProps {
    surah: number;
    ayah: number;
    verseText: string;
    onRecordingComplete: (feedback: TajweedFeedback) => void;
}

/**
 * Fiqh answer view props
 */
export interface AnswerViewProps {
    answer: FiqhStructuredAnswer;
    madhab: string;
    provider?: string;
    timing?: number;
}

/**
 * Inline recording props
 */
export interface InlineRecordingProps {
    surah: number;
    ayah: number;
    verseText: string;
    onComplete?: (feedback: TajweedFeedback) => void;
}

// ============================================
// ERROR TYPES
// ============================================

/**
 * Typed error for better error handling
 */
export interface AppError extends Error {
    code?: string;
    statusCode?: number;
    details?: Record<string, unknown>;
}

/**
 * Type guard for checking if error is AppError
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof Error && 'code' in error;
}

/**
 * Safe error message extraction
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unknown error occurred';
}
