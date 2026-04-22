import AsyncStorage from '@react-native-async-storage/async-storage';

// 기기 고유 ID. 서버에서 일일 사용 횟수를 추적하는 키로 사용.
// 앱 최초 실행 시 UUID 하나 만들어 AsyncStorage에 영구 저장.
// 앱 삭제 → 재설치하면 새로 발급됨 (기기 식별 불가하므로 어쩔 수 없음).

const DEVICE_ID_KEY = 'scorelens_device_id';

function generateUUID(): string {
  // RFC4122 v4 UUID (crypto 없이 Math.random 기반 — 충돌 확률 무시 가능 수준)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let cached: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cached) return cached;
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) {
    cached = stored;
    return stored;
  }
  const fresh = generateUUID();
  await AsyncStorage.setItem(DEVICE_ID_KEY, fresh);
  cached = fresh;
  return fresh;
}
