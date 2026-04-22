import { useCallback, useEffect, useState } from 'react';
import type { Bookmark } from '../types';
import {
  addBookmark as addBookmarkStorage,
  getBookmarks,
  moveBookmark as moveBookmarkStorage,
  removeBookmark as removeBookmarkStorage,
} from '../lib/storage';

// 북마크 목록 훅. folderId를 주면 해당 폴더만 필터링.
export function useBookmarks(folderId?: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const list = await getBookmarks();
      const filtered = folderId ? list.filter((b) => b.folderId === folderId) : list;
      // 최신 생성 순
      filtered.sort((a, b) => b.createdAt - a.createdAt);
      setBookmarks(filtered);
    } catch (e: any) {
      setError(e?.message ?? '북마크를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (bookmark: Bookmark) => {
      await addBookmarkStorage(bookmark);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (bookmarkId: string) => {
      await removeBookmarkStorage(bookmarkId);
      await refresh();
    },
    [refresh]
  );

  const move = useCallback(
    async (bookmarkId: string, newFolderId: string) => {
      await moveBookmarkStorage(bookmarkId, newFolderId);
      await refresh();
    },
    [refresh]
  );

  return { bookmarks, loading, error, refresh, add, remove, move };
}
