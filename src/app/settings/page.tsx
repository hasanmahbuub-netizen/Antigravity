"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function SettingsPage() {
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);

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
            <div className="flex items-center p-6 border-b border-border bg-card">
                <Link href="/dashboard" className="p-2 -ml-2 text-muted hover:text-foreground">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-medium text-foreground ml-2 font-sans">Settings</h1>
            </div>

            <div className="p-5 space-y-8">
                <Section title="Preferences">
                    <SettingItem label="Language" value="English" />
                    <SettingItem label="Arabic Level" value="Intermediate" />
                    <SettingItem label="Daily Goal" value="5 minutes" />
                </Section>

                <Section title="Data">
                    <button onClick={() => router.push('/onboarding')} className="w-full flex items-center justify-between py-4 border-b border-border text-left">
                        <span className="text-foreground font-medium font-sans">Reset Progress</span>
                        <ChevronRight className="w-4 h-4 text-muted" />
                    </button>
                </Section>

                <Section title="Account">
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center justify-between py-4 border-b border-border text-left text-red-500 hover:text-red-600 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium font-sans">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
                        </div>
                    </button>
                </Section>

                <Section title="App">
                    <SettingItem label="About IMANOS" value="v1.0.0" />
                </Section>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-2 font-sans">{title}</h2>
            <div className="bg-card rounded-[16px] border border-border overflow-hidden px-4 shadow-sm dark:shadow-none">
                {children}
            </div>
        </div>
    );
}

function SettingItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
            <span className="text-foreground font-medium font-sans">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-muted font-sans">{value}</span>
                <ChevronRight className="w-4 h-4 text-muted/50" />
            </div>
        </div>
    );
}
