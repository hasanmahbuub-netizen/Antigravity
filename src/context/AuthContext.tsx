"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    loading: boolean
    error: string | null
    signUp: (email: string, password: string, name: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // INITIALIZATION: Check if user is already logged in (RUNS ONCE)
    useEffect(() => {
        console.log('🔐 [AUTH] Initializing auth context...')

        async function checkSession() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('❌ [AUTH] Error checking session:', error.message)
                    setUser(null)
                } else if (session) {
                    console.log('✅ [AUTH] Found existing session for user:', session.user.email)
                    setUser(session.user)
                } else {
                    console.log('ℹ️ [AUTH] No existing session found')
                    setUser(null)
                }
            } catch (err) {
                console.error('💥 [AUTH] Unexpected error during initialization:', err)
                setUser(null)
            } finally {
                setLoading(false)
                console.log('🏁 [AUTH] Initialization complete')
            }
        }

        checkSession()

        // Listen for auth changes (login/logout events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 [AUTH] Auth state changed:', event)

            if (event === 'SIGNED_IN' && session) {
                console.log('👤 [AUTH] User signed in:', session.user.email)
                setUser(session.user)
            } else if (event === 'SIGNED_OUT') {
                console.log('👋 [AUTH] User signed out')
                setUser(null)
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('🔄 [AUTH] Token refreshed')
                setUser(session?.user || null)
            }
        })

        // Cleanup
        return () => {
            console.log('🧹 [AUTH] Cleaning up auth listener')
            subscription.unsubscribe()
        }
    }, []) // RUNS ONCE on mount

    // SIGN UP FUNCTION
    async function signUp(email: string, password: string, name: string) {
        console.log('📝 [SIGNUP] Starting signup for:', email)
        setError(null)
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            })

            if (error) {
                console.error('❌ [SIGNUP] Signup failed:', error.message)
                setError(error.message)
                throw error
            }

            console.log('✅ [SIGNUP] Signup successful! Check your email.')
            console.log('✉️ [SIGNUP] Confirmation email sent to:', email)

        } catch (err: any) {
            console.error('💥 [SIGNUP] Unexpected error:', err)
            setError(err.message || 'Signup failed')
            throw err
        } finally {
            setLoading(false)
        }
    }

    // SIGN IN FUNCTION (THE CRITICAL ONE)
    async function signIn(email: string, password: string) {
        console.log('🔑 [SIGNIN] Starting sign in for:', email)
        setError(null)
        setLoading(true)

        try {
            console.log('📡 [SIGNIN] Calling Supabase signInWithPassword...')
            const startTime = Date.now()

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            const duration = Date.now() - startTime
            console.log(`⏱️ [SIGNIN] API call completed in ${duration}ms`)

            if (error) {
                console.error('❌ [SIGNIN] Sign in failed:', error.message)
                setError(error.message)
                setUser(null)
                setLoading(false)
                throw error
            }

            if (!data.session) {
                console.error('⚠️ [SIGNIN] No session returned')
                setError('Login failed - no session created')
                setUser(null)
                setLoading(false)
                throw new Error('No session created')
            }

            console.log('✅ [SIGNIN] Sign in successful!')
            console.log('👤 [SIGNIN] User:', data.session.user.email)
            console.log('🎫 [SIGNIN] Session created')

            // Update user state immediately
            setUser(data.session.user)
            setLoading(false)

            // Success! The onAuthStateChange listener will also fire, but we've already set the user

        } catch (err: any) {
            console.error('💥 [SIGNIN] Unexpected error:', err)
            setError(err.message || 'Sign in failed')
            setUser(null)
            setLoading(false)
            throw err
        }
    }

    // SIGN OUT FUNCTION
    async function signOut() {
        console.log('👋 [SIGNOUT] Signing out...')
        setLoading(true)

        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('❌ [SIGNOUT] Sign out failed:', error.message)
                setError(error.message)
                throw error
            }

            console.log('✅ [SIGNOUT] Sign out successful')
            setUser(null)

        } catch (err: any) {
            console.error('💥 [SIGNOUT] Unexpected error:', err)
            setError(err.message || 'Sign out failed')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
