/**
 * Environment Variable Validation Utility
 * 
 * Provides type-safe access to environment variables with
 * proper error handling instead of non-null assertions.
 */

// Required environment variables
const REQUIRED_ENV_VARS = {
    NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',
} as const;

// Optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
    GROQ_API_KEY: undefined,
    OPENAI_API_KEY: undefined,
    GEMINI_API_KEY: undefined,
    SUPABASE_SERVICE_ROLE_KEY: undefined,
    NEXT_PUBLIC_APP_URL: undefined,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: undefined,
} as const;

interface EnvConfig {
    // Required
    supabaseUrl: string;
    supabaseAnonKey: string;

    // Optional
    groqApiKey: string | undefined;
    openaiApiKey: string | undefined;
    geminiApiKey: string | undefined;
    supabaseServiceKey: string | undefined;
    appUrl: string | undefined;
    vapidPublicKey: string | undefined;
}

let cachedEnv: EnvConfig | null = null;
let validationErrors: string[] = [];

/**
 * Validate and get environment configuration
 * Throws error if required variables are missing
 */
export function getEnvConfig(): EnvConfig {
    if (cachedEnv) {
        return cachedEnv;
    }

    validationErrors = [];

    // Check required variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
        validationErrors.push('NEXT_PUBLIC_SUPABASE_URL is required');
    }
    if (!supabaseAnonKey) {
        validationErrors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
    }

    // In development, throw if required vars are missing
    // In production, log error but don't crash (Vercel might set them later)
    if (validationErrors.length > 0) {
        const errorMessage = `Missing required environment variables:\n${validationErrors.join('\n')}`;
        console.error('❌ Environment validation failed:', errorMessage);

        if (process.env.NODE_ENV === 'development') {
            throw new Error(errorMessage);
        }
    }

    cachedEnv = {
        supabaseUrl: supabaseUrl || '',
        supabaseAnonKey: supabaseAnonKey || '',
        groqApiKey: process.env.GROQ_API_KEY,
        openaiApiKey: process.env.OPENAI_API_KEY,
        geminiApiKey: process.env.GEMINI_API_KEY,
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    };

    return cachedEnv;
}

/**
 * Get Supabase URL with validation
 */
export function getSupabaseUrl(): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
        console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
        return '';
    }
    return url;
}

/**
 * Get Supabase Anon Key with validation
 */
export function getSupabaseAnonKey(): string {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key) {
        console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
        return '';
    }
    return key;
}

/**
 * Get Supabase Service Role Key (optional, for server-side only)
 */
export function getSupabaseServiceKey(): string | undefined {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/**
 * Check if an AI provider is configured
 */
export function hasAIProvider(provider: 'groq' | 'openai' | 'gemini'): boolean {
    switch (provider) {
        case 'groq':
            return !!process.env.GROQ_API_KEY;
        case 'openai':
            return !!process.env.OPENAI_API_KEY;
        case 'gemini':
            return !!process.env.GEMINI_API_KEY;
        default:
            return false;
    }
}

/**
 * Get the configured AI API key
 */
export function getAIApiKey(provider: 'groq' | 'openai' | 'gemini'): string | undefined {
    switch (provider) {
        case 'groq':
            return process.env.GROQ_API_KEY;
        case 'openai':
            return process.env.OPENAI_API_KEY;
        case 'gemini':
            return process.env.GEMINI_API_KEY;
        default:
            return undefined;
    }
}

/**
 * Get app URL for redirects (falls back to localhost in development)
 */
export function getAppUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return 'http://localhost:3000';
}

/**
 * Check if all required env vars are set
 */
export function isEnvValid(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}

/**
 * Get validation errors (for debugging)
 */
export function getEnvValidationErrors(): string[] {
    if (!cachedEnv) {
        getEnvConfig(); // Triggers validation
    }
    return [...validationErrors];
}
