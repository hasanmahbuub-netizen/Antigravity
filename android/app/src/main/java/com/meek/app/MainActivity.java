package com.meek.app;

import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

/**
 * MainActivity — Pure Browser Wrapper
 *
 * This app is a WebView shell that loads the production web app.
 * All logic (auth, navigation, features) lives on the web.
 * The WebView just needs to:
 *   1. Load the URL (handled by Capacitor via server.url)
 *   2. Persist cookies/localStorage (so login sessions survive app restarts)
 *   3. Stay out of the way
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ─── Cookie Persistence ───
        // Accept cookies so Supabase auth tokens persist between app opens
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(getBridge().getWebView(), true);

        // ─── WebView Configuration ───
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            settings.setDomStorageEnabled(true);     // localStorage for Supabase session
            settings.setDatabaseEnabled(true);       // IndexedDB support
            settings.setCacheMode(WebSettings.LOAD_DEFAULT); // Normal browser caching
            settings.setJavaScriptEnabled(true);     // Required for the web app
        }

        // NOTE: We intentionally do NOT clear cache, cookies, form data, or history.
        // The whole point is to remember the user's session like a real browser.
    }

    @Override
    public void onPause() {
        super.onPause();
        // Flush cookies to disk when app goes to background
        // This ensures the session survives even if the OS kills the app
        CookieManager.getInstance().flush();
    }
}
