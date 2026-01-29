import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Mobile-specific OAuth callback
// This route handles OAuth callback and redirects back to the app via deep link
export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    console.log('📱 [MOBILE OAUTH] Callback received, code:', code ? 'present' : 'missing')

    if (code) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.session) {
            console.log('✅ [MOBILE OAUTH] Success, redirecting to app...')

            // Get the access token and refresh token
            const accessToken = data.session.access_token
            const refreshToken = data.session.refresh_token

            // Redirect to mobile app via deep link with tokens
            // The app will then use these tokens to restore the session
            const deepLink = `com.meek.app://auth?access_token=${accessToken}&refresh_token=${refreshToken}&next=${encodeURIComponent(next)}`

            console.log('📱 [MOBILE OAUTH] Deep link redirect:', deepLink.substring(0, 50) + '...')

            // Return HTML page that redirects to deep link
            // This is more reliable than a direct redirect for deep links
            const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Opening Meek...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0A1628;
            color: #F5F1E8;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #E8C49A;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        h1 { font-size: 24px; margin-bottom: 10px; }
        p { color: #B8B8B8; font-size: 14px; }
        a { color: #E8C49A; text-decoration: none; margin-top: 20px; display: inline-block; }
    </style>
</head>
<body>
    <div class="spinner"></div>
    <h1>Opening Meek App...</h1>
    <p>If the app doesn't open automatically, <a href="${deepLink}">tap here</a></p>
    <script>
        // Try to open the app immediately
        window.location.href = "${deepLink}";
        
        // Fallback: if still on this page after 2 seconds, show manual link more prominently
        setTimeout(function() {
            document.querySelector('p').innerHTML = 'App not opening? <a href="${deepLink}">Tap here to open Meek</a>';
        }, 2000);
    </script>
</body>
</html>
            `

            return new NextResponse(html, {
                headers: { 'Content-Type': 'text/html' },
            })
        } else {
            console.error('❌ [MOBILE OAUTH] Error:', error?.message)
        }
    }

    // Return error page
    console.log('❌ [MOBILE OAUTH] Failed, redirecting to signin')
    return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`)
}
