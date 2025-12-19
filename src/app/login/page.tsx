"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.log('🚀 Login attempt started...');
            console.log('📧 Email:', email);
            console.log('📡 Calling supabase.auth.signInWithPassword...');

            const start = Date.now();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.log(`⏱️ API Call took ${Date.now() - start}ms`);
            console.log('📥 Auth result received:', { hasData: !!data, hasError: !!error });

            if (error) {
                console.error('Login error:', error);
                setError(error.message);
                setLoading(false);
                return;
            }

            if (data?.session) {
                console.log('Login successful! Redirecting to dashboard...');
                router.push("/dashboard");
                router.refresh();
                // Keep loading true during redirect
            } else {
                console.error('No session in response');
                setError('Login failed - no session created');
                setLoading(false);
            }
        } catch (err: any) {
            console.error('Unexpected login error:', err);
            // Ignore browser extension errors
            if (err?.message?.includes('Receiving end does not exist')) {
                console.warn('Browser extension interference detected, retrying...');
                // Retry login
                setTimeout(() => handleLogin(e), 1000);
                return;
            }
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm mx-auto space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
                    <p className="text-muted text-sm">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-bold tracking-widest text-muted uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-xs font-bold tracking-widest text-muted uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-muted">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-bold hover:underline">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
