"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // ============================================
    // INITIALIZATION — runs once on mount
    // ============================================
    useEffect(() => {
        let mounted = true

        async function initialize() {
            try {
                // Try to get existing session
                const { data: { session }, error } = await supabase.auth.getSession()

                if (!mounted) return

                if (error) {
                    console.error('❌ [AUTH] Init error:', error.message)
                    setUser(null)
                } else if (session?.user) {
                    console.log('✅ [AUTH] Session found:', session.user.email)
                    setUser(session.user)
                } else {
                    console.log('ℹ️ [AUTH] No session')
                    setUser(null)
                }
            } catch (err) {
                console.error('💥 [AUTH] Init failed:', err)
                setUser(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        initialize()

        // Auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 [AUTH]', event, session?.user?.email || 'none')

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setUser(session?.user || null)

                // Initialize push notifications (non-blocking)
                if (event === 'SIGNED_IN') {
                    import('@/lib/push-notifications').then(({ initializePushNotifications }) => {
                        initializePushNotifications().catch(() => { })
                    }).catch(() => { })
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
            }
        })

        // Session recovery on app resume (important for mobile WebView)
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session?.user) {
                        setUser(session.user)
                        // Also try to refresh if close to expiry
                        const expiresAt = session.expires_at || 0
                        const now = Math.floor(Date.now() / 1000)
                        if (expiresAt - now < 300) {
                            // Less than 5 min to expiry, refresh
                            await supabase.auth.refreshSession()
                        }
                    }
                } catch {
                    // Silent — don't disrupt user
                }
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            mounted = false
            subscription.unsubscribe()
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    // ============================================
    // SIGN IN — email/password
    // ============================================
    async function signIn(email: string, password: string) {
        const result = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password
        })

        if (result.error) {
            throw new Error(result.error.message)
        }

        if (!result.data.session) {
            throw new Error('No session created')
        }

        setUser(result.data.user)
    }

    // ============================================
    // SIGN UP — email/password
    // ============================================
    async function signUp(email: string, password: string, fullName: string) {
        const result = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
                data: { full_name: fullName }
            }
        })

        if (result.error) {
            throw new Error(result.error.message)
        }
    }

    // ============================================
    // GOOGLE SIGN IN — handles both web and mobile
    // ============================================
    async function signInWithGoogle() {
        try {
            const { isMobileApp } = await import('@/lib/isMobile')
            const isMobile = isMobileApp()

            if (!isMobile) {
                // Web: standard OAuth flow — redirects in same browser
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent',
                        },
                    },
                })
                if (error) throw error
                return
            }

            // Mobile: Chrome Custom Tab flow
            // 1. Get OAuth URL without redirecting the WebView
            console.log('📱 [AUTH] Starting mobile Google Sign-In...')
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://meek-zeta.vercel.app'}/auth/callback/mobile`,
                    skipBrowserRedirect: true,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })

            if (error) throw error
            if (!data?.url) throw new Error('No OAuth URL returned')

            // 2. Open in Chrome Custom Tab
            const { Browser } = await import('@capacitor/browser')

            // Listen for browser closed event (fallback if deep link fails)
            Browser.addListener('browserFinished', async () => {
                console.log('📱 [AUTH] Chrome Custom Tab closed, checking session...')
                // Give a moment for deep link handler to process
                await new Promise(r => setTimeout(r, 1000))
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    console.log('✅ [AUTH] Session found after browser close')
                    setUser(session.user)
                }
            })

            await Browser.open({
                url: data.url,
                presentationStyle: 'popover'
            })

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error('❌ [AUTH] Google Sign-In error:', errorMessage)
            throw error
        }
    }

    // ============================================
    // SIGN OUT
    // ============================================
    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
