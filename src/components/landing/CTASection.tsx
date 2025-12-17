"use client";

import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";

export default function CTASection() {
    return (
        <section className="bg-[#FAFAF5] py-20 px-6 text-center border-t border-[#E4DDD4]">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-english font-bold text-[#0A1628] mb-12">
                    Start your journey today
                </h2>

                {/* Dual Path Cards */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">

                    {/* 1. Learn Quran Path */}
                    <Link href="/onboarding" className="flex-1 group">
                        <div className="bg-white rounded-[24px] p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#008080]/10 rounded-full flex items-center justify-center text-[#008080] mb-6 group-hover:bg-[#008080] group-hover:text-white transition-colors">
                                <BookOpen className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-[#0A1628] mb-2">I want to learn Quran</h3>
                            <button className="mt-auto bg-[#008080] text-white px-8 py-3 rounded-full font-medium hover:bg-[#006666] transition-colors w-full">
                                Start learning
                            </button>
                        </div>
                    </Link>

                    {/* 2. Ask Questions Path */}
                    <Link href="/dashboard" className="flex-1 group">
                        <div className="bg-white rounded-[24px] p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-6 group-hover:bg-[#0A1628] group-hover:text-[#D4AF37] transition-colors">
                                <MessageCircle className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-[#0A1628] mb-2">I have questions</h3>
                            <button className="mt-auto border border-gray-300 text-[#0A1628] px-8 py-3 rounded-full font-medium hover:border-[#0A1628] transition-colors w-full">
                                Ask now
                            </button>
                        </div>
                    </Link>
                </div>

                {/* Trust Factors */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 font-medium mb-20">
                    <span className="flex items-center gap-2">✓ Free for 7 days</span>
                    <span className="flex items-center gap-2">✓ No credit card required</span>
                    <span className="flex items-center gap-2">✓ Works on any device</span>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 pt-10 text-xs text-gray-400">
                    <p className="mb-4">Made with ❤️ in Dhaka</p>
                    <div className="flex justify-center gap-6">
                        <span>Reviewed by scholars</span>
                        <span>•</span>
                        <span>Trusted by 10,000+ Muslims</span>
                        <span>•</span>
                        <span>Privacy Policy</span>
                    </div>
                </footer>
            </div>
        </section>
    );
}
