import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Share, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { getDailyDevotional } from '@/constants/affirmations';

function bibleRef(ref: string): string {
  return ref.trim().replace(/\s+/g, '+');
}

export default function DevotionalScreen() {
  const { theme, isDark, markDevotionalRead, writeReflection, stats } = useApp();
  const insets = useSafeAreaInsets();
  const devotional = getDailyDevotional();
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [saved, setSaved] = useState(false);

  const isRead = stats.readDevotionalIds.includes(devotional.id);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handleMarkRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markDevotionalRead(devotional.id);
  };

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    writeReflection(reflectionText.trim(), devotional.title);
    setSaved(true);
    setShowReflection(false);
    setReflectionText('');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${devotional.title}\n\n"${devotional.scripture}"\n- ${devotional.scriptureRef}\n\n${devotional.reflection}\n\nShared from Daily Grace`,
      });
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Ionicons name="chevron-back" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
          Devotional
        </Text>
        <Pressable onPress={handleShare} hitSlop={12}
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <Ionicons name="share-outline" size={20} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={[styles.title, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
            {devotional.title}
          </Text>

          <LinearGradient
            colors={isDark ? ['#1E1B4B', '#0C0A1A'] : ['#EDE9FE', '#DDD6FE']}
            style={styles.scriptureCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.scriptureIconBg, { backgroundColor: isDark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.12)' }]}>
              <Ionicons name="book-outline" size={20} color={theme.tint} />
            </View>
            <Text style={[styles.scriptureText, { color: theme.text, fontFamily: 'Inter_500Medium' }]}>
              "{devotional.scripture}"
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: '/(tabs)/bible', params: { ref: bibleRef(devotional.scriptureRef) } });
              }}
              style={styles.scriptureRefRow}
            >
              <Ionicons name="book" size={13} color={theme.tint} />
              <Text style={[styles.scriptureRef, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
                {devotional.scriptureRef}
              </Text>
              <Ionicons name="open-outline" size={13} color={theme.tint} />
            </Pressable>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(500).delay(200)}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
            Reflection
          </Text>
          <Text style={[styles.reflectionText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            {devotional.reflection}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(500).delay(400)}>
          <View style={[styles.prayerCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.prayerHeader}>
              <View style={[styles.prayerIconBg, { backgroundColor: isDark ? theme.accentLight : '#ECFDF5' }]}>
                <Ionicons name="heart-outline" size={16} color={theme.accent} />
              </View>
              <Text style={[styles.prayerLabel, { color: theme.accent, fontFamily: 'Inter_600SemiBold' }]}>
                PRAYER
              </Text>
            </View>
            <Text style={[styles.prayerText, { color: theme.text, fontFamily: 'Inter_400Regular' }]}>
              {devotional.prayer}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(500).delay(600)} style={styles.actions}>
          {!isRead && (
            <Pressable
              onPress={handleMarkRead}
              style={[styles.primaryButton, { backgroundColor: theme.tint }]}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={[styles.primaryButtonText, { fontFamily: 'Inter_600SemiBold' }]}>Mark as Read</Text>
            </Pressable>
          )}
          {isRead && (
            <View style={[styles.readBadge, { backgroundColor: theme.accentLight }]}>
              <Ionicons name="checkmark-circle" size={18} color={theme.accent} />
              <Text style={[styles.readBadgeText, { color: theme.accent, fontFamily: 'Inter_600SemiBold' }]}>
                Completed
              </Text>
            </View>
          )}

          {!showReflection && !saved && (
            <Pressable
              onPress={() => setShowReflection(true)}
              style={[styles.secondaryButton, { borderColor: theme.tint, backgroundColor: theme.tintLight }]}
            >
              <Ionicons name="create-outline" size={18} color={theme.tint} />
              <Text style={[styles.secondaryButtonText, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
                Write a Reflection
              </Text>
            </Pressable>
          )}

          {saved && (
            <View style={[styles.readBadge, { backgroundColor: theme.tintLight }]}>
              <Ionicons name="create" size={18} color={theme.tint} />
              <Text style={[styles.readBadgeText, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
                Reflection Saved
              </Text>
            </View>
          )}
        </Animated.View>

        {showReflection && (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.reflectionInput, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.reflectionInputLabel, { color: theme.textSecondary, fontFamily: 'Inter_500Medium' }]}>
                Your Reflection
              </Text>
              <TextInput
                style={[styles.reflectionTextInput, { color: theme.text, fontFamily: 'Inter_400Regular' }]}
                placeholder="What spoke to you today? Write your thoughts..."
                placeholderTextColor={theme.textTertiary}
                value={reflectionText}
                onChangeText={setReflectionText}
                multiline
                textAlignVertical="top"
                autoFocus
              />
              <View style={styles.reflectionActions}>
                <Pressable onPress={() => { setShowReflection(false); setReflectionText(''); }}>
                  <Text style={[styles.cancelText, { color: theme.textTertiary, fontFamily: 'Inter_500Medium' }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveReflection}
                  disabled={!reflectionText.trim()}
                  style={[styles.saveButton, { backgroundColor: reflectionText.trim() ? theme.tint : theme.border }]}
                >
                  <Text style={[styles.saveButtonText, { fontFamily: 'Inter_600SemiBold' }]}>Save</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 26, lineHeight: 34, marginBottom: 20 },
  scriptureCard: { borderRadius: 22, padding: 24, marginBottom: 28 },
  scriptureIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scriptureText: { fontSize: 18, lineHeight: 28, marginBottom: 12 },
  scriptureRefRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scriptureRef: { fontSize: 14 },
  sectionTitle: { fontSize: 20, marginBottom: 12 },
  reflectionText: { fontSize: 16, lineHeight: 28, marginBottom: 28 },
  prayerCard: { borderRadius: 18, padding: 20, borderWidth: 1, marginBottom: 24 },
  prayerHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  prayerIconBg: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  prayerLabel: { fontSize: 11, letterSpacing: 1.5 },
  prayerText: { fontSize: 15, lineHeight: 24 },
  actions: { gap: 12, marginBottom: 24 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontSize: 16 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16 },
  secondaryButtonText: { fontSize: 15 },
  readBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16 },
  readBadgeText: { fontSize: 15 },
  reflectionInput: { borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 24 },
  reflectionInputLabel: { fontSize: 13, marginBottom: 10 },
  reflectionTextInput: { fontSize: 15, lineHeight: 24, minHeight: 120 },
  reflectionActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  cancelText: { fontSize: 15 },
  saveButton: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  saveButtonText: { color: '#fff', fontSize: 14 },
});
