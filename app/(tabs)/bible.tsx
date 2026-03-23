import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, TextInput,
  Platform, FlatList, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';

interface BibleVerse {
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BiblePassage {
  reference: string;
  verses: BibleVerse[];
  translation_name: string;
}

const QUICK_REFS = [
  { label: 'John 3:16', ref: 'john+3:16' },
  { label: 'Psalm 23', ref: 'psalm+23' },
  { label: 'Romans 8:28', ref: 'romans+8:28' },
  { label: 'Phil 4:13', ref: 'philippians+4:13' },
  { label: 'Jer 29:11', ref: 'jeremiah+29:11' },
  { label: 'Isaiah 40:31', ref: 'isaiah+40:31' },
  { label: 'Prov 3:5-6', ref: 'proverbs+3:5-6' },
  { label: 'Matt 6:33', ref: 'matthew+6:33' },
];

const BOOKS = [
  { name: 'Genesis', ref: 'genesis+1' },
  { name: 'Psalms', ref: 'psalm+1' },
  { name: 'Proverbs', ref: 'proverbs+1' },
  { name: 'Isaiah', ref: 'isaiah+1' },
  { name: 'Matthew', ref: 'matthew+1' },
  { name: 'John', ref: 'john+1' },
  { name: 'Romans', ref: 'romans+1' },
  { name: 'Ephesians', ref: 'ephesians+1' },
  { name: 'Philippians', ref: 'philippians+1' },
  { name: 'Hebrews', ref: 'hebrews+1' },
  { name: 'James', ref: 'james+1' },
  { name: 'Revelation', ref: 'revelation+1' },
];

async function fetchPassage(ref: string): Promise<BiblePassage> {
  const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Passage not found');
  return res.json();
}

function formatSearchRef(input: string): string {
  return input.trim().replace(/\s+/g, '+');
}

export default function BibleScreen() {
  const { theme, isDark } = useApp();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ ref?: string }>();

