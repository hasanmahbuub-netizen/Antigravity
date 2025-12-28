"use client"

import { useState, Suspense } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock } from "lucide-react"

function SignInForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localLoading, setLocalLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signIn, signInWithGoogle } = useAuth()

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

        } catch (err: any) {
            console.error("❌ Exception:", err)
            setError(err.message || "Login failed")
            setLocalLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden relative px-4">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-card/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                            <span className="text-3xl">📿</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to continue your spiritual journey</p>
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
                            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-3 font-semibold transition-all shadow-xl active:scale-[0.98]"
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

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60">
                                <span className="bg-[#0b0b0b] px-4 py-1 rounded-full border border-white/5 backdrop-blur-md">
                                    or email access
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100" />
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-4 w-5 h-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all text-white placeholder:text-muted-foreground/30"
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
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all text-white placeholder:text-muted-foreground/30"
                                            required
                                            disabled={localLoading}
                                            placeholder="Password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={localLoading}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white disabled:opacity-50 flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2"
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

                    <div className="text-center mt-10">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account yet?{" "}
                            <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>
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
