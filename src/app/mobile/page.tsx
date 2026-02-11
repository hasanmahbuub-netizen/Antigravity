"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

function MobileEntryContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading } = useAuth()
    const [status, setStatus] = useState('Initializing...')

    useEffect(() => {
        async function init() {
            // Check if we have an auth code in the URL (from deep link fallback)
            const code = searchParams.get('code')
            if (code) {
                setStatus('Completing sign-in...')
                try {
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (error) {
                        console.error('Mobile code exchange failed:', error)
                        setStatus('Sign-in failed. Redirecting...')
                    } else {
                        setStatus('Signed in! Redirecting...')
                        router.replace('/dashboard')
                        return
                    }
                } catch (err) {
                    console.error('Mobile code exchange error:', err)
                }
            }

            // Wait for auth to settle
            if (loading) {
                setStatus('Checking session...')
                return
            }

            // Route based on auth state
            if (user) {
                router.replace('/dashboard')
            } else {
                router.replace('/auth/signin')
            }
        }

        init()
    }, [user, loading, router, searchParams])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted text-sm">{status}</p>
        </div>
    )
}

export default function MobilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <MobileEntryContent />
        </Suspense>
    )
}
