"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock } from "lucide-react"

export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localLoading, setLocalLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { signIn } = useAuth()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLocalLoading(true)
        setError("")

        try {
            console.log("🔐 Attempting login via AuthContext...")
            await signIn(email, password)

            console.log("✅ Login successful! Redirecting...")
            // Use router.push for client-side navigation (preserves auth state)
            router.push("/dashboard")

        } catch (err: any) {
            console.error("❌ Exception:", err)
            setError(err.message || "Login failed")
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
                    <h1 className="text-3xl font-bold text-center gradient-text mb-2">Welcome Back</h1>
                    <p className="text-center text-muted mb-8">Sign in to continue</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
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
                                    disabled={localLoading}
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
                                    disabled={localLoading}
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
                        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
