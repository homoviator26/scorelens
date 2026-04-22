import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../src/constants/colors';
import { useBookmarks } from '../../src/hooks/useBookmarks';
import { useFolders } from '../../src/hooks/useFolders';
import { DEFAULT_FOLDER_ID } from '../../src/lib/storage';

// 보관함 화면 — 폴더 칩 + 저장된 곡 목록
export default function LibraryScreen() {
  const { folders, remove: removeFolder, refresh: refreshFolders } =
    useFolders();
  const [selectedFolderId, setSelectedFolderId] =
    useState<string>(DEFAULT_FOLDER_ID);
  const { bookmarks, refresh: refreshBookmarks } =
    useBookmarks(selectedFolderId);

  // 화면에 포커스될 때마다 최신 상태 읽기 (다른 화면에서 저장 후 돌아올 때)
  useEffect(() => {
    const unsubscribe = () => {};
    refreshFolders();
    refreshBookmarks();
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFolderId]);

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  const confirmDeleteFolder = useCallback(() => {
    if (!selectedFolder || selectedFolder.isDefault) return;
    Alert.alert(
      '폴더 삭제',
      `"${selectedFolder.name}" 폴더를 삭제할까요?\n안에 있던 곡은 "미분류"로 이동됩니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFolder(selectedFolder.id);
              setSelectedFolderId(DEFAULT_FOLDER_ID);
            } catch (e: any) {
              Alert.alert('삭제 실패', e?.message ?? '알 수 없는 오류');
            }
          },
        },
      ]
    );
  }, [selectedFolder, removeFolder]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>보관함</Text>
        {selectedFolder && !selectedFolder.isDefault && (
          <Pressable
            onPress={confirmDeleteFolder}
            hitSlop={8}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </Pressable>
        )}
      </View>

      {/* 폴더 칩 (가로 스크롤) */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {folders.map((f) => {
            const active = f.id === selectedFolderId;
            return (
              <Pressable
                key={f.id}
                onPress={() => setSelectedFolderId(f.id)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && !active && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {f.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 북마크 목록 */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {bookmarks.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="bookmark-outline"
              size={40}
              color={COLORS.textMuted}
            />
            <Text style={styles.emptyTitle}>저장된 곡이 없습니다</Text>
            <Text style={styles.emptyDesc}>
              분석 결과 화면에서 별 아이콘을 눌러 저장할 수 있습니다.
            </Text>
          </View>
        ) : (
          bookmarks.map((b) => (
            <Pressable
              key={b.id}
              onPress={() =>
                router.push({
                  pathname: '/bookmark/[id]',
                  params: { id: b.id },
                })
              }
              style={({ pressed }) => [
                styles.bookmarkCard,
                pressed && { backgroundColor: COLORS.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.bookmarkName} numberOfLines={1}>
                  {b.pieceName}
                </Text>
                <Text style={styles.bookmarkComposer} numberOfLines={1}>
                  {b.composer}
                </Text>
                <View style={styles.bookmarkMeta}>
                  <View style={styles.metaPill}>
                    <Text style={styles.metaText}>{b.overallFormKorean}</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <Text style={styles.metaText}>{b.musicKey}</Text>
                  </View>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textMuted}
              />
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  deleteButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chipRow: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.bgSub,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.accentText,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  bookmarkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSub,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 10,
    minHeight: 80,
  },
  bookmarkName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  bookmarkComposer: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  bookmarkMeta: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaPill: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
  },
});
