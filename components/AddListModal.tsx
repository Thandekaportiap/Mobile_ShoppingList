import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, FlatList, KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addList } from '../store/slices/listsSlice';
import { Colors } from '../constants/colors';
import { ShoppingList } from '../types';
import * as Crypto from 'expo-crypto'
import { showSuccess, showError } from '../hooks/useAlerts';

const EMOJIS = ['🛒','🏠','🎄','💊','🏋️','🎁','🍕','📚','👗','🐾','🧹','💻'];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddListModal({ visible, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🛒');
  const [error, setError] = useState('');

const handleCreate = () => {
  if (!name.trim()) {
    showError('Missing Name', 'Please enter a list name'); // ✅ fancy error
    return;
  }

  const newList: ShoppingList = {
    id: Crypto.randomUUID(),
    name: name.trim(),
    emoji: selectedEmoji,
    items: [],
    createdAt: new Date().toISOString(),
  };

  dispatch(addList(newList));
  showSuccess('List Created!', `${selectedEmoji} ${name.trim()} is ready`); // ✅ burnt toast
  setName('');
  setSelectedEmoji('🛒');
  setError('');
  onClose();
};

  const handleClose = () => {
    setName('');
    setError('');
    setSelectedEmoji('🛒');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>New Shopping List</Text>
          <Text style={styles.subtitle}>Give your list a name and icon</Text>

          {/* Emoji Picker */}
          <Text style={styles.label}>Choose an icon</Text>
          <FlatList
            data={EMOJIS}
            horizontal
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emojiRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.emojiBtn,
                  selectedEmoji === item && styles.emojiBtnActive,
                ]}
                onPress={() => setSelectedEmoji(item)}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Name Input */}
          <Text style={styles.label}>List name</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="e.g. Groceries, Holiday..."
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError('');
            }}
            // ✅ Explicit
autoFocus={true}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
              <Text style={styles.createText}>Create List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.secondaryLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: 'Poppins_800ExtraBold',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 24,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  emojiRow: {
    gap: 10,
    marginBottom: 24,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,77,0,0.15)',
  },
  emojiText: { fontSize: 24 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    color: Colors.white,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 15,
  },
  createBtn: {
    flex: 2,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  createText: {
    color: Colors.white,
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 15,
  },
});