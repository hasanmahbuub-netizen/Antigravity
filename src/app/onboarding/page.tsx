'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Globe, Target, ArrowRight, Check } from 'lucide-react';

const MADHABS = [
    { id: 'Hanafi', name: 'Hanafi', description: 'Most followed in South Asia, Turkey' },
    { id: 'Shafi\'i', name: "Shafi'i", description: 'Common in SE Asia, East Africa' },
    { id: 'Maliki', name: 'Maliki', description: 'Predominant in North & West Africa' },
    { id: 'Hanbali', name: 'Hanbali', description: 'Followed in Saudi Arabia' }
];

const ARABIC_LEVELS = [
    { value: 'beginner', label: 'Beginner', desc: 'Learning to read Arabic', emoji: '🌱' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Can read with some fluency', emoji: '📖' },
    { value: 'advanced', label: 'Advanced', desc: 'Fluent in Quranic Arabic', emoji: '⭐' }
];

const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'bn', name: 'Bangla', native: 'বাংলা', flag: '🇧🇩' }
];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [madhab, setMadhab] = useState('Hanafi');
    const [arabicLevel, setArabicLevel] = useState('beginner');
    const [language, setLanguage] = useState('en');
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const totalSteps = 3;

    const handleComplete = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                await supabase.from('profiles').upsert({
                    id: user.id,
                    madhab,
                    arabic_level: arabicLevel,
                    language,
                    onboarding_completed: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }

            router.push('/dashboard');
        } catch (error) {
            console.error('Onboarding error:', error);
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <span className="text-3xl">📿</span>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to IMANOS</h1>
                    <p className="text-muted text-sm">Let's personalize your learning experience</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted/20'
                                }`}
                        />
                    ))}
                </div>

                {/* Steps */}
                <AnimatePresence mode="wait">
                    {/* Step 1: Madhab */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-card rounded-2xl p-6 border border-border"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-foreground">Which madhab do you follow?</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {MADHABS.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMadhab(m.id)}
                                        className={`p-4 rounded-xl text-left transition-all ${madhab === m.id
                                                ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                                                : 'bg-muted/10 text-foreground hover:bg-muted/20'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold">{m.name}</span>
                                            {madhab === m.id && <Check className="w-4 h-4" />}
                                        </div>
                                        <p className="text-xs opacity-70">{m.description}</p>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Arabic Level */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-card rounded-2xl p-6 border border-border"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Target className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-foreground">Your Arabic level?</h2>
                            </div>

                            <div className="space-y-3 mb-6">
                                {ARABIC_LEVELS.map((level) => (
                                    <button
                                        key={level.value}
                                        onClick={() => setArabicLevel(level.value)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${arabicLevel === level.value
                                                ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                                                : 'bg-muted/10 text-foreground hover:bg-muted/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{level.emoji}</span>
                                            <div>
                                                <div className="font-semibold">{level.label}</div>
                                                <div className="text-sm opacity-75">{level.desc}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Language */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-card rounded-2xl p-6 border border-border"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Globe className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-foreground">Preferred language?</h2>
                            </div>

                            <div className="space-y-3 mb-6">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${language === lang.code
                                                ? 'bg-accent text-accent-foreground ring-2 ring-accent'
                                                : 'bg-muted/10 text-foreground hover:bg-muted/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{lang.flag}</span>
                                            <div>
                                                <div className="font-semibold">{lang.native}</div>
                                                <div className="text-sm opacity-75">{lang.name}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleComplete}
                                    disabled={saving}
                                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? 'Starting...' : 'Start Learning'}
                                    {!saving && <span>🚀</span>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Skip Option */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full text-center text-sm text-muted mt-4 hover:text-foreground transition-colors"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
