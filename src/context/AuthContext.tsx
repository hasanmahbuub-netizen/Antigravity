"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type AuthContextType = {
    user: User | null
    session: Session | null
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        return () => subscription.unsubscribe()
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
            // Should not happen if error is null, but good for type safety
            throw new Error('No session created')
        }

        // State update handled by onAuthStateChange
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
    // GOOGLE SIGN IN — Standard Web Flow (Wrapper Mode)
    // ============================================
    async function signInWithGoogle() {
        console.log('🌐 [GOOGLE SIGNIN] Starting standard web flow (Wrapper Mode)...')

        try {
            // WEB-ONLY AUTH FLOW (Browser Based App)
            // As requested, we treat the app purely as a browser wrapper.
            // No native plugins, no special redirects. Just standard OAuth.

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) throw error;

            // Standard flow handles redirect automatically
            return;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error('❌ [AUTH] Google Sign-In error:', errorMessage)
            throw error
        }
    }

    async function signOut() {
        try {
            await supabase.auth.signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
