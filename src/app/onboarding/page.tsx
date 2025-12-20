"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Info } from "lucide-react";

type Step = "arabic" | "goal" | "madhab" | "time";

const STEPS: Step[] = ["arabic", "goal", "madhab", "time"];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [preferences, setPreferences] = useState({
        arabic_level: "",
        primary_goal: "",
        madhab: "",
        daily_goal_minutes: 0
    });

    const handleNext = (selection: string, key: keyof typeof preferences) => {
        const updated = { ...preferences, [key]: selection };
        setPreferences(updated);

        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            saveAndRedirect(updated);
        }
    };

    const saveAndRedirect = async (data: typeof preferences) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error('No user found during onboarding');
                router.push('/login');
                return;
            }

            console.log('Saving onboarding data for user:', user.id);

            const { error } = await (supabase.from('profiles') as any)
                .update({
                    full_name: user.user_metadata?.full_name || 'User',
                    arabic_level: data.arabic_level,
                    primary_goal: data.primary_goal,
                    madhab: data.madhab.toLowerCase(),
                    daily_goal_minutes: parseInt(data.daily_goal_minutes.toString().split(' ')[0]) || 10
                })
                .eq('id', user.id);

            if (error) {
                console.error('Error saving onboarding data:', error);
            } else {
                console.log('Onboarding data saved successfully');
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            console.error('Unexpected error during onboarding:', err);
            router.push("/dashboard");
        }
    };

    const step = STEPS[currentStepIndex];

    return (
        <div className="min-h-screen flex flex-col justify-center py-10 bg-background">
            <AnimatePresence mode="wait">
                {step === "arabic" && (
                    <OnboardingStep
                        key="arabic"
                        question="Can you read Arabic letters?"
                        options={[
                            "I cannot read Arabic",
                            "I can read slowly",
                            "I can read comfortably",
                        ]}
                        onSelect={(opt) => handleNext(opt, "arabic_level")}
                    />
                )}
                {step === "goal" && (
                    <OnboardingStep
                        key="goal"
                        question="What do you want help with right now?"
                        options={[
                            "Learning to read Quran",
                            "Improving recitation",
                            "Understanding daily practice",
                        ]}
                        onSelect={(opt) => handleNext(opt, "primary_goal")}
                    />
                )}
                {step === "madhab" && (
                    <OnboardingStep
                        key="madhab"
                        question="Which School of Thought (Madhab) do you follow?"
                        options={[
                            "Hanafi",
                            "Shafi'i",
                            "Maliki",
                            "Hanbali",
                            "I don't know (Auto-select)"
                        ]}
                        onSelect={(opt) => {
                            if (opt.includes("Auto-select")) {
                                handleNext("Hanafi", "madhab");
                            } else {
                                handleNext(opt, "madhab");
                            }
                        }}
                    />
                )}
                {step === "time" && (
                    <OnboardingStep
                        key="time"
                        question="How much time feels realistic daily?"
                        options={[
                            "3 minutes",
                            "5 minutes",
                            "10 minutes",
                        ]}
                        onSelect={(opt) => handleNext(opt, "daily_goal_minutes")}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function OnboardingStep({ question, options, onSelect }: { question: string, options: string[], onSelect: (opt: string) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-8"
        >
            <h1 className="text-2xl font-medium text-foreground text-center px-4 font-sans max-w-[320px] mx-auto leading-relaxed">
                {question}
            </h1>

            <div className="flex flex-col gap-4 px-4 max-w-sm mx-auto w-full">
                {options.map((opt) => (
                    <motion.button
                        key={opt}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onSelect(opt)}
                        className={cn(
                            "bg-card p-6 rounded-[24px] text-left text-foreground text-lg font-medium shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none border border-transparent hover:border-border transition-colors font-sans w-full",
                            opt.includes("Auto-select") && "bg-primary/5 border-primary/20 text-primary"
                        )}
                    >
                        {opt}
                        {opt.includes("Auto-select") && (
                            <span className="block text-xs font-normal opacity-70 mt-1">We'll set it to Hanafi (most common) for now.</span>
                        )}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
