import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meek.app',
  appName: 'Meek',
  webDir: 'android-web',
  server: {
    // Load the production web app directly
    // This makes the app behave exactly like the browser version
    url: 'https://meek-zeta.vercel.app',
    cleartext: false,
    // Enable this to allow navigation to external sites (like Google Auth) within the WebView
    // if we wanted stay-in-app auth, but Google blocks embedded WebViews.
    // So we will stick to standard redirect flow.
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

