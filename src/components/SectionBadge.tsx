import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SECTION_COLORS } from '../constants/colors';
import type { SectionColorKey } from '../types';

// 섹션 라벨을 색 칩으로 표시
type Props = {
  label: string;
  colorKey: SectionColorKey;
  size?: 'sm' | 'md';
};

export function SectionBadge({ label, colorKey, size = 'md' }: Props) {
  const palette = SECTION_COLORS[colorKey] ?? SECTION_COLORS.neutral;
  const isSmall = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          paddingVertical: isSmall ? 3 : 6,
          paddingHorizontal: isSmall ? 8 : 12,
          borderRadius: isSmall ? 8 : 10,
        },
      ]}
    >
      <Text
        style={{
          color: palette.text,
          fontWeight: '700',
          fontSize: isSmall ? 12 : 14,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
});
