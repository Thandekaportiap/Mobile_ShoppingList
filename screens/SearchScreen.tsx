import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/useAppDispatch';
import { Colors } from '../constants/colors';
import { ShoppingList, Item } from '../types';

interface SearchResult {
  listId: string;
  listName: string;
  listEmoji: string;
  item: Item;
}

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const lists = useAppSelector(state => state.lists);
  const [query, setQuery] = useState('');

  // Search across all lists and items
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const found: SearchResult[] = [];

    lists.forEach((list: ShoppingList) => {
      list.items.forEach((item: Item) => {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);

        if (matchesName || matchesCategory || matchesNotes) {
          found.push({
            listId: list.id,
            listName: list.name,
            listEmoji: list.emoji,
            item,
          });
        }
      });
    });

    return found;
  }, [query, lists]);

  // Also search list names
  const matchingLists = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return lists.filter(l => l.name.toLowerCase().includes(q));
  }, [query, lists]);

  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const q = query.toLowerCase();
    const index = text.toLowerCase().indexOf(q);
    if (index === -1) return text;

    return (
      <>
        <Text style={styles.resultText}>{text.slice(0, index)}</Text>
        <Text style={styles.highlight}>{text.slice(index, index + query.length)}</Text>
        <Text style={styles.resultText}>{text.slice(index + query.length)}</Text>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find items across all your lists</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search items, categories, lists..."
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty State — no query */}
      {query.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Search your lists</Text>
          <Text style={styles.emptySubtitle}>
            Type to find items by name, category, or notes
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{lists.length}</Text>
              <Text style={styles.statLabel}>Lists</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {lists.reduce((acc, l) => acc + l.items.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {lists.reduce((acc, l) =>
                  acc + l.items.filter(i => i.purchased).length, 0
                )}
              </Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>
        </View>
      )}

      {/* No Results */}
      {query.length > 0 && results.length === 0 && matchingLists.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>😕</Text>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching with a different keyword
          </Text>
        </View>
      )}

      {/* Results */}
      {query.length > 0 && (results.length > 0 || matchingLists.length > 0) && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.listId}-${item.item.id}-${index}`}
          contentContainerStyle={styles.resultsList}
          ListHeaderComponent={
            <>
              {/* Matching Lists */}
              {matchingLists.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    LISTS ({matchingLists.length})
                  </Text>
                  {matchingLists.map(list => (
                    <TouchableOpacity
                      key={list.id}
                      style={styles.listResult}
                      onPress={() =>
                        navigation.navigate('ListDetail', { listId: list.id })
                      }
                    >
                      <Text style={styles.listEmoji}>{list.emoji}</Text>
                      <View style={styles.listResultInfo}>
                        <Text style={styles.listResultName}>
                          {highlight(list.name)}
                        </Text>
                        <Text style={styles.listResultCount}>
                          {list.items.length} items
                        </Text>
                      </View>
                      <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Items Header */}
              {results.length > 0 && (
                <Text style={styles.sectionTitle}>
                  ITEMS ({results.length})
                </Text>
              )}
            </>
          }
          renderItem={({ item }: { item: SearchResult }) => (
            <TouchableOpacity
              style={styles.itemResult}
              onPress={() =>
                navigation.navigate('ListDetail', { listId: item.listId })
              }
            >
              {/* List Source */}
              <View style={styles.itemSource}>
                <Text style={styles.itemSourceEmoji}>{item.listEmoji}</Text>
                <Text style={styles.itemSourceName}>{item.listName}</Text>
              </View>

              {/* Item Info */}
              <View style={styles.itemInfo}>
                <View style={styles.itemRow}>
                  <Text style={[
                    styles.itemName,
                    item.item.purchased && styles.itemNameDone
                  ]}>
                    {highlight(item.item.name)}
                  </Text>
                  {item.item.purchased && (
                    <View style={styles.doneBadge}>
                      <Text style={styles.doneBadgeText}>✓ Done</Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemMeta}>
                  {item.item.quantity ? (
                    <Text style={styles.metaText}>📦 {item.item.quantity}</Text>
                  ) : null}
                  {item.item.category ? (
                    <Text style={[styles.metaText, { color: Colors.accent }]}>
                      {highlight(item.item.category)}
                    </Text>
                  ) : null}
                </View>

                {item.item.notes ? (
                  <Text style={styles.itemNotes} numberOfLines={1}>
                    📝 {item.item.notes}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    marginHorizontal: 24,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  searchIcon: { fontSize: 16 },
  input: {
    flex: 1,
    color: Colors.white,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
  },
  clearBtn: {
    color: Colors.textSecondary,
    fontSize: 14,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
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
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
  resultsList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    letterSpacing: 2,
    marginBottom: 10,
  },
  listResult: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  listEmoji: { fontSize: 28 },
  listResultInfo: { flex: 1 },
  listResultName: {
    color: Colors.white,
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 15,
  },
  listResultCount: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  arrow: {
    color: Colors.primary,
    fontSize: 18,
    fontFamily: 'Poppins_800ExtraBold',
  },
  itemResult: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  itemSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  itemSourceEmoji: { fontSize: 14 },
  itemSourceName: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
  },
  itemInfo: { gap: 4 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins_800ExtraBold',
  },
  itemNameDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  doneBadge: {
    backgroundColor: 'rgba(0,200,83,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  doneBadgeText: {
    color: Colors.success,
    fontSize: 11,
    fontFamily: 'Poppins_800ExtraBold',
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  itemNotes: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
  },
  resultText: {
    color: Colors.white,
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 15,
  },
  highlight: {
    color: Colors.primary,
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 15,
    backgroundColor: 'rgba(255,77,0,0.15)',
  },
});