import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addItem, editItem } from '../store/slices/listsSlice';
import { Colors } from '../constants/colors';
import { Item } from '../types';
import * as Crypto from 'expo-crypto'
import { showSuccess, showError } from '../hooks/useAlerts';

const CATEGORIES = [
  '🥦 Produce', '🥛 Dairy', '🥩 Meat', '🍞 Bakery',
  '🧴 Personal', '🧹 Cleaning', '💊 Health', '📦 Other',
];

interface Props {
  visible: boolean;
  listId: string;
  editingItem: Item | null;
  onClose: () => void;
}

export default function AddItemModal({
  visible, listId, editingItem, onClose
}: Props) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Populate fields when editing
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setQuantity(editingItem.quantity);
      setNotes(editingItem.notes || '');
      setCategory(editingItem.category);
    } else {
      resetForm();
    }
  }, [editingItem, visible]);

  const resetForm = () => {
    setName('');
    setQuantity('');
    setNotes('');
    setCategory('');
    setErrors({});
  };

 const validate = () => {
  if (!name.trim()) {
    showError('Missing Name', 'Please enter an item name'); 
    return false;
  }
  return true;
};
  const handleSave = () => {
    if (!validate()) return;

    if (editingItem) {
      dispatch(editItem({
        listId,
        item: {
          ...editingItem,
          name: name.trim(),
          quantity: quantity.trim(),
          notes: notes.trim(),
          category,
        },
      }));
    } else {
      const newItem: Item = {
        id: Crypto.randomUUID(),
        name: name.trim(),
        quantity: quantity.trim(),
        notes: notes.trim(),
        category,
        purchased: false,
        createdAt: new Date().toISOString(),
      };
      dispatch(addItem({ listId, item: newItem }));
showSuccess(
  editingItem ? 'Item Updated!' : 'Item Added!',
  name.trim()
);
    }

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
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

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </Text>
            <Text style={styles.subtitle}>
              {editingItem ? 'Update the item details' : 'Fill in the item details'}
            </Text>

            {/* Name */}
            <Text style={styles.label}>Item name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="e.g. Milk, Bread..."
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors({});
              }}
              autoFocus
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            {/* Quantity */}
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2 Litres, 500g..."
              placeholderTextColor={Colors.textSecondary}
              value={quantity}
              onChangeText={setQuantity}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    category === cat && styles.categoryBtnActive,
                  ]}
                  onPress={() => setCategory(category === cat ? '' : cat)}
                >
                  <Text style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notes */}
<Text style={styles.label}>Notes (optional)</Text>
<TextInput
  style={[styles.input, styles.notesInput]}
  placeholder="Any extra details..."
  placeholderTextColor={Colors.textSecondary}
  value={notes}
  onChangeText={setNotes}
  multiline={true}
  numberOfLines={3}
/>

            {/* Buttons */}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: '90%',
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
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    color: Colors.white,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  inputError: {
    borderColor: Colors.error,
    marginBottom: 6,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 14,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryBtnActive: {
    backgroundColor: 'rgba(255,77,0,0.15)',
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  categoryTextActive: {
    color: Colors.primary,
    fontFamily: 'Poppins_800ExtraBold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
  saveBtn: {
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
  saveText: {
    color: Colors.white,
    fontFamily: 'Poppins_800ExtraBold', 
    fontSize: 15,
  },
});