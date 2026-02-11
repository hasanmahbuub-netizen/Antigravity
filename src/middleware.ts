import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/env'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseAnonKey) {
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Try cookie-based auth first
    let { data: { user } } = await supabase.auth.getUser()

    // Fallback: check Authorization Bearer token (for WebView/mobile API calls)
    if (!user) {
        const authHeader = request.headers.get('authorization')
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7)
            try {
                const { data } = await supabase.auth.getUser(token)
                user = data.user
            } catch {
                // Invalid token
            }
        }
    }

    const { pathname } = request.nextUrl

    // Protected routes
    const protectedRoutes = ['/dashboard', '/quran', '/fiqh', '/settings', '/onboarding']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Auth routes
    const authRoutes = ['/auth/signin', '/auth/signup']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // API routes should return 401, not redirect
    if (pathname.startsWith('/api/') && !user) {
        // Don't block API routes — let the route handlers decide
        // This prevents redirect loops for API calls
        return response
    }

    // Redirect unauthenticated users from protected pages
    if (isProtectedRoute && !user) {
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/quran/:path*',
        '/fiqh/:path*',
        '/settings/:path*',
        '/onboarding/:path*',
        '/auth/:path*',
        '/api/:path*',
    ],
}
