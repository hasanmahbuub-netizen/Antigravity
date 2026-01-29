import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meek.app',
  appName: 'Meek',
  webDir: 'android-web',
  server: {
    // Start at mobile entry page - it detects auth and redirects appropriately
    url: 'https://meek-zeta.vercel.app/mobile',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Disable for production
    backgroundColor: '#0A1628',
    // Append user agent for cookie handling
    appendUserAgent: 'MeekApp/1.0'
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark'
    },
    CapacitorCookies: {
      enabled: true
    },
    Browser: {
      // OAuth will open in Chrome Custom Tabs
      // and return via deep link
    }
  }
};

export default config;

