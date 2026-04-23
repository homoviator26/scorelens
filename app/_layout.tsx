import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/constants/colors';

// 앱 최상위 레이아웃
// - GestureHandlerRootView: 제스처 핸들러 (모달 드래그 등) 전역 적용
// - SafeAreaProvider: 노치/Dynamic Island 대응
// - Stack: 화면 전환 스택. 각 화면은 자체 헤더를 쓰므로 모두 headerShown=false
export default function RootLayout() {
  // 웹 한정: 새로고침 또는 루트('/')가 아닌 URL로 직접 진입한 경우 홈으로 리디렉트.
  // 앱 내 네비게이션(router.push 등)은 페이지 로드가 발생하지 않아 이 조건을 안 탐.
  // 리디렉트 완료 전까지는 Stack을 렌더링하지 않아 자식 화면의 부작용(API 호출 등)을 차단.
  const [needsRedirect, setNeedsRedirect] = useState(() => {
    if (Platform.OS !== 'web') return false;
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    return path !== '/' && path !== '';
  });

  useEffect(() => {
    if (needsRedirect) {
      router.replace('/');
      setNeedsRedirect(false);
    }
  }, [needsRedirect]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {!needsRedirect && (
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
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
