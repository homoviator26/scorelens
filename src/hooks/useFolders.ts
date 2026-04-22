import { useCallback, useEffect, useState } from 'react';
import type { Folder } from '../types';
import {
  createFolder as createFolderStorage,
  deleteFolder as deleteFolderStorage,
  getFolders,
} from '../lib/storage';

// 폴더 목록을 불러오고, 생성/삭제 시 상태를 갱신하는 훅
export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const list = await getFolders();
      // createdAt 오름차순 (미분류가 항상 맨 처음)
      list.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return a.createdAt - b.createdAt;
      });
      setFolders(list);
    } catch (e: any) {
      setError(e?.message ?? '폴더를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error('폴더명을 입력해주세요.');
      await createFolderStorage(trimmed);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (folderId: string) => {
      await deleteFolderStorage(folderId);
      await refresh();
    },
    [refresh]
  );

  return { folders, loading, error, refresh, create, remove };
}
