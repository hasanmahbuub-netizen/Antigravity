"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LogIn, User } from "lucide-react";

export default function LandingNav() {
    const { user, isLoading } = useAuth();

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Meek"
                        width={80}
                        height={32}
                        className="h-8 w-auto"
                        priority
                    />
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {isLoading ? (
                        <div className="w-20 h-9 bg-white/10 rounded-lg animate-pulse" />
                    ) : user ? (
                        <Link href="/dashboard">
                            <motion.button
                                className="flex items-center gap-2 px-5 py-2 bg-[#2D5F5D] text-white rounded-lg font-medium text-sm hover:brightness-110 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <User className="w-4 h-4" />
                                Dashboard
                            </motion.button>
                        </Link>
                    ) : (
                        <>
                            <Link href="#get-started">
                                <motion.button
                                    className="px-5 py-2 text-[#F5F1E8]/80 hover:text-[#F5F1E8] font-medium text-sm transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                            <Link href="#get-started">
                                <motion.button
                                    className="flex items-center gap-2 px-5 py-2 bg-[#1E3A5F] text-white rounded-lg font-medium text-sm transition-all duration-300 hover:bg-[#E8C49A] hover:text-[#0A1628] hover:shadow-[0_0_15px_rgba(232,196,154,0.3)]"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <LogIn className="w-4 h-4" />
                                    Get Started
                                </motion.button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
