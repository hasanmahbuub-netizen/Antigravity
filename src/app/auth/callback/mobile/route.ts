import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

/**
 * Mobile OAuth Callback
 * 
 * CRITICAL FIX: Do NOT exchange the auth code on the server.
 * Instead, pass the raw auth code back to the app via deep link.
 * The client will call exchangeCodeForSession() which uses the
 * PKCE code verifier already stored in the WebView's localStorage.
 * 
 * This solves:
 * 1. Token URLs being too long (2000+ chars) for Android intents
 * 2. Cookie isolation between Chrome Custom Tab and WebView
 * 3. Session not being set in the correct context
 */
/**
 * HTML-escape to prevent XSS from user-controlled query params
 */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('📱 [MOBILE OAUTH] Callback received')
    console.log('📱 [MOBILE OAUTH] Code:', code ? `present (${code.length} chars)` : 'missing')
    console.log('📱 [MOBILE OAUTH] Error:', error || 'none')

    if (error) {
        console.error('❌ [MOBILE OAUTH] OAuth error:', error, errorDescription)
        // Sanitize user-controlled values before HTML injection
        return buildErrorPage(
            escapeHtml(error),
            escapeHtml(errorDescription || 'Authentication failed')
        )
    }

    if (code) {
        console.log('✅ [MOBILE OAUTH] Passing auth code to app via deep link')
        return buildRedirectPage(code)
    }

    // No code and no error — something went wrong
    console.error('❌ [MOBILE OAUTH] No code or error in callback')
    return buildErrorPage('missing_code', 'No authorization code received')
}

/**
 * Build HTML page that redirects back to the app via deep link
 * The auth code is short (~40 chars), making the deep link URL reliable
 */
function buildRedirectPage(code: string): NextResponse {
    const encodedCode = encodeURIComponent(code)

    // Short deep link URL (~80 chars instead of 2000+)
    const deepLink = `meek://auth-callback?code=${encodedCode}`

    // Android intent URL (most reliable for Chrome Custom Tabs)
    const intentUrl = `intent://auth-callback?code=${encodedCode}#Intent;scheme=meek;package=com.meek.app;S.browser_fallback_url=https%3A%2F%2Fmeek-zeta.vercel.app%2Fauth%2Fsignin;end`

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Returning to Meek...</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0A1628;
            color: #F5F1E8;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
            padding: 24px;
        }
        .spinner {
            width: 48px; height: 48px;
            border: 3px solid rgba(232, 196, 154, 0.3);
            border-top-color: #E8C49A;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 24px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        h1 { font-size: 22px; margin-bottom: 8px; font-weight: 600; }
        p { color: #9CA3AF; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #E8C49A, #D4A574);
            color: #0A1628;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            transition: transform 0.1s;
        }
        .btn:active { transform: scale(0.97); }
        .status { font-size: 12px; color: #6B7280; margin-top: 16px; }
        .check { font-size: 40px; margin-bottom: 16px; }
    </style>
</head>
<body>
    <div class="check">✅</div>
    <h1>Sign-in Successful!</h1>
    <p>Returning to the Meek app...</p>
    
    <div class="spinner" id="spinner"></div>
    
    <!-- Visible fallback button -->
    <a href="${deepLink}" class="btn" id="openBtn" style="display:none;">
        Open Meek App
    </a>
    
    <p class="status" id="status">Redirecting...</p>

    <script>
        var deepLink = "${deepLink}";
        var intentUrl = "${intentUrl}";
        var redirected = false;
        
        function tryRedirect() {
            if (redirected) return;
            
            // Method 1: Try Android intent (most reliable in Chrome Custom Tabs)
            try {
                window.location.href = intentUrl;
                redirected = true;
            } catch(e) {}
            
            // Method 2: Try custom scheme after short delay
            setTimeout(function() {
                if (redirected) return;
                try {
                    window.location.href = deepLink;
                    redirected = true;
                } catch(e) {}
            }, 500);
            
            // Method 3: Show manual button after 2 seconds
            setTimeout(function() {
                document.getElementById('spinner').style.display = 'none';
                document.getElementById('openBtn').style.display = 'inline-block';
                document.getElementById('status').textContent = 'Tap the button if the app did not open automatically';
            }, 2000);
        }
        
        // Start redirect attempts
        tryRedirect();
    </script>
</body>
</html>`

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store, no-cache'
        },
    })
}

/**
 * Build error page
 */
function buildErrorPage(error: string, description: string): NextResponse {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign-in Error</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0A1628; color: #F5F1E8;
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; min-height: 100vh; text-align: center; padding: 24px;
        }
        h1 { font-size: 22px; margin-bottom: 8px; }
        p { color: #9CA3AF; font-size: 14px; margin-bottom: 24px; }
        .btn {
            display: inline-block; padding: 14px 32px;
            background: linear-gradient(135deg, #E8C49A, #D4A574);
            color: #0A1628; border-radius: 12px; text-decoration: none;
            font-weight: 700; font-size: 16px;
        }
    </style>
</head>
<body>
    <div style="font-size:40px;margin-bottom:16px;">❌</div>
    <h1>Sign-in Failed</h1>
    <p>${description}</p>
    <a href="meek://auth-callback?error=${encodeURIComponent(error)}" class="btn">
        Return to App
    </a>
</body>
</html>`

    return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
    })
}
