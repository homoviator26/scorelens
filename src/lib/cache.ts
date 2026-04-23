import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalysisResult } from '../types';

// 분석 결과 캐시 — 2단계 구조.
// 1) 메모리(Map): 동일 세션 내 즉시 히트 (가장 빠름)
// 2) AsyncStorage(웹: localStorage): 페이지 새로고침·재방문 후에도 유지
//
// 용도: 같은 곡을 다시 열 때 API 재호출 방지 + 모바일에서 앱 복귀 시 이전 결과 유지
const CACHE_PREFIX = 'scorelens_analysis:';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7일 — 그 이후엔 최신 분석을 새로 받음

type CacheEntry = {
  result: AnalysisResult;
  savedAt: number;
};

const memCache = new Map<string, AnalysisResult>();

function normalizeKey(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function getCached(
  query: string
): Promise<AnalysisResult | undefined> {
  const key = normalizeKey(query);

  // 1단계: 메모리 히트
  const fromMem = memCache.get(key);
  if (fromMem) return fromMem;

  // 2단계: AsyncStorage 조회
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return undefined;

    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.savedAt > TTL_MS) {
      // 만료된 항목은 정리
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
      return undefined;
    }
    memCache.set(key, entry.result);
    return entry.result;
  } catch {
    // 저장소 에러/파싱 에러 시 캐시 미스로 처리
    return undefined;
  }
}

export async function setCached(
  query: string,
  result: AnalysisResult
): Promise<void> {
  const key = normalizeKey(query);
  memCache.set(key, result);
  try {
    const entry: CacheEntry = { result, savedAt: Date.now() };
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // 저장소 꽉 찼거나 에러 — 메모리 캐시는 살아있음
  }
}

export function clearCache(): void {
  memCache.clear();
  // AsyncStorage 항목까지 일괄 삭제는 비용이 높아 생략.
  // 필요 시 브라우저 저장소 삭제로 대응.
}
