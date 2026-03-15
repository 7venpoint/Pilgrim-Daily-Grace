import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { getDailyAffirmation, getDailyDevotional } from '@/constants/affirmations';

export default function HomeScreen() {
  const { theme, isDark, stats, markAffirmationRead, growthScore, currentLevel, levelProgress } = useApp();
  const insets = useSafeAreaInsets();
  const dailyAffirmation = getDailyAffirmation();
  const dailyDevotional = getDailyDevotional();
  const [affirmed, setAffirmed] = useState(false);

  const scaleValue = useSharedValue(1);
  const affirmScale = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handleAffirm = () => {
    if (affirmed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scaleValue.value = withSpring(1.05, {}, () => {
      scaleValue.value = withSpring(1);
    });
    markAffirmationRead();
    setAffirmed(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${dailyAffirmation.text}\n\n"${dailyAffirmation.verse}"\n- ${dailyAffirmation.verseRef}\n\nShared from Daily Grace`,
      });
    } catch (e) {}
  };

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary, fontFamily: 'Inter_500Medium' }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.dateText, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: theme.tintLight }]}>
            <Ionicons name="flame" size={18} color={theme.streak} />
            <Text style={[styles.streakText, { color: theme.streak, fontFamily: 'Inter_700Bold' }]}>
              {stats.currentStreak}
            </Text>
          </View>
        </View>

        <Animated.View entering={FadeIn.duration(500)}>
          <LinearGradient
            colors={isDark ? ['#1E1B4B', '#0C0A1A'] : ['#EDE9FE', '#DDD6FE']}
            style={styles.affirmationCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.affirmationHeader}>
              <View style={styles.affirmationHeaderLeft}>
                <Text style={[styles.cardLabel, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
                  TODAY'S AFFIRMATION
                </Text>
                <Text style={[styles.dayLabel, { color: theme.tint, fontFamily: 'Inter_500Medium' }]}>
                  Day {dailyAffirmation.day}
                </Text>
              </View>
              <Pressable onPress={handleShare} hitSlop={12}>
                <Ionicons name="share-outline" size={20} color={theme.tint} />
              </Pressable>
            </View>
            <Text style={[styles.affirmationText, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
              {dailyAffirmation.text}
            </Text>
            <View style={[styles.verseBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.06)' }]}>
              <Text style={[styles.verseText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                "{dailyAffirmation.verse}"
              </Text>
              <Text style={[styles.verseRef, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
                {dailyAffirmation.verseRef}
              </Text>
            </View>
            <Animated.View style={affirmScale}>
              <Pressable
                onPress={handleAffirm}
                style={[
                  styles.affirmButton,
                  { backgroundColor: affirmed ? theme.accent : theme.tint },
                ]}
              >
                {affirmed ? (
                  <View style={styles.affirmButtonInner}>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={[styles.affirmButtonText, { fontFamily: 'Inter_600SemiBold' }]}>Affirmed</Text>
                  </View>
                ) : (
                  <Text style={[styles.affirmButtonText, { fontFamily: 'Inter_600SemiBold' }]}>I Receive This</Text>
                )}
              </Pressable>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(500).delay(150)}>
          <Pressable
            onPress={() => router.push('/devotional')}
            style={({ pressed }) => [
              styles.devotionalCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <View style={styles.devotionalHeader}>
              <View style={[styles.devotionalIcon, { backgroundColor: theme.accentLight }]}>
                <Ionicons name="book-outline" size={18} color={theme.accent} />
              </View>
              <Text style={[styles.cardLabel, { color: theme.accent, fontFamily: 'Inter_600SemiBold' }]}>
                DAILY DEVOTIONAL
              </Text>
            </View>
            <Text style={[styles.devotionalTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
              {dailyDevotional.title}
            </Text>
            <Text style={[styles.devotionalPreview, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]} numberOfLines={2}>
              {dailyDevotional.reflection}
            </Text>
            <View style={styles.devotionalFooter}>
              <Text style={[styles.devotionalRef, { color: theme.tint, fontFamily: 'Inter_500Medium' }]}>
                {dailyDevotional.scriptureRef}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(500).delay(300)}>
          <View style={[styles.growthCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.growthCardHeader}>
              <Text style={[styles.cardLabel, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
                SPIRITUAL GROWTH
              </Text>
              <View style={[styles.levelPill, { backgroundColor: theme.tintLight }]}>
                <Text style={[styles.levelPillText, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>
                  Lv. {currentLevel.level} · {currentLevel.name}
                </Text>
              </View>
            </View>
            <View style={styles.growthRow}>
              <Text style={[styles.growthScoreNumber, { color: theme.tint, fontFamily: 'Inter_700Bold' }]}>
                {growthScore.total}
              </Text>
              <Text style={[styles.growthScoreLabel, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
                {' '}points
              </Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
              <View style={[styles.progressBarFill, { width: `${Math.max(levelProgress * 100, 2)}%`, backgroundColor: theme.tint }]} />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(500).delay(450)} style={styles.quickActions}>
          <QuickAction
            icon="book-outline"
            label="Journal"
            color={theme.accent}
            bg={theme.accentLight}
            onPress={() => router.push('/(tabs)/journal')}
          />
          <QuickAction
            icon="people-outline"
            label="Pray"
            color={theme.tint}
            bg={theme.tintLight}
            onPress={() => router.push('/(tabs)/community')}
          />
          <QuickAction
            icon="grid-outline"
            label="Browse"
            color="#0EA5E9"
            bg={isDark ? '#0C2A3A' : '#E0F2FE'}
            onPress={() => router.push('/(tabs)/categories')}
          />
          <QuickAction
            icon="person-outline"
            label="Profile"
            color={theme.streak}
            bg={isDark ? '#2A1A0A' : '#FFF7ED'}
            onPress={() => router.push('/(tabs)/profile')}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function QuickAction({ icon, label, color, bg, onPress }: {
  icon: string; label: string; color: string; bg: string; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.quickAction,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={[styles.quickActionLabel, { color, fontFamily: 'Inter_500Medium' }]}>{label}</Text>
    </Pressable>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 14, marginBottom: 4 },
  dateText: { fontSize: 20 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  streakText: { fontSize: 16 },
  affirmationCard: { borderRadius: 24, padding: 24, marginBottom: 14 },
  affirmationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  affirmationHeaderLeft: { gap: 3 },
  dayLabel: { fontSize: 12, opacity: 0.8 },
  cardLabel: { fontSize: 11, letterSpacing: 1.5 },
  affirmationText: { fontSize: 20, lineHeight: 30, marginBottom: 18 },
  verseBox: { borderRadius: 14, padding: 16, marginBottom: 18 },
  verseText: { fontSize: 14, lineHeight: 22, fontStyle: 'italic', marginBottom: 8 },
  verseRef: { fontSize: 13 },
  affirmButton: { borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  affirmButtonInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  affirmButtonText: { color: '#fff', fontSize: 16 },
  devotionalCard: { borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1 },
  devotionalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  devotionalIcon: { width: 32, height: 32, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  devotionalTitle: { fontSize: 18, marginBottom: 8, lineHeight: 24 },
  devotionalPreview: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  devotionalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  devotionalRef: { fontSize: 13 },
  growthCard: { borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1 },
  growthCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  levelPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  levelPillText: { fontSize: 12 },
  growthRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  growthScoreNumber: { fontSize: 32 },
  growthScoreLabel: { fontSize: 14 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  quickActions: { flexDirection: 'row', gap: 10 },
  quickAction: { flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center', gap: 6 },
  quickActionLabel: { fontSize: 12 },
});
