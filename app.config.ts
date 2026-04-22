import { ExpoConfig, ConfigContext } from 'expo/config';

// app.config.ts: app.json의 내용을 코드로 확장. 환경변수에서 API 키를 읽어 extra에 주입합니다.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  name: 'ScoreLens',
  slug: 'scorelens',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'scorelens',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  primaryColor: '#2C2C2A',
  backgroundColor: '#FAF9F7',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FAF9F7',
  },
  ios: {
    bundleIdentifier: 'com.scorelens.app',
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.scorelens.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FAF9F7',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
    // Expo Router 6: 정적 사이트 출력 (Vercel/Netlify 등에 업로드 가능한 HTML 번들 생성)
    bundler: 'metro',
    output: 'static',
  },
  plugins: ['expo-router'],
  extra: {
    // .env의 Supabase 설정을 읽어 앱 번들에 포함합니다.
    // Gemini 키는 이제 Supabase Edge Function(서버)에만 있으므로 앱에 포함하지 않습니다.
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  },
});
