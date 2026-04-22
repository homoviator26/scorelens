import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import type { AnalysisResult } from '../types';
import { InfoCard } from './InfoCard';
import { SectionCard } from './SectionCard';
import { SectionTimeline } from './SectionTimeline';

// 분석 결과를 보여주는 공용 뷰 (분석 화면 + 북마크 상세 화면 공유)
type Props = { analysis: AnalysisResult };

export function AnalysisView({ analysis }: Props) {
  return (
    <View>
      {/* 곡 헤더 */}
      <Text style={styles.pieceName}>{analysis.pieceName}</Text>
      <Text style={styles.composer}>
        {analysis.composer}
        {analysis.year ? ` · ${analysis.year}` : ''}
      </Text>

      {/* 기본 정보 카드 2x2 */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <InfoCard label="조성" value={analysis.key} />
          <InfoCard label="박자" value={analysis.timeSignature} />
        </View>
        <View style={styles.infoRow}>
          <InfoCard label="빠르기" value={analysis.tempo} />
          <InfoCard
            label="총 마디"
            value={`${analysis.totalMeasures}마디`}
          />
        </View>
      </View>

      {/* 전체 형식 */}
      <View style={styles.formBox}>
        <Text style={styles.sectionTitle}>전체 형식</Text>
        <Text style={styles.formKorean}>{analysis.overallForm.korean}</Text>
        <Text style={styles.formEnglish}>
          {analysis.overallForm.english} · {analysis.overallForm.notation}
        </Text>
      </View>

      {/* 섹션 타임라인 */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>섹션 구성</Text>
        <SectionTimeline
          sections={analysis.sections}
          totalMeasures={analysis.totalMeasures}
        />
      </View>

      {/* 섹션별 상세 */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>섹션별 분석</Text>
        {analysis.sections.map((s, i) => (
          <SectionCard section={s} key={`${s.label}-${i}`} />
        ))}
      </View>

      {/* 면책 문구 */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          악보에 기재된 객관적 정보만 분석합니다. 연주 해석은 연주자의 자율에
          맡깁니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pieceName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  composer: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 20,
    fontWeight: '500',
  },
  infoGrid: {
    gap: 10,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formBox: {
    backgroundColor: COLORS.bgSub,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  formKorean: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  formEnglish: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  block: {
    marginBottom: 24,
  },
  disclaimer: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: COLORS.bgSub,
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
});
