import type { SectionColorKey } from '../types';

// 전역 색상 팔레트 — 기획서에 명시된 값 그대로
export const COLORS = {
  bg: '#FAF9F7', // 기본 배경
  bgSub: '#F1EFE8', // 서브 배경 (카드 등)
  text: '#2C2C2A', // 기본 텍스트
  textMuted: '#7A7A76', // 보조 텍스트
  border: '#E5E3DB', // 테두리
  accent: '#2C2C2A', // 버튼/액센트
  accentText: '#FAF9F7',
  danger: '#B54A3A', // 삭제/경고
  shadow: 'rgba(0,0,0,0.06)',
};

// 섹션 라벨에 쓰이는 색상 — colorKey에 따라 매핑
export const SECTION_COLORS: Record<
  SectionColorKey,
  { bg: string; text: string }
> = {
  primary: { bg: '#CECBF6', text: '#26215C' }, // 주제부 A
  secondary: { bg: '#F5C4B3', text: '#4A1B0C' }, // 대조부 B
  tertiary: { bg: '#B5D4F4', text: '#042C53' }, // 제2주제
  neutral: { bg: '#D3D1C7', text: '#2C2C2A' }, // 서주 / 코다
};
