import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meek.app',
  appName: 'Meek',
  webDir: 'android-web',
  server: {
    // Load the production web app in Android WebView
    url: 'https://meek-zeta.vercel.app',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;

