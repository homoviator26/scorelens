import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SECTION_COLORS } from '../constants/colors';
import type { Section } from '../types';

// 전체 마디를 기준으로 섹션들을 가로 비율대로 블록 시각화
type Props = { sections: Section[]; totalMeasures: number };

export function SectionTimeline({ sections, totalMeasures }: Props) {
  // 전체 마디 대비 각 섹션의 비율로 flex를 설정
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {sections.map((s, i) => {
          const span = Math.max(1, s.measureEnd - s.measureStart + 1);
          const palette = SECTION_COLORS[s.colorKey] ?? SECTION_COLORS.neutral;
          return (
            <View
              key={`${s.label}-${i}`}
              style={[
                styles.block,
                {
                  flex: span,
                  backgroundColor: palette.bg,
                },
                i === 0 && styles.first,
                i === sections.length - 1 && styles.last,
              ]}
            >
              {span / totalMeasures > 0.08 && (
                <Text
                  style={[styles.label, { color: palette.text }]}
                  numberOfLines={1}
                >
                  {s.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.meters}>
        <Text style={styles.meter}>1</Text>
        <Text style={styles.meter}>{totalMeasures}마디</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  track: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.6)',
  },
  first: {
    // 좌측 라운딩은 track의 overflow:hidden으로 처리됨
  },
  last: {
    borderRightWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  meters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  meter: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
