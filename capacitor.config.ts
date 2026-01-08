import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meek.app',
  appName: 'Meek',
  webDir: 'android-web',
  server: {
    // Start directly at signin - skip landing page for mobile app
    url: 'https://meek-zeta.vercel.app/auth/signin',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
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
    }
  }
};

export default config;

