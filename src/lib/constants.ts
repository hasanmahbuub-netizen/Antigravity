/**
 * Shared constants used across Settings and Onboarding pages.
 */

export const MADHABS = [
    { id: 'Hanafi', name: 'Hanafi', description: 'Most followed in South Asia, Turkey' },
    { id: 'Shafi\'i', name: "Shafi'i", description: 'Common in SE Asia, East Africa' },
    { id: 'Maliki', name: 'Maliki', description: 'Predominant in North & West Africa' },
    { id: 'Hanbali', name: 'Hanbali', description: 'Followed in Saudi Arabia' }
] as const;

export const ARABIC_LEVELS = [
    { value: 'beginner', label: 'Beginner', desc: 'Learning to read Arabic', emoji: '🌱' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Can read with some fluency', emoji: '📖' },
    { value: 'advanced', label: 'Advanced', desc: 'Fluent in Quranic Arabic', emoji: '⭐' }
] as const;

export const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'bn', name: 'Bangla', native: 'বাংলা', flag: '🇧🇩' }
] as const;
