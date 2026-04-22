import Constants from 'expo-constants';
import type { AnalysisResult } from '../types';
import { getCached, setCached } from './cache';
import { getDeviceId } from './device';

// 에러 타입 구분 — UI에서 메시지 분기
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class UnknownPieceError extends Error {
  constructor() {
    super('해당 곡을 분석할 수 없습니다.');
  }
}
export class DailyLimitError extends Error {
  limit: number;
  constructor(limit: number) {
    super('일일 분석 한도에 도달했습니다.');
    this.limit = limit;
  }
}
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// extra에서 Supabase 설정 읽기 (app.config.ts → Constants.expoConfig.extra)
function getSupabaseConfig(): { url: string; anonKey: string } {
  const url =
    (Constants.expoConfig?.extra?.supabaseUrl as string | undefined) ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    '';
  const anonKey =
    (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined) ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    '';
  return { url: url.trim(), anonKey: anonKey.trim() };
}

// Supabase Edge Function으로 피아노 곡 구조 분석 요청
// 서버가 하루 20회 제한 + Gemini 호출 + 카운트 증가를 처리함.
export async function analyzePiece(
  pieceQuery: string
): Promise<AnalysisResult> {
  // 세션 캐시 체크 먼저 — 같은 곡 재검색은 서버 안 탐 (카운트도 안 올라감)
  const cached = getCached(pieceQuery);
  if (cached) return cached;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new ApiError('서버 설정이 누락되었습니다. 앱을 재시작해주세요.');
  }

  const deviceId = await getDeviceId();

  let response: Response;
  try {
    response = await fetch(`${url}/functions/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ deviceId, pieceQuery }),
    });
  } catch (e: any) {
    throw new NetworkError(
      '네트워크 연결을 확인해주세요: ' + (e?.message ?? '알 수 없는 오류')
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 429 && data?.error === 'DAILY_LIMIT_REACHED') {
      throw new DailyLimitError(typeof data?.limit === 'number' ? data.limit : 20);
    }
    throw new ApiError(
      (data?.error as string) || `서버 오류 (${response.status})`
    );
  }

  const text = data?.text;
  if (typeof text !== 'string') {
    throw new ApiError('서버 응답을 해석할 수 없습니다.');
  }

  // responseMimeType=application/json이라 순수 JSON이지만, 혹시 모를 코드 블록 제거
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(cleaned) as AnalysisResult;
  } catch {
    throw new ApiError('분석 결과 형식이 잘못되었습니다.');
  }

  // 최소 유효성 검사
  if (!parsed || typeof parsed !== 'object') {
    throw new ApiError('분석 결과가 비어 있습니다.');
  }
  if (parsed.known === false) {
    throw new UnknownPieceError();
  }
  if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    throw new ApiError('섹션 정보가 누락되었습니다.');
  }

  // 캐시에 저장
  setCached(pieceQuery, parsed);
  return parsed;
}
