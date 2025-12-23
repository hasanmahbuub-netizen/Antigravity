"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogIn, User } from "lucide-react";

export default function LandingNav() {
    const { user, loading } = useAuth();

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
                    <span className="text-xl font-semibold text-[#F5F1E8]">
                        Meek
                    </span>
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {loading ? (
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
                            <Link href="/auth/signin">
                                <motion.button
                                    className="px-5 py-2 text-[#F5F1E8]/80 hover:text-[#F5F1E8] font-medium text-sm transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                            <Link href="/auth/signup">
                                <motion.button
                                    className="flex items-center gap-2 px-5 py-2 bg-[#2D5F5D] text-white rounded-lg font-medium text-sm hover:brightness-110 transition-all"
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
