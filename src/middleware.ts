import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Get token from cookie
    const token = request.cookies.get('sb-lvysvebakhwidqxztrvd-auth-token')?.value

    let isAuthenticated = false

    // Check if user has valid session
    if (token) {
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey)
            const { data: { session } } = await supabase.auth.getSession()
            isAuthenticated = !!session
        } catch (error) {
            console.error('Auth check failed:', error)
        }
    }

    const { pathname } = request.nextUrl

    // Protected routes - require authentication
    const protectedRoutes = ['/dashboard', '/quran', '/fiqh', '/settings', '/onboarding']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Auth routes - should redirect if already authenticated
    const authRoutes = ['/auth/signin', '/auth/signup', '/login', '/signup']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/quran/:path*', '/fiqh/:path*', '/settings/:path*', '/onboarding/:path*', '/auth/:path*', '/login', '/signup'],
}
