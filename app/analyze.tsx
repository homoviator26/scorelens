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
import { AnalysisView } from '../src/components/AnalysisView';
import { FolderPickerModal } from '../src/components/FolderPickerModal';
import { COLORS } from '../src/constants/colors';
import {
  ApiError,
  DailyLimitError,
  NetworkError,
  UnknownPieceError,
  analyzePiece,
} from '../src/lib/api';
import { addBookmark, genId } from '../src/lib/storage';
import type { AnalysisResult, Bookmark } from '../src/types';

type Status = 'loading' | 'success' | 'error';

// 검색/샘플 탭 후 진입하는 분석 화면.
// URL params: query (분석할 곡명)
// 상태: loading → success(결과 표시) / error(메시지)
export default function AnalyzeScreen() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const pieceQuery = typeof query === 'string' ? query : '';

  const [status, setStatus] = useState<Status>('loading');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!pieceQuery) {
        setStatus('error');
        setErrorMsg('곡명이 전달되지 않았습니다.');
        return;
      }
      try {
        setStatus('loading');
        const result = await analyzePiece(pieceQuery);
        if (cancelled) return;
        setAnalysis(result);
        setStatus('success');
      } catch (e: any) {
        if (cancelled) return;
        if (e instanceof UnknownPieceError) {
          setErrorMsg(
            '해당 곡을 분석할 수 없습니다.\n클래식 표준 레퍼토리의 정확한 곡명으로 다시 검색해주세요.'
          );
        } else if (e instanceof DailyLimitError) {
          setErrorMsg(
            `오늘의 분석 한도(${e.limit}회)를 모두 사용했습니다.\n내일 다시 이용해주세요.`
          );
        } else if (e instanceof NetworkError) {
          setErrorMsg(
            '네트워크 연결을 확인해주세요.\n' + (e.message ?? '')
          );
        } else if (e instanceof ApiError) {
          setErrorMsg(e.message);
        } else {
          setErrorMsg(e?.message ?? '알 수 없는 오류가 발생했습니다.');
        }
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pieceQuery]);

  const handleSelectFolder = async (folderId: string) => {
    if (!analysis) return;
    try {
      const bookmark: Bookmark = {
        id: genId(),
        folderId,
        pieceName: analysis.pieceName,
        composer: analysis.composer,
        musicKey: analysis.key,
        overallFormKorean: analysis.overallForm.korean,
        analysisJson: analysis,
        createdAt: Date.now(),
      };
      await addBookmark(bookmark);
      setSaved(true);
      Alert.alert('저장 완료', '보관함에서 확인할 수 있습니다.');
    } catch (e: any) {
      Alert.alert('저장 실패', e?.message ?? '알 수 없는 오류');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* 커스텀 헤더 */}
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
        {status === 'success' ? (
          <Pressable
            onPress={() => !saved && setPickerOpen(true)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Ionicons
              name={saved ? 'star' : 'star-outline'}
              size={24}
              color={saved ? '#E3B33A' : COLORS.text}
            />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      {status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.text} />
          <Text style={styles.loadingText}>
            「{pieceQuery}」 구조를 분석하는 중
          </Text>
          <Text style={styles.loadingSub}>약 10초 소요됩니다</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={COLORS.textMuted}
          />
          <Text style={styles.errorTitle}>분석할 수 없습니다</Text>
          <Text style={styles.errorMessage}>{errorMsg}</Text>
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

      {status === 'success' && analysis && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AnalysisView analysis={analysis} />
        </ScrollView>
      )}

      <FolderPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectFolder}
      />
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
  loadingText: {
    marginTop: 18,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSub: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  errorTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
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
