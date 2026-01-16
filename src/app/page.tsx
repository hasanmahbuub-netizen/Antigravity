"use client";

import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import TransformationSection from "@/components/landing/TransformationSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-[#0A0A0A]">
            {/* Fixed Navigation */}
            <LandingNav />

            {/* 1. Hero - Immersive Opening with Bismillah */}
            <HeroSection />

            {/* 2. Problem - Why existing solutions fail */}
            <ProblemSection />

            {/* 3. How It Works - Interactive 4-Step Product Demo */}
            <HowItWorksSection />

            {/* 4. Features - Gradient Cards with Key Capabilities */}
            <FeaturesShowcase />

            {/* 5. Comparison - Value Prop vs Other Apps */}
            <ComparisonSection />

            {/* 6. Pricing - Free Now, Pro Coming in v2 */}
            <PricingSection />

            {/* 7. FAQ - Common Questions */}
            <FAQSection />

            {/* 8. Testimonials - Social Proof */}
            <TransformationSection />

            {/* 9. Final CTA - Strong Call to Action */}
            <CTASection />

            {/* 10. Footer with Download & Social Links */}
            <LandingFooter />
        </main>
    );
}
