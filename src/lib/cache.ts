import type { AnalysisResult } from '../types';

// 세션 내(앱 프로세스 생존 동안) 메모리 캐시
// 같은 곡을 다시 검색할 때 Gemini API 재호출을 피하기 위함
const cache = new Map<string, AnalysisResult>();

function normalizeKey(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getCached(query: string): AnalysisResult | undefined {
  return cache.get(normalizeKey(query));
}

export function setCached(query: string, result: AnalysisResult): void {
  cache.set(normalizeKey(query), result);
}

export function clearCache(): void {
  cache.clear();
}
