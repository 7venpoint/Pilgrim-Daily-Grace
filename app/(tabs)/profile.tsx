import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { badges as allBadges, Badge } from '@/constants/badges';

export default function ProfileScreen() {
  const {
    theme, isDark, themeMode, setThemeMode,
    stats, earnedBadges, growthScore, currentLevel, levelProgress,
  } = useApp();
  const insets = useSafeAreaInsets();

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const growthDimensions = [
    { label: 'Consistency', value: growthScore.consistency, icon: 'flame-outline', color: '#C8963E' },
    { label: 'Reflection', value: growthScore.reflectionDepth, icon: 'bulb-outline', color: '#4A6FA5' },
    { label: 'Prayer', value: growthScore.prayerEngagement, icon: 'heart-outline', color: '#C44536' },
    { label: 'Scripture', value: growthScore.scriptureMemorization, icon: 'book-outline', color: '#2D5A3D' },
    { label: 'Community', value: growthScore.communityParticipation, icon: 'people-outline', color: '#7B5EA7' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Text style={[styles.title, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
          Your Journey
        </Text>

        <Animated.View entering={FadeIn.duration(400)}>
          <LinearGradient
            colors={isDark ? ['#1E2A3A', '#162030'] : ['#1B2838', '#2D4050']}
            style={styles.levelCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.levelHeader}>
              <View>
                <Text style={[styles.levelLabel, { fontFamily: 'Inter_500Medium' }]}>LEVEL {currentLevel.level}</Text>
                <Text style={[styles.levelName, { fontFamily: 'Inter_700Bold' }]}>{currentLevel.name}</Text>
              </View>
              <View style={styles.scoreCircle}>
                <Text style={[styles.scoreNumber, { fontFamily: 'Inter_700Bold' }]}>{growthScore.total}</Text>
                <Text style={[styles.scoreLabel, { fontFamily: 'Inter_400Regular' }]}>pts</Text>
              </View>
            </View>
            <View style={styles.levelProgressBg}>
              <View style={[styles.levelProgressFill, { width: `${Math.max(levelProgress * 100, 2)}%` }]} />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(100)} style={styles.statsRow}>
          <StatBox label="Current Streak" value={`${stats.currentStreak}`} icon="flame-outline" color={theme.streak} theme={theme} />
          <StatBox label="Best Streak" value={`${stats.longestStreak}`} icon="trophy-outline" color={theme.tint} theme={theme} />
          <StatBox label="Affirmations" value={`${stats.totalAffirmationsRead}`} icon="sunny-outline" color={theme.accent} theme={theme} />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
              Growth Insights
            </Text>
            {growthDimensions.map((dim, i) => (
              <View key={dim.label} style={styles.dimensionRow}>
                <View style={styles.dimensionLabel}>
                  <Ionicons name={dim.icon as any} size={18} color={dim.color} />
                  <Text style={[styles.dimensionText, { color: theme.text, fontFamily: 'Inter_500Medium' }]}>
                    {dim.label}
                  </Text>
                </View>
                <View style={styles.dimensionBarContainer}>
                  <View style={[styles.dimensionBarBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                    <View style={[styles.dimensionBarFill, { width: `${Math.max(dim.value, 2)}%`, backgroundColor: dim.color }]} />
                  </View>
                  <Text style={[styles.dimensionValue, { color: theme.textSecondary, fontFamily: 'Inter_600SemiBold' }]}>
                    {dim.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(300)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
              Badges ({earnedBadges.length}/{allBadges.length})
            </Text>
            <View style={styles.badgeGrid}>
              {allBadges.map(badge => {
                const earned = earnedBadges.some(b => b.id === badge.id);
                return (
                  <View key={badge.id} style={[styles.badgeItem, !earned && styles.badgeLocked]}>
                    <View style={[
                      styles.badgeIcon,
                      {
                        backgroundColor: earned
                          ? (isDark ? `${theme.tint}30` : `${theme.tint}18`)
                          : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                      },
                    ]}>
                      <Ionicons
                        name={badge.icon as any}
                        size={22}
                        color={earned ? theme.tint : theme.textTertiary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.badgeName,
                        {
                          color: earned ? theme.text : theme.textTertiary,
                          fontFamily: 'Inter_500Medium',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {badge.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(400)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
              Appearance
            </Text>
            {(['system', 'light', 'dark'] as const).map(mode => (
              <Pressable
                key={mode}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode(mode);
                }}
                style={[styles.themeOption, {
                  backgroundColor: themeMode === mode
                    ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)')
                    : 'transparent',
                  borderRadius: 12,
                }]}
              >
                <Ionicons
                  name={mode === 'system' ? 'phone-portrait-outline' : mode === 'light' ? 'sunny-outline' : 'moon-outline'}
                  size={20}
                  color={themeMode === mode ? theme.tint : theme.textSecondary}
                />
                <Text style={[
                  styles.themeOptionText,
                  {
                    color: themeMode === mode ? theme.text : theme.textSecondary,
                    fontFamily: themeMode === mode ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  }
                ]}>
                  {mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'}
                </Text>
                {themeMode === mode && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.tint} style={{ marginLeft: 'auto' }} />
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(500)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
              Activity Summary
            </Text>
            <SummaryRow icon="book-outline" label="Journal Entries" value={stats.journalEntries} theme={theme} />
            <SummaryRow icon="people-outline" label="Community Posts" value={stats.communityPosts} theme={theme} />
            <SummaryRow icon="heart-outline" label="Prayers Supported" value={stats.communitySupports} theme={theme} />
            <SummaryRow icon="school-outline" label="Verses Memorized" value={stats.versesMemorized} theme={theme} />
            <SummaryRow icon="document-text-outline" label="Devotionals Read" value={stats.devotionalsRead} theme={theme} />
            <SummaryRow icon="bulb-outline" label="Reflections Written" value={stats.reflectionsWritten} theme={theme} />
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
            Daily Grace v1.0
          </Text>
          <Text style={[styles.footerText, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
            Built by Sam Obayemi
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value, icon, color, theme }: {
  label: string; value: string; icon: string; color: string; theme: any;
}) {
  return (
    <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.statValue, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
    </View>
  );
}

function SummaryRow({ icon, label, value, theme }: {
  icon: string; label: string; value: number; theme: any;
}) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon as any} size={18} color={theme.textSecondary} />
      <Text style={[styles.summaryLabel, { color: theme.text, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  levelCard: { borderRadius: 20, padding: 24, marginBottom: 16 },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  levelLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: 1.5, marginBottom: 4 },
  levelName: { color: '#fff', fontSize: 24 },
  scoreCircle: { alignItems: 'center' },
  scoreNumber: { color: '#D4A853', fontSize: 32 },
  scoreLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  levelProgressBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' },
  levelProgressFill: { height: '100%', borderRadius: 3, backgroundColor: '#D4A853' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1 },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 11, textAlign: 'center' },
  section: { borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1 },
  sectionTitle: { fontSize: 18, marginBottom: 16 },
  dimensionRow: { marginBottom: 14 },
  dimensionLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  dimensionText: { fontSize: 14 },
  dimensionBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dimensionBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  dimensionBarFill: { height: '100%', borderRadius: 3 },
  dimensionValue: { fontSize: 13, width: 28, textAlign: 'right' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeItem: { width: '29%', flexGrow: 1, alignItems: 'center', gap: 6 },
  badgeLocked: { opacity: 0.5 },
  badgeIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  badgeName: { fontSize: 11, textAlign: 'center' },
  themeOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 4 },
  themeOptionText: { fontSize: 15 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 0 },
  summaryLabel: { flex: 1, fontSize: 15 },
  summaryValue: { fontSize: 16 },
  footer: { alignItems: 'center', marginTop: 16, gap: 4 },
  footerText: { fontSize: 12 },
});
