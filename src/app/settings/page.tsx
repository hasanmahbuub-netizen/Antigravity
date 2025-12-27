"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, LogOut, Check, BookOpen, Globe, Target, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MADHABS = [
    { id: 'Hanafi', name: 'Hanafi', description: 'Most followed in South Asia, Turkey' },
    { id: 'Shafi\'i', name: "Shafi'i", description: 'Common in SE Asia, East Africa' },
    { id: 'Maliki', name: 'Maliki', description: 'Predominant in North & West Africa' },
    { id: 'Hanbali', name: 'Hanbali', description: 'Followed in Saudi Arabia' }
];

const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'bn', name: 'Bangla', native: 'বাংলা' }
];

const ARABIC_LEVELS = [
    { value: 'beginner', label: 'Beginner', desc: 'Learning to read Arabic' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Can read with some fluency' },
    { value: 'advanced', label: 'Advanced', desc: 'Fluent in Quranic Arabic' }
];

export default function SettingsPage() {
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    // Settings state
    const [madhab, setMadhab] = useState('Hanafi');
    const [language, setLanguage] = useState('en');
    const [arabicLevel, setArabicLevel] = useState('intermediate');
    const [dailyGoal, setDailyGoal] = useState(5);

    // Load profile settings
    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await (supabase
                .from('profiles')
                .select('madhab, language, arabic_level, daily_goal')
                .eq('id', user.id)
                .single() as any);

            if (data) {
                setMadhab(data.madhab || 'Hanafi');
                setLanguage(data.language || 'en');
                setArabicLevel(data.arabic_level || 'intermediate');
                setDailyGoal(data.daily_goal || 5);
            }
        }
        loadProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await (supabase.from('profiles') as any).upsert({
                id: user.id,
                madhab,
                language,
                arabic_level: arabicLevel,
                daily_goal: dailyGoal,
                updated_at: new Date().toISOString()
            });

            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        setSigningOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/auth/signin');
        } catch (error) {
            console.error('Sign out failed:', error);
            setSigningOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                <div className="flex items-center">
                    <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-medium text-foreground ml-2 font-sans">Settings</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm disabled:opacity-50"
                >
                    {saving ? 'Saving...' : showSaved ? '✓ Saved!' : 'Save'}
                </button>
            </div>

            <div className="p-5 space-y-8 pb-24">
                {/* Madhab Selection */}
                <Section title="Islamic School (Madhab)" icon={<BookOpen className="w-4 h-4" />}>
                    <div className="grid grid-cols-2 gap-3 p-4">
                        {MADHABS.map((m) => (
                            <motion.button
                                key={m.id}
                                whileTap={{ scale: 0.98 }}
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
                            </motion.button>
                        ))}
                    </div>
                </Section>

                {/* Language Selection */}
                <Section title="Language" icon={<Globe className="w-4 h-4" />}>
                    <div className="grid grid-cols-2 gap-3 p-4">
                        {LANGUAGES.map((lang) => (
                            <motion.button
                                key={lang.code}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setLanguage(lang.code)}
                                className={`p-4 rounded-xl text-center transition-all ${language === lang.code
                                    ? 'bg-accent text-accent-foreground ring-2 ring-accent'
                                    : 'bg-muted/10 text-foreground hover:bg-muted/20'
                                    }`}
                            >
                                <div className="font-semibold">{lang.native}</div>
                                <div className="text-xs opacity-70">{lang.name}</div>
                            </motion.button>
                        ))}
                    </div>
                </Section>

                {/* Arabic Level */}
                <Section title="Arabic Level" icon={<Target className="w-4 h-4" />}>
                    <div className="space-y-2 p-4">
                        {ARABIC_LEVELS.map((level) => (
                            <motion.button
                                key={level.value}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setArabicLevel(level.value)}
                                className={`w-full p-4 rounded-xl text-left transition-all ${arabicLevel === level.value
                                    ? 'bg-primary/10 border-2 border-primary text-foreground'
                                    : 'bg-muted/10 text-foreground hover:bg-muted/20 border-2 border-transparent'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{level.label}</div>
                                        <div className="text-xs opacity-70">{level.desc}</div>
                                    </div>
                                    {arabicLevel === level.value && <Check className="w-5 h-5 text-primary" />}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </Section>

                {/* Daily Goal */}
                <Section title="Daily Goal">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-foreground font-medium">Practice Time</span>
                            <span className="text-primary font-bold">{dailyGoal} minutes</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="60"
                            step="5"
                            value={dailyGoal}
                            onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                            className="w-full mt-4 accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted mt-1">
                            <span>5 min</span>
                            <span>60 min</span>
                        </div>
                    </div>
                </Section>

                {/* Notifications */}
                <Section title="Notifications" icon={<Bell className="w-4 h-4" />}>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold">Prayer Reminders</div>
                                <div className="text-xs opacity-70">Get notified at prayer times & 30min warnings</div>
                            </div>
                            <button
                                onClick={async () => {
                                    if ('Notification' in window) {
                                        const permission = await Notification.requestPermission();
                                        if (permission === 'granted') {
                                            alert("Prayer notifications enabled! ✅");
                                        } else {
                                            alert("Please enable notifications in your browser settings.");
                                        }
                                    } else {
                                        alert("Your browser doesn't support notifications.");
                                    }
                                }}
                                className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                            >
                                Enable
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold">Daily Duas</div>
                                <div className="text-xs opacity-70">Morning, afternoon & evening spiritual reminders</div>
                            </div>
                            <button
                                onClick={async () => {
                                    if ('Notification' in window && Notification.permission === 'granted') {
                                        new Notification("Dua Notifications Enabled! 🌙", { body: "You'll receive contextual duas throughout the day." });
                                    } else {
                                        alert("Enable Prayer Reminders first to get dua notifications.");
                                    }
                                }}
                                className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                            >
                                Enable
                            </button>
                        </div>
                    </div>
                </Section>

                {/* Account Section */}
                <Section title="Account">
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="w-full flex items-center justify-between p-4 border-b border-border text-left hover:bg-muted/5"
                    >
                        <span className="text-foreground font-medium font-sans">Redo Onboarding</span>
                        <ChevronRight className="w-4 h-4 text-muted" />
                    </button>
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center justify-between p-4 text-left text-red-500 hover:bg-red-500/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium font-sans">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
                        </div>
                    </button>
                </Section>

                {/* App Info */}
                <Section title="App">
                    <div className="flex items-center justify-between p-4">
                        <span className="text-foreground font-medium font-sans">About MEEK</span>
                        <span className="text-muted font-sans">v1.0.0</span>
                    </div>
                </Section>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                {icon && <span className="text-muted">{icon}</span>}
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted font-sans">{title}</h2>
            </div>
            <div className="bg-card rounded-[16px] border border-border overflow-hidden shadow-sm dark:shadow-none">
                {children}
            </div>
        </div>
    );
}

