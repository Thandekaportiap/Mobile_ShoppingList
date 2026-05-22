import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Item } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  item: Item;
  onToggle: () => void;
  onEdit: () => void;
}

export default function ItemCard({ item, onToggle, onEdit }: Props) {
  return (
    <View style={[styles.card, item.purchased && styles.cardDone]}>

      {/* Checkbox */}
      <TouchableOpacity
        style={[styles.checkbox, item.purchased && styles.checkboxDone]}
        onPress={onToggle}
      >
        {item.purchased && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Item Info */}
      <View style={styles.info}>
        <Text style={[styles.name, item.purchased && styles.nameDone]}>
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          {item.quantity ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>📦 {item.quantity}</Text>
            </View>
          ) : null}
          {item.category ? (
            <View style={[styles.tag, styles.tagAccent]}>
              <Text style={[styles.tagText, styles.tagTextAccent]}>
                {item.category}
              </Text>
            </View>
          ) : null}
        </View>

        {item.notes ? (
          <Text style={styles.notes} numberOfLines={1}>
            📝 {item.notes}
          </Text>
        ) : null}
      </View>

      {/* Edit Button */}
      <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
        <Text style={styles.editText}>✏️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardDone: {
    opacity: 0.5,
    borderColor: Colors.success,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Poppins_800ExtraBold',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins_800ExtraBold',
  },
  nameDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagAccent: {
    backgroundColor: 'rgba(0,229,255,0.1)',
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
  },
  tagTextAccent: {
    color: Colors.accent,
  },
  notes: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
  },
  editBtn: {
    padding: 6,
  },
  editText: {
    fontSize: 16,
  },
});