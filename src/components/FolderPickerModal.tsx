import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useFolders } from '../hooks/useFolders';

// 북마크 저장 시 폴더를 고르는 모달. 새 폴더 만들기 포함.
type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (folderId: string) => void;
};

export function FolderPickerModal({ visible, onClose, onSelect }: Props) {
  const { folders, create } = useFolders();
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    try {
      setCreating(true);
      await create(name);
      setNewFolderName('');
    } catch (e: any) {
      Alert.alert('폴더 생성 실패', e?.message ?? '알 수 없는 오류');
    } finally {
      setCreating(false);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>저장할 폴더 선택</Text>

            <ScrollView
              style={{ maxHeight: 320 }}
              contentContainerStyle={{ paddingBottom: 6 }}
            >
              {folders.map((f) => (
                <Pressable
                  key={f.id}
                  style={({ pressed }) => [
                    styles.folderRow,
                    pressed && { backgroundColor: COLORS.bgSub },
                  ]}
                  onPress={() => {
                    onSelect(f.id);
                    onClose();
                  }}
                >
                  <Ionicons
                    name={f.isDefault ? 'folder' : 'folder-outline'}
                    size={20}
                    color={COLORS.text}
                  />
                  <Text style={styles.folderName}>{f.name}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={COLORS.textMuted}
                  />
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.newFolderRow}>
              <TextInput
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="새 폴더 이름"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleCreate}
                maxLength={24}
              />
              <Pressable
                onPress={handleCreate}
                disabled={!newFolderName.trim() || creating}
                style={({ pressed }) => [
                  styles.addButton,
                  (!newFolderName.trim() || creating) && { opacity: 0.5 },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.addButtonText}>만들기</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancel,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    minHeight: 48,
  },
  folderName: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  newFolderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgSub,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 44,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 72,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.accentText,
    fontWeight: '700',
    fontSize: 14,
  },
  cancel: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cancelText: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
