import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    console.log('🔑 OAuth callback received, code:', code ? 'present' : 'missing')

    if (code) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Ignore - might be called from Server Component
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            console.log('✅ OAuth successful, redirecting to:', next)
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error('❌ OAuth error:', error.message)
        }
    }

    // Return the user to signin with error message
    console.log('❌ OAuth failed, redirecting to signin')
    return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`)
}
