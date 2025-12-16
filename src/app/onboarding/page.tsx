"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Step = "arabic" | "goal" | "time";

const STEPS: Step[] = ["arabic", "goal", "time"];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
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
                        onSelect={handleNext}
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
                        onSelect={handleNext}
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
                        onSelect={handleNext}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function OnboardingStep({ question, options, onSelect }: { question: string, options: string[], onSelect: () => void }) {
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

            <div className="flex flex-col gap-4 px-2">
                {options.map((opt) => (
                    <motion.button
                        key={opt}
                        whileTap={{ scale: 0.96 }}
                        onClick={onSelect}
                        className="bg-card p-6 rounded-[24px] text-left text-foreground text-lg font-medium shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none border border-transparent hover:border-border transition-colors font-sans"
                    >
                        {opt}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
