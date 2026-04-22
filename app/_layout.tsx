import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { COLORS } from '../src/constants/colors';

// Import Vercel Analytics for web platform only
let Analytics: any = null;
if (Platform.OS === 'web') {
  Analytics = require('@vercel/analytics/react').Analytics;
}

// 앱 최상위 레이아웃
// - GestureHandlerRootView: 제스처 핸들러 (모달 드래그 등) 전역 적용
// - SafeAreaProvider: 노치/Dynamic Island 대응
// - Stack: 화면 전환 스택. 각 화면은 자체 헤더를 쓰므로 모두 headerShown=false
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="analyze" />
          <Stack.Screen name="bookmark/[id]" />
        </Stack>
        {/* Vercel Analytics - web only */}
        {Platform.OS === 'web' && Analytics && <Analytics />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
