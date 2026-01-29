"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

// Mobile app entry page - handles auth-aware routing
// This page is loaded by the Android/iOS app and redirects appropriately
export default function MobileEntryPage() {
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading) {
            if (user) {
                // User is logged in, go to dashboard
                router.replace('/dashboard')
            } else {
                // User not logged in, go to signin
                router.replace('/auth/signin')
            }
        }
    }, [user, loading, router])

    // Show a loading state while checking auth
    return (
        <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#E8C49A] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#B8B8B8] text-sm">Loading Meek...</p>
            </div>
        </div>
    )
}
