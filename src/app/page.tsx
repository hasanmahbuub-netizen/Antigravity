"use client";

import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import DemoSection from "@/components/landing/DemoSection";
import TransformationSection from "@/components/landing/TransformationSection";
import VisionSection from "@/components/landing/VisionSection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
    return (
        <main className="min-h-screen w-full overflow-x-hidden">
            {/* 1. The Moment (Hero) */}
            <HeroSection />

            {/* 2. The Problem */}
            <ProblemSection />

            {/* 3. The Experience (Demo) */}
            <DemoSection />

            {/* 4. The Transformation (Stories) */}
            <TransformationSection />

            {/* 5. The Vision */}
            <VisionSection />

            {/* 6. The Call */}
            <CTASection />
        </main>
    );
}

