import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Bookmark, Folder } from '../types';

// AsyncStorage 키 — 기획서 지정 상수
const FOLDERS_KEY = 'scorelens_folders';
const BOOKMARKS_KEY = 'scorelens_bookmarks';

// 기본 "미분류" 폴더 ID — 앱 전체에서 참조되므로 고정
export const DEFAULT_FOLDER_ID = 'default';

// 간단한 UUID 대체 (expo-crypto 없이) — 충돌 확률 낮게 만듦
export function genId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  );
}

// 폴더 목록 읽기. 없으면 "미분류" 생성 후 반환.
export async function getFolders(): Promise<Folder[]> {
  const raw = await AsyncStorage.getItem(FOLDERS_KEY);
  if (!raw) {
    const defaultFolder: Folder = {
      id: DEFAULT_FOLDER_ID,
      name: '미분류',
      isDefault: true,
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify([defaultFolder]));
    return [defaultFolder];
  }
  try {
    const parsed = JSON.parse(raw) as Folder[];
    // 기본 폴더 누락 방어 — 손상된 저장소에서 복구
    if (!parsed.some((f) => f.isDefault)) {
      const defaultFolder: Folder = {
        id: DEFAULT_FOLDER_ID,
        name: '미분류',
        isDefault: true,
        createdAt: Date.now(),
      };
      parsed.unshift(defaultFolder);
      await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    // 손상 시 초기화
    const defaultFolder: Folder = {
      id: DEFAULT_FOLDER_ID,
      name: '미분류',
      isDefault: true,
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify([defaultFolder]));
    return [defaultFolder];
  }
}

export async function saveFolders(folders: Folder[]): Promise<void> {
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export async function createFolder(name: string): Promise<Folder> {
  const folders = await getFolders();
  const newFolder: Folder = {
    id: genId(),
    name: name.trim(),
    isDefault: false,
    createdAt: Date.now(),
  };
  const next = [...folders, newFolder];
  await saveFolders(next);
  return newFolder;
}

// 폴더 삭제: 안에 있던 북마크는 "미분류"로 이동
export async function deleteFolder(folderId: string): Promise<void> {
  if (folderId === DEFAULT_FOLDER_ID) {
    throw new Error('기본 폴더는 삭제할 수 없습니다.');
  }
  const folders = await getFolders();
  const nextFolders = folders.filter((f) => f.id !== folderId);
  await saveFolders(nextFolders);

  // 북마크 이동
  const bookmarks = await getBookmarks();
  const nextBookmarks = bookmarks.map((b) =>
    b.folderId === folderId ? { ...b, folderId: DEFAULT_FOLDER_ID } : b
  );
  await saveBookmarks(nextBookmarks);
}

// ---- 북마크 ----

export async function getBookmarks(): Promise<Bookmark[]> {
  const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Bookmark[];
  } catch {
    return [];
  }
}

export async function saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export async function addBookmark(bookmark: Bookmark): Promise<void> {
  const bookmarks = await getBookmarks();
  bookmarks.unshift(bookmark); // 최신이 맨 위
  await saveBookmarks(bookmarks);
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  const bookmarks = await getBookmarks();
  await saveBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
}

export async function moveBookmark(
  bookmarkId: string,
  newFolderId: string
): Promise<void> {
  const bookmarks = await getBookmarks();
  const next = bookmarks.map((b) =>
    b.id === bookmarkId ? { ...b, folderId: newFolderId } : b
  );
  await saveBookmarks(next);
}

export async function getBookmarkById(
  bookmarkId: string
): Promise<Bookmark | null> {
  const bookmarks = await getBookmarks();
  return bookmarks.find((b) => b.id === bookmarkId) ?? null;
}
