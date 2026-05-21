import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingList } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  list: ShoppingList;
  onPress: () => void;
}

export default function ListCard({ list, onPress }: Props) {
  const total = list.items.length;
  const purchased = list.items.filter(i => i.purchased).length;
  const progress = total > 0 ? purchased / total : 0;
  const allDone = total > 0 && purchased === total;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{list.emoji}</Text>
        <View>
          <Text style={styles.name}>{list.name}</Text>
          <Text style={styles.count}>
            {total === 0 ? 'No items yet' : `${purchased}/${total} items done`}
          </Text>
          {/* Progress Bar */}
          {total > 0 && (
         <View style={styles.progressBg}>
  <View style={[
    styles.progressFill,
    {
      flex: progress, // ✅ use flex instead of width %
      backgroundColor: allDone ? Colors.success : Colors.primary,
    }
  ]} />
  <View style={{ flex: 1 - progress }} />
</View>
          )}
        </View>
      </View>
      <View style={[
        styles.badge,
        { backgroundColor: allDone ? Colors.success : Colors.primary }
      ]}>
        <Text style={styles.badgeText}>
          {allDone ? '✓' : `${total - purchased}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  emoji: { fontSize: 32 },
  name: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Syne_800ExtraBold',
    marginBottom: 2,
  },
  count: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
  },
  progressBg: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 13,
    
  },
});