  const [searchText, setSearchText] = useState('');
  const [passage, setPassage] = useState<BiblePassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const loadPassage = useCallback(async (ref: string) => {
    setLoading(true);
    setError('');
    setPassage(null);
    try {
      const data = await fetchPassage(ref);
      setPassage(data);
    } catch {
      setError('Passage not found. Try "John 3:16" or "Psalm 23".');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.ref) {
      const decoded = decodeURIComponent(params.ref);
      setSearchText(decoded.replace(/\+/g, ' '));
      loadPassage(params.ref);
    }
  }, [params.ref]);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadPassage(formatSearchRef(searchText));
  };

  const handleQuickRef = (ref: string, label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchText(label);
    loadPassage(ref);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
        <View>
          <Text style={[styles.title, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
            Holy Bible
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            King James Version
          </Text>
        </View>
        <View style={[styles.translationBadge, { backgroundColor: theme.tintLight }]}>
          <Text style={[styles.translationText, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
            KJV
          </Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? theme.surface : '#F3F4F6', borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontFamily: 'Inter_400Regular' }]}
            placeholder='Search e.g. "John 3:16" or "Psalm 23"'
            placeholderTextColor={theme.textTertiary}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => { setSearchText(''); setPassage(null); setError(''); }}>
              <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={handleSearch}
          style={[styles.searchBtn, { backgroundColor: theme.tint }]}
        >
          <Ionicons name="return-down-back" size={18} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        {!passage && !loading && !error && (
          <>
            <Animated.View entering={FadeIn.duration(400)}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: 'Inter_600SemiBold' }]}>
                QUICK VERSES
              </Text>
              <View style={styles.quickGrid}>
                {QUICK_REFS.map(item => (
                  <Pressable
                    key={item.ref}
                    onPress={() => handleQuickRef(item.ref, item.label)}
                    style={({ pressed }) => [
                      styles.quickChip,
                      {
                        backgroundColor: isDark ? theme.surface : '#F8F9FF',
                        borderColor: theme.cardBorder,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.quickChipText, { color: theme.tint, fontFamily: 'Inter_500Medium' }]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(400).delay(150)}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: 'Inter_600SemiBold', marginTop: 24 }]}>
                BROWSE BOOKS
              </Text>
              <View style={styles.booksGrid}>
                {BOOKS.map(book => (
                  <Pressable
                    key={book.ref}
                    onPress={() => handleQuickRef(book.ref, book.name + ' 1')}
                    style={({ pressed }) => [
                      styles.bookCard,
                      {
                        backgroundColor: isDark ? theme.surface : '#FFFFFF',
                        borderColor: theme.cardBorder,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="book-outline" size={18} color={theme.tint} />
                    <Text style={[styles.bookName, { color: theme.text, fontFamily: 'Inter_500Medium' }]}>
                      {book.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </>
        )}

        {loading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={theme.tint} />
            <Text style={[styles.loadingText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              Loading passage...
            </Text>
          </View>
        )}

        {error ? (
          <View style={styles.centerState}>
            <Ionicons name="alert-circle-outline" size={40} color={theme.textTertiary} />
            <Text style={[styles.errorText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              {error}
            </Text>
            <Pressable
              onPress={() => { setError(''); setSearchText(''); }}
              style={[styles.retryBtn, { backgroundColor: theme.tintLight }]}
            >
              <Text style={[styles.retryText, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>Try Again</Text>
            </Pressable>
          </View>
        ) : null}

        {passage && !loading && (
          <Animated.View entering={FadeIn.duration(400)}>
            <View style={[styles.passageCard, { backgroundColor: isDark ? theme.surface : '#FFFFFF', borderColor: theme.cardBorder }]}>
              <View style={styles.passageHeader}>
                <Text style={[styles.passageRef, { color: theme.tint, fontFamily: 'Inter_700Bold' }]}>
                  {passage.reference}
                </Text>
                <Pressable
                  onPress={() => { setPassage(null); setSearchText(''); }}
                  hitSlop={12}
                >
                  <Ionicons name="close" size={20} color={theme.textTertiary} />
                </Pressable>
              </View>

              {passage.verses.map((v, i) => (
                <View key={`${v.chapter}:${v.verse}`} style={styles.verseRow}>
                  <Text style={[styles.verseNum, { color: theme.tint, fontFamily: 'Inter_700Bold' }]}>
                    {passage.verses.length > 1 ? v.verse : ''}
                  </Text>
                  <Text style={[styles.verseText, { color: theme.text, fontFamily: passage.verses.length === 1 ? 'Inter_500Medium' : 'Inter_400Regular' }]}>
                    {v.text.trim()}
                  </Text>
                </View>
              ))}

              <Text style={[styles.translationLabel, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
                {passage.translation_name}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: 'Inter_600SemiBold', marginTop: 20 }]}>
              RELATED VERSES
            </Text>
            <View style={styles.quickGrid}>
              {QUICK_REFS.filter(r => !passage.reference.toLowerCase().includes(r.label.split(' ')[0].toLowerCase())).slice(0, 4).map(item => (
                <Pressable
                  key={item.ref}
                  onPress={() => handleQuickRef(item.ref, item.label)}
                  style={({ pressed }) => [
                    styles.quickChip,
                    { backgroundColor: isDark ? theme.surface : '#F8F9FF', borderColor: theme.cardBorder, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.quickChipText, { color: theme.tint, fontFamily: 'Inter_500Medium' }]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  translationBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  translationText: { fontSize: 13 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 48, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  searchBtn: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.5, marginBottom: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  quickChipText: { fontSize: 13 },
  booksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bookCard: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, width: '47%' },
  bookName: { fontSize: 14 },
  centerState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 16 },
  loadingText: { fontSize: 15 },
  errorText: { fontSize: 15, textAlign: 'center', paddingHorizontal: 20 },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  retryText: { fontSize: 15 },
  passageCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 16 },
  passageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  passageRef: { fontSize: 20 },
  verseRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  verseNum: { fontSize: 12, minWidth: 20, paddingTop: 4 },
  verseText: { flex: 1, fontSize: 17, lineHeight: 28 },
  translationLabel: { fontSize: 12, marginTop: 16 },
});
