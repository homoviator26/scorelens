import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

// 분석 결과 화면 상단의 기본 정보 카드 (조성/박자/빠르기/마디)
type Props = { label: string; value: string };

export function InfoCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.bgSub,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: 78,
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 6,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
});
