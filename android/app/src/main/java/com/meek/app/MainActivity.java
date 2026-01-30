package com.meek.app;

import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.Manifest;
import android.content.pm.PackageManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int PERMISSION_REQUEST_CODE = 1001;
    private PermissionRequest mPermissionRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Request audio permission on app start if not granted
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[] {
                            Manifest.permission.RECORD_AUDIO,
                            Manifest.permission.CAMERA,
                            Manifest.permission.MODIFY_AUDIO_SETTINGS
                    },
                    PERMISSION_REQUEST_CODE);
        }

        // Enable cookie and session persistence
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(getBridge().getWebView(), true);

        // Configure WebView for session persistence and FRESH content
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            settings.setDomStorageEnabled(true); // Enable localStorage
            settings.setDatabaseEnabled(true); // Enable database storage
            settings.setCacheMode(WebSettings.LOAD_NO_CACHE); // Force fresh content from server

            // CRITICAL: Clear ALL cached data to ensure fresh Fiqh responses
            webView.clearCache(true); // Clear browser cache
            webView.clearFormData(); // Clear form data
            webView.clearHistory(); // Clear navigation history

            // Clear WebView databases (where old responses might be stored)
            try {
                getApplicationContext().deleteDatabase("webview.db");
                getApplicationContext().deleteDatabase("webviewCache.db");
            } catch (Exception e) {
                // Ignore if databases don't exist
            }

            // CRITICAL: Set WebViewClient to keep ALL navigation in WebView
            // This prevents OAuth URLs from opening in external Chrome browser
            webView.setWebViewClient(new android.webkit.WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                    String url = request.getUrl().toString();
                    
                    // Log the URL for debugging
                    android.util.Log.d("MeekOAuth", "Loading URL: " + url);
                    
                    // Allow ALL URLs to load in WebView, including:
                    // - accounts.google.com (Google OAuth)
                    // - meek-zeta.vercel.app (our app)
                    // - supabase URLs (auth service)
                    // This keeps the session in the same context!
                    view.loadUrl(url);
                    return true;
                }
            });
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == PERMISSION_REQUEST_CODE) {
            // Handle permission result - Capacitor handles WebView permissions
            // automatically
            if (mPermissionRequest != null) {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    mPermissionRequest.grant(mPermissionRequest.getResources());
                } else {
                    mPermissionRequest.deny();
                }
                mPermissionRequest = null;
            }
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        // Flush cookies when app goes to background
        CookieManager.getInstance().flush();
    }
}
