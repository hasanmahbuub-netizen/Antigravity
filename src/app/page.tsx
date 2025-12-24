"use client";

import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import TransformationSection from "@/components/landing/TransformationSection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-[#0A0A0A]">
            {/* Fixed Navigation */}
            <LandingNav />

            {/* 1. Hero - Immersive Opening with Bismillah */}
            <HeroSection />

            {/* 2. How It Works - Interactive 4-Step Product Demo */}
            <HowItWorksSection />

            {/* 3. Features - Gradient Cards with Key Capabilities */}
            <FeaturesShowcase />

            {/* 4. Testimonials - Social Proof with Auto-Scroll */}
            <TransformationSection />

            {/* 5. Final CTA - Strong Call to Action */}
            <CTASection />
        </main>
    );
}
