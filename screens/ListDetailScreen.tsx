import React, { useState } from 'react';
// ✅ Replace with this
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { deleteList, togglePurchased } from '../store/slices/listsSlice';
import { Colors } from '../constants/colors';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import AddItemModal from '../components/AddItemModal';

export default function ListDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { listId } = route.params;

  const list = useAppSelector(state =>
    state.lists.find(l => l.id === listId)
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  if (!list) return null;

  const purchased = list.items.filter(i => i.purchased).length;
  const total = list.items.length;
  const progress = total > 0 ? purchased / total : 0;

  const handleDeleteList = () => {
    dispatch(deleteList(listId));
    navigation.goBack();
  };

  const pendingItems = list.items.filter(i => !i.purchased);
  const purchasedItems = list.items.filter(i => i.purchased);

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteList} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>🗑</Text>
        </TouchableOpacity>
      </View>

      {/* List Info */}
      <View style={styles.listInfo}>
        <Text style={styles.listEmoji}>{list.emoji}</Text>
        <Text style={styles.listName}>{list.name}</Text>
        <Text style={styles.listCount}>
          {total === 0 ? 'No items yet' : `${purchased} of ${total} items done`}
        </Text>

        {/* Progress Bar */}
        {total > 0 && (
          <View style={styles.progressBg}>
  <View style={[
    styles.progressFill,
    {
      flex: progress,
      backgroundColor: progress === 1 ? Colors.success : Colors.primary,
    }
  ]} />
  <View style={{ flex: 1 - progress }} />
</View>
        )}
      </View>

      {/* Items List */}
      <FlatList
        data={[...pendingItems, ...purchasedItems]}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the button below to add your first item
            </Text>
          </View>
        }
        renderItem={({ item }: { item: Item }) => (
          <ItemCard
            item={item}
            onToggle={() => dispatch(togglePurchased({ listId, itemId: item.id }))}
            onEdit={() => {
              setEditingItem(item);
              setModalVisible(true);
            }}
          />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingItem(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>+ Add Item</Text>
      </TouchableOpacity>

      <AddItemModal
        visible={modalVisible}
        listId={listId}
        editingItem={editingItem}
        onClose={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: Colors.primary,
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 15,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: { fontSize: 20 },
  listInfo: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  listEmoji: { fontSize: 52, marginBottom: 8 },
  listName: {
    color: Colors.white,
    fontSize: 26,
    fontFamily: 'Syne_800ExtraBold',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  listCount: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    marginBottom: 14,
  },
  progressBg: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 8,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Syne_800ExtraBold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Syne_800ExtraBold',
    letterSpacing: 0.5,
  },
});