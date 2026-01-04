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
    webContentsDebuggingEnabled: true, // Enable for debugging
    // Handle back button behavior
    backgroundColor: '#0A1628'
  },
  plugins: {
    // Keyboard configuration
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  }
};

export default config;


