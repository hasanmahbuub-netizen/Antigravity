import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meek.app',
  appName: 'Meek',
  webDir: 'out',
  server: {
    // Start at the login page — the app is a pure browser wrapper.
    // If the user has an existing session (cookies persist), the signin page
    // auto-redirects to /dashboard. If not, they see the login form.
    url: 'https://meek-zeta.vercel.app/auth/signin',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#0A1628',
    // Remove custom UserAgent to ensure we look like a standard Android Chrome/WebView
    // This helps with Google Auth compatibility
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark'
    },
    CapacitorCookies: {
      enabled: true
    }
  }
};

export default config;

