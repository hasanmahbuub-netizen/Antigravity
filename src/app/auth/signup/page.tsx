"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, User } from "lucide-react"

export default function SignUpPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localLoading, setLocalLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const { signUp } = useAuth()

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setLocalLoading(true)
        setError("")

        try {
            console.log("📝 Attempting signup via AuthContext...")
            await signUp(email, password, name)

            setSuccess(true)

        } catch (err: unknown) {
            console.error("❌ Exception:", err)
            const rawError = err instanceof Error ? err.message : "Signup failed";
            // Humanize common errors
            let errorMessage = rawError;
            if (rawError.includes("Network") || rawError.includes("fetch")) {
                errorMessage = "We couldn't reach the server. Please check your internet connection.";
            } else if (rawError.includes("already registered")) {
                errorMessage = "This email is already in use. Please sign in instead.";
            }

            setError(errorMessage)
            setLocalLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-panel p-8 rounded-2xl text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
                        <p className="text-muted mb-6">
                            We've sent a confirmation link to <span className="text-primary font-medium">{email}</span>
                        </p>
                        <Link
                            href="/auth/signin"
                            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 font-medium"
                        >
                            Go to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
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
                            <span className="text-2xl">✨</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-sm text-muted">Join the MEEK community today</p>
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
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100" />
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                            required
                                            disabled={localLoading}
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100" />
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-4 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
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
                            </div>

                            <div className="space-y-2">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100" />
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-4 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                            required
                                            disabled={localLoading}
                                            minLength={6}
                                            placeholder="Create Password (min 6 chars)"
                                        />
                                    </div>
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
                                        Creating your account...
                                    </>
                                ) : (
                                    "Create Account with Email"
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-sm text-muted mt-6">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div >
        </div >
    )
}
