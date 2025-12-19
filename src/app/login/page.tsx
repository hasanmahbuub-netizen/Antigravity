"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            if (data?.session) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setError('Login failed - no session created');
                setLoading(false);
            }
        } catch (err: any) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
                        <p className="text-muted mt-2">Sign in to continue your journey</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {error}
                        </div>
                    )}

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
                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
