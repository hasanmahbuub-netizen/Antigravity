"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        console.log("🚀 [LOGIN] Starting login attempt")
        console.log("📧 [LOGIN] Email:", email)

        setLoading(true)
        setError("")

        try {
            console.log("📡 [LOGIN] Calling Supabase signInWithPassword...")
            const startTime = Date.now()

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            const duration = Date.now() - startTime
            console.log(`⏱️ [LOGIN] API call took ${duration}ms`)
            console.log("📥 [LOGIN] Response received:", {
                hasSession: !!data?.session,
                hasError: !!signInError,
                errorMessage: signInError?.message
            })

            if (signInError) {
                console.error("❌ [LOGIN] Error:", signInError.message)
                setError(signInError.message)
                setLoading(false)
                return
            }

            if (data?.session) {
                console.log("✅ [LOGIN] Success! Redirecting to dashboard...")
                console.log("👤 [LOGIN] User ID:", data.session.user.id)

                // Force hard redirect to avoid any routing issues
                window.location.href = "/dashboard"
            } else {
                console.error("⚠️ [LOGIN] No session returned despite no error")
                setError("Login failed - no session created")
                setLoading(false)
            }
        } catch (err) {
            console.error("💥 [LOGIN] Unexpected error:", err)
            setError("An unexpected error occurred. Please try again.")
            setLoading(false)
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
                    <h1 className="text-3xl font-bold text-center gradient-text mb-2">Welcome Back</h1>
                    <p className="text-center text-muted mb-8">Sign in to continue</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold tracking-widest text-muted uppercase mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold tracking-widest text-muted uppercase mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-opacity"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted mt-6">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
