import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// Expo Router의 웹 HTML 템플릿.
// 이 파일이 dist/*.html 모든 페이지의 <html>/<head>/<body> 뼈대를 생성합니다.
// 여기서 <head>에 넣은 스크립트/메타는 모든 페이지에 공통 적용됩니다.
//
// 구글 애드센스:
// - <head>에 글로벌 스크립트 1개 (사이트 인증 + 자동광고 트리거)
// - 실제 광고 슬롯(<ins class="adsbygoogle">)은 레이아웃/페이지 컴포넌트에서 따로 배치
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* 모바일 사파리 배경색/테마 */}
        <meta name="theme-color" content="#FAF9F7" />

        {/* Google AdSense - 사이트 전역 스크립트 */}
        <meta name="google-adsense-account" content="ca-pub-5678111545639707" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5678111545639707"
          crossOrigin="anonymous"
        />

        {/* Expo Router의 ScrollView 초기화 — 모바일 웹 스크롤 동작 정상화 */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
