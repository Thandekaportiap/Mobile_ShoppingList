import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  Modal, StyleSheet, Platform, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Fonts } from '../constants/colors';
import { scheduleReminder, requestNotificationPermission, cancelReminder } from '../hooks/useNotifications';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setReminder, clearReminder } from '../store/slices/listsSlice';
import { ShoppingList } from '../types';

interface Props {
  visible: boolean;
  list: ShoppingList;
  onClose: () => void;
}

export default function ReminderModal({ visible, list, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState(new Date());
const [showPicker, setShowPicker] = useState(false);
const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const hasReminder = !!list.reminder;

  const handleSetReminder = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to set reminders.',
        [{ text: 'OK' }]
      );
      return;
    }

    const id = await scheduleReminder(list.name, date);
    if (id) {
      dispatch(setReminder({
        id: list.id,
        notificationId: id,
        date: date.toISOString(),
      }));
      Alert.alert('✅ Reminder Set!', `We'll remind you on ${date.toLocaleString()}`);
      onClose();
    }
  };

  const handleClearReminder = async () => {
    if (list.reminder) {
      await cancelReminder(list.reminder.notificationId);
      dispatch(clearReminder(list.id));
      Alert.alert('Reminder Cleared', 'Your reminder has been removed.');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>⏰ Set Reminder</Text>
          <Text style={styles.subtitle}>
  {`Get notified to shop for ${list.emoji} ${list.name}`}
</Text>

          {/* Current Reminder */}
          {hasReminder && (
            <View style={styles.currentReminder}>
              <Text style={styles.currentReminderText}>
                ✅ Reminder set for{' '}
                {new Date(list.reminder!.date).toLocaleString()}
              </Text>
            </View>
          )}

          {/* Date Picker */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateBtnLabel}>📅 Selected time</Text>
            <Text style={styles.dateBtnValue}>{date.toLocaleString()}</Text>
          </TouchableOpacity>

          {showPicker && (
  <DateTimePicker
    value={date}
    mode={pickerMode}
    display="default"
    minimumDate={new Date()}
    onChange={(_, selected) => {
      setShowPicker(false);
      if (selected) {
        setDate(selected);
        // If we just picked date, now show time picker
        if (pickerMode === 'date') {
          setPickerMode('time');
          setShowPicker(true);
        }
      }
    }}
  />
)}

          {/* Buttons */}
          <View style={styles.buttons}>
            {hasReminder && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={handleClearReminder}
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.setBtn}
              onPress={handleSetReminder}
            >
              <Text style={styles.setText}>
                {hasReminder ? 'Update' : 'Set Reminder'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    fontFamily: Fonts.extraBold,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: Fonts.regular,
    marginBottom: 20,
    lineHeight: 20,
  },
  listName: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
  currentReminder: {
    backgroundColor: 'rgba(0,200,83,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  currentReminderText: {
    color: Colors.success,
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  dateBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dateBtnLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: Fonts.regular,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateBtnValue: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: Fonts.semiBold,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  clearBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,23,68,0.15)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  clearText: {
    color: Colors.error,
    fontFamily: Fonts.bold,
    fontSize: 14,
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
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
  setBtn: {
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
  setText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 14,
  },
});