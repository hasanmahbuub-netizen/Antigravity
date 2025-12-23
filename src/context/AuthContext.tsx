"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

// ============================================
// SUPER SIMPLE AUTH CONTEXT - NO COMPLEXITY
// ============================================

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Development-only logging
const isDev = process.env.NODE_ENV === 'development'
const devLog = (...args: any[]) => isDev && console.log(...args)
const devError = (...args: any[]) => isDev && console.error(...args)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    devLog('🏗️ [AUTH CONTEXT] Component mounting...')

    // ============================================
    // INITIALIZATION - RUNS ONCE ON MOUNT
    // ============================================
    useEffect(() => {
        console.log('🔐 [INIT STEP 1] useEffect triggered')

        let mounted = true

        async function initialize() {
            console.log('🔐 [INIT STEP 2] Starting initialization')

            try {
                console.log('🔐 [INIT STEP 3] Calling getSession')
                const { data: { session }, error } = await supabase.auth.getSession()
                console.log('🔐 [INIT STEP 4] getSession returned')

                if (!mounted) {
                    console.log('🔐 [INIT] Component unmounted, skipping')
                    return
                }

                if (error) {
                    console.error('❌ [INIT] Error:', error.message)
                    setUser(null)
                } else if (session?.user) {
                    console.log('✅ [INIT] Found session:', session.user.email)
                    setUser(session.user)
                } else {
                    console.log('ℹ️ [INIT] No session found')
                    setUser(null)
                }
            } catch (err) {
                console.error('💥 [INIT] Unexpected error:', err)
                setUser(null)
            } finally {
                if (mounted) {
                    console.log('🔐 [INIT STEP 5] Setting loading = false')
                    setLoading(false)
                    console.log('🏁 [INIT] Complete')
                }
            }
        }

        initialize()

        // Setup auth listener AFTER init
        console.log('🔐 [INIT] Setting up auth listener')
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 [AUTH EVENT]', event)
            if (event === 'SIGNED_IN') {
                console.log('✅ [AUTH EVENT] User signed in:', session?.user?.email)
                setUser(session?.user || null)
            } else if (event === 'SIGNED_OUT') {
                console.log('👋 [AUTH EVENT] User signed out')
                setUser(null)
            }
        })

        return () => {
            console.log('🧹 [CLEANUP] Unmounting auth context')
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    // ============================================
    // SIGN IN - SIMPLE AND DIRECT
    // ============================================
    async function signIn(email: string, password: string) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('🔑 [SIGNIN] Starting...')
        console.log('📧 [SIGNIN] Email:', email)

        try {
            console.log('📡 [SIGNIN] Calling signInWithPassword...')
            const startTime = Date.now()

            const result = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            })

            const duration = Date.now() - startTime
            console.log(`⏱️ [SIGNIN] API call took ${duration}ms`)
            console.log('📦 [SIGNIN] Result:', {
                hasUser: !!result.data?.user,
                hasSession: !!result.data?.session,
                hasError: !!result.error
            })

            if (result.error) {
                console.error('❌ [SIGNIN] Auth error:', result.error.message)
                throw new Error(result.error.message)
            }

            if (!result.data.session) {
                console.error('❌ [SIGNIN] No session in response')
                throw new Error('No session created')
            }

            console.log('✅ [SIGNIN] Success!')
            console.log('👤 [SIGNIN] User:', result.data.user.email)

            // Set user immediately (listener will also fire, but that's OK)
            setUser(result.data.user)
            console.log('🎯 [SIGNIN] User state updated')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        } catch (error: any) {
            console.error('💥 [SIGNIN] Error caught:', error.message)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
            throw error
        }
    }

    // ============================================
    // SIGN UP - SIMPLE AND DIRECT
    // ============================================
    async function signUp(email: string, password: string, fullName: string) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📝 [SIGNUP] Starting...')
        console.log('📧 [SIGNUP] Email:', email)
        console.log('👤 [SIGNUP] Name:', fullName)

        try {
            console.log('📡 [SIGNUP] Calling signUp...')

            const result = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })

            console.log('📦 [SIGNUP] Result:', {
                hasUser: !!result.data?.user,
                hasSession: !!result.data?.session,
                hasError: !!result.error
            })

            if (result.error) {
                console.error('❌ [SIGNUP] Error:', result.error.message)
                throw new Error(result.error.message)
            }

            console.log('✅ [SIGNUP] Success!')
            console.log('📧 [SIGNUP] Confirmation email sent to:', email)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        } catch (error: any) {
            console.error('💥 [SIGNUP] Error caught:', error.message)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
            throw error
        }
    }

    // ============================================
    // SIGN OUT - SIMPLE AND DIRECT
    // ============================================
    async function signOut() {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('👋 [SIGNOUT] Starting...')

        try {
            console.log('📡 [SIGNOUT] Calling signOut...')
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('❌ [SIGNOUT] Error:', error.message)
                throw error
            }

            console.log('✅ [SIGNOUT] Success')
            setUser(null)
            console.log('🎯 [SIGNOUT] User state cleared')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        } catch (error: any) {
            console.error('💥 [SIGNOUT] Error caught:', error.message)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
            throw error
        }
    }

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut
    }

    console.log('🎨 [RENDER] AuthProvider rendering, user:', user?.email || 'null', 'loading:', loading)

    return (
        <AuthContext.Provider value={value}>
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

