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

            // Redirect to mobile app via deep link: meek://auth-callback
            // Tokens are URL-encoded for safe transmission
            const deepLink = `meek://auth-callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&next=${encodeURIComponent(next)}`

            console.log('📱 [MOBILE OAUTH] Deep link redirect:', deepLink.substring(0, 50) + '...')

            // Return HTML page that redirects to deep link
            // Using both meek:// and intent:// for maximum compatibility
            const intentUrl = `intent://auth-callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&next=${encodeURIComponent(next)}#Intent;scheme=meek;package=com.meek.app;end`;

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
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #E8C49A;
            color: #0A1628;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="spinner"></div>
    <h1>Opening Meek App...</h1>
    <p>Authentication successful!</p>
    
    <!-- Visible fallback button -->
    <a href="${deepLink}" class="button">Open App</a>

    <script>
        // Method 1: Try Android intent (most reliable for Chrome Custom Tabs)
        var intentUrl = "${intentUrl}";
        
        // Method 2: Standard deep link
        var deepLink = "${deepLink}";
        
        // Try intent first (works better in Chrome Custom Tabs)
        try {
            window.location.replace(intentUrl);
        } catch(e) {
            console.log("Intent failed, trying deep link");
        }
        
        // Fallback to standard deep link after short delay
        setTimeout(function() {
            window.location.replace(deepLink);
        }, 300);
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
