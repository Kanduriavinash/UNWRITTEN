import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unwritten.campus',
  appName: 'UNWRITTEN',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
