import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnalysisView } from '../../src/components/AnalysisView';
import { COLORS } from '../../src/constants/colors';
import { getBookmarkById, removeBookmark } from '../../src/lib/storage';
import type { Bookmark } from '../../src/types';

// 저장된 북마크 상세 보기 (분석 결과 화면과 레이아웃 공유)
export default function BookmarkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof id !== 'string') {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const found = await getBookmarkById(id);
        if (cancelled) return;
        if (!found) {
          setNotFound(true);
        } else {
          setBookmark(found);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const confirmDelete = () => {
    if (!bookmark) return;
    Alert.alert('저장 해제', `"${bookmark.pieceName}"을(를) 보관함에서 제거할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '제거',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeBookmark(bookmark.id);
            router.back();
          } catch (e: any) {
            Alert.alert('삭제 실패', e?.message ?? '알 수 없는 오류');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          분석 결과
        </Text>
        {bookmark ? (
          <Pressable
            onPress={confirmDelete}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Ionicons name="star" size={24} color="#E3B33A" />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.text} />
        </View>
      )}

      {!loading && notFound && (
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={COLORS.textMuted}
          />
          <Text style={styles.errorTitle}>북마크를 찾을 수 없습니다</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.retryText}>돌아가기</Text>
          </Pressable>
        </View>
      )}

      {!loading && bookmark && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AnalysisView analysis={bookmark.analysisJson} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: COLORS.accentText,
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
});
