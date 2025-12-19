"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/onboarding`,
                },
            });

            if (error) {
                console.error('Signup error:', error);
                setError(error.message);
                setLoading(false);
                return;
            }

            if (data?.user) {
                // Successfully created user
                console.log('User created:', data.user.id);

                // Redirect to onboarding
                router.push("/onboarding");
                router.refresh();
            } else {
                setError('Failed to create account. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            console.error('Unexpected signup error:', err);
            setError('An unexpected error occurred. Please try again.');
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
                    <h1 className="text-3xl font-bold text-foreground">Join IMANOS</h1>
                    <p className="text-muted text-sm">Start your spiritual companion today</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-muted uppercase ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-muted uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-muted uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                                required
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
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-sm text-muted">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
