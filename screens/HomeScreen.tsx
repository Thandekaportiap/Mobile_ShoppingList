import React, { useState } from 'react';
// ✅ Replace with this
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/useAppDispatch';
import { Colors } from '../constants/colors';
import { ShoppingList } from '../types';
import ListCard from '../components/ListCard';
import AddListModal from '../components/AddListModal';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const lists = useAppSelector(state => state.lists);
  const [modalVisible, setModalVisible] = useState(false);

  const totalItems = lists.reduce((acc, l) => acc + l.items.length, 0);
  const pendingItems = lists.reduce(
    (acc, l) => acc + l.items.filter(i => !i.purchased).length, 0
  );

  return (
    <SafeAreaView style={styles.container}>
      

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day! 👋</Text>
          <Text style={styles.title}>My Lists</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>TP</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{lists.length}</Text>
          <Text style={styles.statLabel}>Lists</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.primary }]}>
          <Text style={[styles.statNumber, { color: Colors.primary }]}>
            {pendingItems}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* List */}
      {lists.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>No lists yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the button below to create your first shopping list
          </Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: ShoppingList }) => (
            <ListCard
              list={item}
              onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+ New List</Text>
      </TouchableOpacity>

      <AddListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -0.5,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statNumber: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: 'Poppins_800ExtraBold',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Poppins_800ExtraBold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 22,
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
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: 0.5,
  },
});