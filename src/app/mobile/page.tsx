"use client"

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

// Main content component that uses useSearchParams
function MobileEntryContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading } = useAuth()
    const [authProcessed, setAuthProcessed] = useState(false)

    // Check tokens on initial render (memoized)
    const tokens = useMemo(() => {
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const next = searchParams.get('next') || '/dashboard'
        return accessToken && refreshToken ? { accessToken, refreshToken, next } : null
    }, [searchParams])

    useEffect(() => {
        // If we have tokens from deep link, restore session
        if (tokens && !authProcessed) {
            console.log('📱 [MOBILE] Received auth tokens from deep link')
            setAuthProcessed(true)

            // Set the session using the tokens
            supabase.auth.setSession({
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
            }).then(({ error }) => {
                if (error) {
                    console.error('❌ [MOBILE] Failed to set session:', error)
                    router.replace('/auth/signin?error=session_failed')
                } else {
                    console.log('✅ [MOBILE] Session restored successfully')
                    router.replace(tokens.next)
                }
            })
            return
        }

        // Normal routing - redirect based on auth state
        if (!loading && !tokens) {
            if (user) {
                router.replace('/dashboard')
            } else {
                router.replace('/auth/signin')
            }
        }
    }, [user, loading, router, tokens, authProcessed])

    // Show loading state
    return (
        <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#E8C49A] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#B8B8B8] text-sm">
                    {tokens ? 'Signing you in...' : 'Loading Meek...'}
                </p>
            </div>
        </div>
    )
}

// Wrapper component with Suspense for useSearchParams
export default function MobileEntryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#E8C49A] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <MobileEntryContent />
        </Suspense>
    )
}
