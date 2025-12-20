import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Refresh session if expired - this is important for keeping users logged in
    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // Protected routes - require authentication
    const protectedRoutes = ['/dashboard', '/quran', '/fiqh', '/settings', '/onboarding']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Auth routes - should redirect if already authenticated
    const authRoutes = ['/auth/signin', '/auth/signup']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Redirect unauthenticated users from protected routes
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
    matcher: ['/dashboard/:path*', '/quran/:path*', '/fiqh/:path*', '/settings/:path*', '/onboarding/:path*', '/auth/:path*'],
}
