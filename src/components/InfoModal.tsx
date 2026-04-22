import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

// 서비스 정보 모달 — 홈 화면의 ⓘ 아이콘을 눌렀을 때 열리는 바텀시트.
// 이메일을 탭하면 기기의 메일 앱(웹에선 mailto 핸들러)이 열립니다.
type Props = {
  visible: boolean;
  onClose: () => void;
};

const CONTACT_EMAIL = 'homoviator26@daum.net';

const USAGE_TIPS = [
  '한국어 검색이 잘 안 되면 영어로 검색해보세요.',
  '기본적으로 유명한 클래식 레퍼토리 곡들만 분석이 가능합니다.',
  '상대적으로 잘 알려지지 않았거나 연주 빈도가 낮아 정보가 적은 곡들은 분석이 어렵습니다.',
  '현재는 하루 20회 분석만 제공하고 있습니다.',
];

export function InfoModal({ visible, onClose }: Props) {
  const handleEmailPress = async () => {
    const url = `mailto:${CONTACT_EMAIL}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // 메일 앱이 없는 환경 (일부 웹 브라우저) — 이메일 주소 안내
        Alert.alert(
          '문의 이메일',
          CONTACT_EMAIL,
          [{ text: '확인', style: 'default' }]
        );
      }
    } catch {
      Alert.alert('문의 이메일', CONTACT_EMAIL);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {/* 내용이 길어질 수 있으므로 스크롤 가능하게 처리 */}
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 헤더 */}
              <View style={styles.headerRow}>
                <Text style={styles.appName}>ScoreLens</Text>
                <Text style={styles.tagline}>
                  피아노 곡의 구조를 객관적으로 분석합니다
                </Text>
              </View>

              {/* 정보 항목들 */}
              <View style={styles.infoBlock}>
                <View style={styles.row}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={COLORS.textMuted}
                  />
                  <Text style={styles.label}>제작자</Text>
                  <Text style={styles.value}>Seoha Bae</Text>
                </View>

                <Pressable
                  onPress={handleEmailPress}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { backgroundColor: COLORS.bgSub },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={COLORS.textMuted}
                  />
                  <Text style={styles.label}>문의</Text>
                  <Text style={[styles.value, styles.link]}>
                    {CONTACT_EMAIL}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={COLORS.textMuted}
                  />
                </Pressable>
              </View>

              {/* 이용 안내 */}
              <Text style={styles.sectionTitle}>이용 안내</Text>
              <View style={styles.tipsBlock}>
                {USAGE_TIPS.map((tip, idx) => (
                  <View key={idx} style={styles.tipRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.disclaimer}>
                분석 결과는 AI가 생성하며, 실제 악보와 차이가 있을 수 있습니다.
              </Text>
            </ScrollView>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrap: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  headerRow: {
    marginBottom: 18,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  tagline: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  infoBlock: {
    backgroundColor: COLORS.bgSub,
    borderRadius: 12,
    paddingVertical: 4,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 10,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    width: 48,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  link: {
    color: COLORS.text,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  tipsBlock: {
    backgroundColor: COLORS.bgSub,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  closeButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 12,
  },
  closeButtonText: {
    color: COLORS.accentText,
    fontSize: 15,
    fontWeight: '700',
  },
});
