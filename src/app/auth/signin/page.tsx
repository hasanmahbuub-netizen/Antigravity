"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase"

function SignInForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localLoading, setLocalLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signIn, user, isLoading } = useAuth()

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
                                        disabled={localLoading}
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
                                        disabled={localLoading}
                                        placeholder="Password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={localLoading}
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
                    </div>

                    <p className="text-center text-sm text-muted mt-6">
                        Don't have an account?{" "}
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
