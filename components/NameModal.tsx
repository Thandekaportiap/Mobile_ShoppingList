import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { Colors, Fonts } from '../constants/colors';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setUserName } from '../store/slices/userSlice';

interface Props {
  visible: boolean;
}

export default function NameModal({ visible }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    dispatch(setUserName(name.trim()));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>

          {/* Icon */}
          <Text style={styles.emoji}>🛒</Text>

          <Text style={styles.title}>Welcome to ShopList!</Text>
          <Text style={styles.subtitle}>
            What should we call you?
          </Text>

          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Enter your name..."
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (error) setError('');
            }}
            autoFocus={true}
            maxLength={20}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Let's Go 🚀</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  emoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: Fonts.extraBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginBottom: 8,
  },
  btn: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: {
    color: Colors.white,
    fontFamily: Fonts.extraBold,
    fontSize: 16,
  },
});