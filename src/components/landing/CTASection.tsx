"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
    return (
        <>
            {/* Big CTA Section */}
            <section className="relative w-full bg-gradient-to-b from-[#1A1A1A] to-[#0A1628] py-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2D5F5D]/20 rounded-full blur-[200px]" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E8C49A]/10 rounded-full blur-[150px]" />
                </div>

                {/* Content */}
                <motion.div
                    className="relative z-10 max-w-3xl mx-auto text-center px-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8C49A]/10 border border-[#E8C49A]/20 mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-4 h-4 text-[#E8C49A]" />
                        <span className="text-sm text-[#E8C49A]">Free to use • No credit card required</span>
                    </motion.div>

                    {/* Headline */}
                    <h2 className="font-serif text-[42px] md:text-[64px] text-white leading-tight mb-6">
                        Start your journey<br />
                        <span className="text-[#E8C49A] italic">today</span>
                    </h2>

                    {/* Subtext */}
                    <p className="text-white/60 text-lg md:text-xl mb-10 max-w-xl mx-auto">
                        Join thousands of Muslims transforming their relationship with the Quran.
                        Begin with Al-Fatiha — it takes just 5 minutes.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/signin?redirect=/quran">
                            <motion.button
                                className="group flex items-center gap-3 bg-[#E8C49A] text-[#0A1628] font-semibold text-lg px-10 py-5 rounded-full hover:bg-[#d4b088] transition-all shadow-lg shadow-[#E8C49A]/20"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start with Al-Fatiha
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>

                        <Link href="/quran">
                            <motion.button
                                className="flex items-center gap-2 text-white/70 hover:text-white font-medium px-6 py-4 rounded-full border border-white/10 hover:border-white/30 transition-all"
                                whileHover={{ scale: 1.02 }}
                            >
                                Browse all Surahs
                            </motion.button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-8 mt-12 text-white/40 text-sm">
                        <span>✓ No account needed</span>
                        <span>✓ Works offline</span>
                        <span>✓ 100% free</span>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative w-full bg-[#0A1628] border-t border-white/5 py-12">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-semibold text-white mb-3">Meek</h3>
                            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                                Making Quranic pronunciation accessible to every Muslim around the world.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-white/30 mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li><Link href="/quran" className="text-sm text-white/50 hover:text-white transition-colors">All Surahs</Link></li>
                                <li><Link href="/fiqh" className="text-sm text-white/50 hover:text-white transition-colors">Fiqh Q&A</Link></li>
                                <li><Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-white/30 mb-4">Connect</h4>
                            <ul className="space-y-3">
                                <li><a href="mailto:hello@meek.app" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="https://twitter.com" target="_blank" rel="noopener" className="text-sm text-white/50 hover:text-white transition-colors">Twitter</a></li>
                                <li><a href="https://instagram.com" target="_blank" rel="noopener" className="text-sm text-white/50 hover:text-white transition-colors">Instagram</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/30">
                            © {new Date().getFullYear()} Meek. Made with ❤️ for the Ummah.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
