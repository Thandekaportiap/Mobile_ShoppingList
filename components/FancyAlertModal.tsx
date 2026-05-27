import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Colors, Fonts } from '../constants/colors';

type AlertType = 'success' | 'error' | 'warning' | 'delete';

interface Props {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const alertConfig = {
  success: {
    emoji: '✅',
    color: Colors.success,
    confirmColor: Colors.success,
  },
  error: {
    emoji: '❌',
    color: Colors.error,
    confirmColor: Colors.error,
  },
  warning: {
    emoji: '⚠️',
    color: Colors.warning,
    confirmColor: Colors.warning,
  },
  delete: {
    emoji: '🗑️',
    color: Colors.error,
    confirmColor: Colors.error,
  },
};

export default function FancyAlertModal({
  visible,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: Props) {
  const config = alertConfig[type];

 return (
  <FancyAlert
    visible={visible}
    style={styles.alert}
    onRequestClose={onCancel}
    icon={
      <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
        <Text style={styles.iconEmoji}>{config.emoji}</Text>
      </View>
    }
  >
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>{cancelText}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: config.confirmColor }]}
          onPress={onConfirm}
        >
          <Text style={styles.confirmText}>{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </FancyAlert>
);
}

const styles = StyleSheet.create({
  alert: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 24,
  },
  iconContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  iconEmoji: {
    fontSize: 32,
  },
  content: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.extraBold,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
});