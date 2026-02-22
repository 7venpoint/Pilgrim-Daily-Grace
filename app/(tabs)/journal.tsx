import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { JournalEntry } from '@/contexts/AppContext';

const moodIcons: Record<string, { icon: string; color: string }> = {
  grateful: { icon: 'heart', color: '#C44536' },
  hopeful: { icon: 'sunny', color: '#C8963E' },
  reflective: { icon: 'water', color: '#4A6FA5' },
  seeking: { icon: 'compass', color: '#7B5EA7' },
  praising: { icon: 'musical-notes', color: '#2D5A3D' },
};

export default function JournalScreen() {
  const { theme, isDark, journalEntries, deleteJournalEntry } = useApp();
  const insets = useSafeAreaInsets();

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to remove this prayer journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteJournalEntry(id);
          },
        },
      ]
    );
  };

  const renderEntry = ({ item, index }: { item: JournalEntry; index: number }) => {
    const mood = moodIcons[item.mood] || moodIcons.reflective;
    const date = new Date(item.date);
    return (
      <Animated.View entering={FadeIn.duration(300).delay(index * 60)}>
        <Pressable
          onLongPress={() => handleDelete(item.id)}
          style={({ pressed }) => [
            styles.entryCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.entryHeader}>
            <View style={[styles.moodBadge, { backgroundColor: `${mood.color}18` }]}>
              <Ionicons name={mood.icon as any} size={16} color={mood.color} />
            </View>
            <View style={styles.entryMeta}>
              <Text style={[styles.entryTitle, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
                {item.title}
              </Text>
              <Text style={[styles.entryDate, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.entryContent, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}
            numberOfLines={3}
          >
            {item.content}
          </Text>
          {item.category ? (
            <View style={[styles.categoryTag, { backgroundColor: theme.tintLight }]}>
              <Text style={[styles.categoryTagText, { color: theme.tint, fontFamily: 'Inter_500Medium' }]}>
                {item.category}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerArea, { paddingTop: insets.top + webTopInset + 16 }]}>
        <View>
          <Text style={[styles.title, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
            Prayer Journal
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/journal/new');
          }}
          style={[styles.addButton, { backgroundColor: theme.tint }]}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={journalEntries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
          journalEntries.length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!journalEntries.length}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
              Start Your Prayer Journey
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              Write your first prayer, reflection, or gratitude entry to begin building your spiritual journal.
            </Text>
            <Pressable
              onPress={() => router.push('/journal/new')}
              style={[styles.emptyButton, { backgroundColor: theme.tint }]}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={[styles.emptyButtonText, { fontFamily: 'Inter_600SemiBold' }]}>Write First Entry</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerArea: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  addButton: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20 },
  entryCard: { borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1 },
  entryHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  moodBadge: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  entryMeta: { flex: 1 },
  entryTitle: { fontSize: 16, marginBottom: 2 },
  entryDate: { fontSize: 12 },
  entryContent: { fontSize: 14, lineHeight: 22, marginBottom: 10 },
  categoryTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryTagText: { fontSize: 12 },
  emptyContainer: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  emptyButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 14 },
  emptyButtonText: { color: '#fff', fontSize: 15 },
});
