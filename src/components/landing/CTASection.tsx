"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
    product: [
        { label: "How it works", href: "#demo" },
        { label: "All Surahs", href: "/quran" },
        { label: "Fiqh Questions", href: "/fiqh" },
    ],
    company: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "mailto:hello@meek.app" },
    ],
    social: [
        { label: "Twitter", href: "https://twitter.com" },
        { label: "Instagram", href: "https://instagram.com" },
    ],
};

export default function CTASection() {
    return (
        <footer className="relative w-full bg-white border-t border-[#EAEAEA] py-16 md:py-20">
            <div className="max-w-5xl mx-auto px-6">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">
                            Meek
                        </h3>
                        <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-xs">
                            Making Quranic pronunciation accessible to everyone.
                        </p>
                        <p className="text-[#9B9B9B] text-sm mt-4">
                            Made with care.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#9B9B9B] mb-4">
                            Product
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#6B6B6B] hover:text-[#2D5F5D] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-[#9B9B9B] mb-4">
                            Connect
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#6B6B6B] hover:text-[#2D5F5D] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {footerLinks.social.map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-[#6B6B6B] hover:text-[#2D5F5D] transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-[#EAEAEA] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#9B9B9B]">
                        © {new Date().getFullYear()} Meek. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/privacy"
                            className="text-xs text-[#9B9B9B] hover:text-[#6B6B6B] transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-xs text-[#9B9B9B] hover:text-[#6B6B6B] transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
