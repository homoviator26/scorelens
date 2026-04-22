import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';
import type { Section } from '../types';
import { SectionBadge } from './SectionBadge';

// 섹션 하나에 대한 상세 카드 (라벨 + 이름 + 마디 범위 + 세부 특징)
type Props = { section: Section };

export function SectionCard({ section }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SectionBadge label={section.label} colorKey={section.colorKey} />
        <Text style={styles.name} numberOfLines={1}>
          {section.name}
        </Text>
        <Text style={styles.range}>
          {section.measureStart}–{section.measureEnd}마디
        </Text>
      </View>
      <View style={styles.details}>
        {section.details.map((d, i) => (
          <View style={styles.bulletRow} key={i}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.detailText}>{d}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSub,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  range: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  details: {
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bullet: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});
