import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Platform, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { categoryInfo, Category, getAffirmationsByCategory, Affirmation } from '@/constants/affirmations';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark, stats, markVerseMemorized, markAffirmationRead } = useApp();
  const insets = useSafeAreaInsets();

  const category = id as Category;
  const info = categoryInfo[category];
  const affirmationsList = getAffirmationsByCategory(category);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  if (!info) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Category not found</Text>
      </View>
    );
  }

  const iconColor = isDark ? info.darkColor : info.color;

  const handleShare = async (aff: Affirmation) => {
    try {
      await Share.share({
        message: `${aff.text}\n\n"${aff.verse}"\n- ${aff.verseRef}\n\nShared from Daily Grace`,
      });
    } catch (e) {}
  };

  const renderAffirmation = ({ item, index }: { item: Affirmation; index: number }) => {
    const isMemorized = stats.memorizedVerseIds.includes(item.id);
    return (
      <Animated.View entering={FadeIn.duration(300).delay(Math.min(index, 5) * 60)}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.dayBadgeRow}>
            <View style={[styles.dayBadge, { backgroundColor: isDark ? `${iconColor}20` : `${info.color}12` }]}>
              <Text style={[styles.dayBadgeText, { color: iconColor, fontFamily: 'Inter_600SemiBold' }]}>
                Day {item.day}
              </Text>
            </View>
          </View>
          <Text style={[styles.affirmationText, { color: theme.text, fontFamily: 'Inter_500Medium' }]}>
            {item.text}
          </Text>
          <View style={[styles.verseBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.verseText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              "{item.verse}"
            </Text>
            <Text style={[styles.verseRef, { color: iconColor, fontFamily: 'Inter_600SemiBold' }]}>
              {item.verseRef}
            </Text>
          </View>
          <View style={styles.cardActions}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                markVerseMemorized(item.id);
              }}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: isMemorized
                    ? (isDark ? `${iconColor}30` : `${info.color}12`)
                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons
                name={isMemorized ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={16}
                color={isMemorized ? iconColor : theme.textTertiary}
              />
              <Text style={[styles.actionText, {
                color: isMemorized ? iconColor : theme.textTertiary,
                fontFamily: 'Inter_500Medium',
              }]}>
                {isMemorized ? 'Memorized' : 'Mark Memorized'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleShare(item)}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="share-outline" size={16} color={theme.textTertiary} />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}
          style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Ionicons name="chevron-back" size={22} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.headerIconBg, { backgroundColor: isDark ? `${iconColor}20` : `${info.color}12` }]}>
            <Ionicons name={info.icon as any} size={18} color={iconColor} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
              {info.label}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
              {affirmationsList.length} daily affirmations
            </Text>
          </View>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={affirmationsList}
        renderItem={renderAffirmation}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!affirmationsList.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17 },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  listContent: { paddingHorizontal: 20, paddingTop: 8 },
  card: { borderRadius: 16, padding: 20, marginBottom: 14, borderWidth: 1 },
  dayBadgeRow: { marginBottom: 10 },
  dayBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  dayBadgeText: { fontSize: 11 },
  affirmationText: { fontSize: 16, lineHeight: 26, marginBottom: 14 },
  verseBox: { borderRadius: 12, padding: 14, marginBottom: 14 },
  verseText: { fontSize: 13, lineHeight: 20, fontStyle: 'italic', marginBottom: 6 },
  verseRef: { fontSize: 12 },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  actionText: { fontSize: 12 },
});
