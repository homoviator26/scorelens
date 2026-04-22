import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InfoModal } from '../../src/components/InfoModal';
import { COLORS } from '../../src/constants/colors';
import { SAMPLE_PIECES } from '../../src/constants/samples';

// 홈 화면 — 로고 + 검색창 + 샘플 곡 리스트
export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);

  const analyze = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push({
      pathname: '/analyze',
      params: { query: trimmed },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 로고 + 정보 아이콘 */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Text style={styles.logo}>ScoreLens</Text>
              <Pressable
                onPress={() => setInfoOpen(true)}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.infoButton,
                  pressed && { opacity: 0.5 },
                ]}
                accessibilityLabel="서비스 정보"
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>
            <Text style={styles.subtitle}>
              피아노 곡의 구조를 객관적으로 분석합니다
            </Text>
          </View>

          {/* 검색창 + 분석 버튼 */}
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={18}
              color={COLORS.textMuted}
              style={{ marginLeft: 14 }}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="예: 쇼팽 녹턴 Op.9 No.2"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={() => analyze(query)}
            />
          </View>
          <Pressable
            onPress={() => analyze(query)}
            disabled={!query.trim()}
            style={({ pressed }) => [
              styles.analyzeButton,
              !query.trim() && { opacity: 0.5 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.analyzeButtonText}>분석하기</Text>
          </Pressable>

          {/* 샘플 곡 */}
          <Text style={styles.sampleTitle}>샘플 곡</Text>
          <View style={styles.sampleList}>
            {SAMPLE_PIECES.map((p) => (
              <Pressable
                key={p}
                onPress={() => analyze(p)}
                style={({ pressed }) => [
                  styles.sampleItem,
                  pressed && { backgroundColor: COLORS.border },
                ]}
              >
                <Ionicons
                  name="musical-notes-outline"
                  size={18}
                  color={COLORS.text}
                />
                <Text style={styles.sampleText}>{p}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textMuted}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <InfoModal visible={infoOpen} onClose={() => setInfoOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginTop: 12,
    marginBottom: 28,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logo: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  infoButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgSub,
    borderRadius: 12,
    minHeight: 50,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  analyzeButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 28,
    minHeight: 50,
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: COLORS.accentText,
    fontSize: 16,
    fontWeight: '700',
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  sampleList: {
    backgroundColor: COLORS.bgSub,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  sampleText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
});
