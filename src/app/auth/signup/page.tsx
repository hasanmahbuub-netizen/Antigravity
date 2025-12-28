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
    const { signUp, signInWithGoogle } = useAuth()

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setLocalLoading(true)
        setError("")

        try {
            console.log("📝 Attempting signup via AuthContext...")
            await signUp(email, password, name)

            setSuccess(true)

        } catch (err: any) {
            console.error("❌ Exception:", err)
            setError(err.message || "Signup failed")
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
                        <button
                            onClick={async () => {
                                try {
                                    setLocalLoading(true)
                                    await signInWithGoogle()
                                } catch (err: any) {
                                    setError(err.message || "Google sign-in failed")
                                    setLocalLoading(false)
                                }
                            }}
                            disabled={localLoading}
                            className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative py-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs text-muted">
                                <span className="bg-background px-3">
                                    or
                                </span>
                            </div>
                        </div>

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
