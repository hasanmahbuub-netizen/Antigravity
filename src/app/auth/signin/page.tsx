"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Google "G" logo SVG
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

function SignInForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localLoading, setLocalLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signIn, signInWithGoogle, user, isLoading } = useAuth()

    // Pre-warm Supabase connection on mount - reduces login latency
    useEffect(() => {
        supabase.auth.getSession().catch(() => {
            // Silent — prewarm is best-effort
        })
    }, [])

    // Auto-redirect if already logged in
    useEffect(() => {
        if (!isLoading && user) {
            const redirectTo = searchParams.get('redirect') || '/dashboard'
            router.push(redirectTo)
        }
    }, [user, isLoading, router, searchParams])

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLocalLoading(true)
        setError("")

        try {
            console.log("🔐 Attempting login via AuthContext...")
            await signIn(email, password)

            console.log("✅ Login successful! Redirecting...")

            // Use redirect param if provided, otherwise go to dashboard
            const redirectTo = searchParams.get('redirect') || '/dashboard'
            console.log("📍 Redirecting to:", redirectTo)
            router.push(redirectTo)

        } catch (err: unknown) {
            console.error("❌ Exception:", err)
            const rawError = err instanceof Error ? err.message : "Login failed";
            // Humanize common errors
            let errorMessage = rawError;
            if (rawError.includes("Network") || rawError.includes("fetch")) {
                errorMessage = "We couldn't reach the server. Please check your internet connection.";
            } else if (rawError.includes("Invalid login")) {
                errorMessage = "Incorrect email or password. Please try again.";
            }

            setError(errorMessage)
            setLocalLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-panel p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📿</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-sm text-muted">Continue your spiritual journey</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm overflow-hidden flex items-center gap-3"
                        >
                            <span className="shrink-0 text-lg">⚠️</span>
                            {error}
                        </motion.div>
                    )}



                    <div className="space-y-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        required
                                        disabled={localLoading || googleLoading}
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        required
                                        disabled={localLoading || googleLoading}
                                        placeholder="Password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={localLoading || googleLoading}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                            >
                                {localLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing into account...
                                    </>
                                ) : (
                                    "Sign In with Email"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted">or continue with</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Google Sign-In */}
                        <button
                            type="button"
                            onClick={async () => {
                                setGoogleLoading(true);
                                setError("");
                                try {
                                    await signInWithGoogle();
                                } catch (err: unknown) {
                                    setError(err instanceof Error ? err.message : "Google Sign-In failed");
                                    setGoogleLoading(false);
                                }
                            }}
                            disabled={localLoading || googleLoading}
                            className="w-full h-12 rounded-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3 font-medium transition-colors"
                        >
                            {googleLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Redirecting to Google...
                                </>
                            ) : (
                                <>
                                    <GoogleIcon />
                                    Continue with Google
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <SignInForm />
        </Suspense>
    )
}
