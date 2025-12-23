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
            {/* 1. The Moment (Hero) - Immersive Opening */}
            <HeroSection />

            {/* 2. The Realization (Problem) - Editorial Scroll */}
            <ProblemSection />

            {/* 3. The Experience (Demo) - Interactive Phone Mockup */}
            <DemoSection />

            {/* 4. The Voices (Testimonials) - Pull Quotes */}
            <TransformationSection />

            {/* 5. The Invitation (CTA) - Mission + Soft CTA */}
            <VisionSection />

            {/* 6. Footer - Minimal */}
            <CTASection />
        </main>
    );
}
