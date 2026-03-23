import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, TextInput, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { badges as allBadges } from '@/constants/badges';
import { Reflection } from '@/contexts/AppContext';

export default function ProfileScreen() {
  const {
    theme, isDark, themeMode, setThemeMode,
    userName, setUserName,
    stats, earnedBadges, growthScore, currentLevel, levelProgress,
    reflections, deleteReflection,
  } = useApp();
  const { user: authUser, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const displayName = (isAuthenticated && authUser?.name) ? authUser.name : (userName.trim() || 'Believer');
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const handleSaveName = () => {
    setUserName(nameInput.trim());
    setEditingName(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteReflection = (id: string) => {
    Alert.alert('Delete Reflection', 'Remove this reflection?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteReflection(id);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Animated.View entering={FadeIn.duration(400)}>
          <LinearGradient
            colors={isDark ? ['#1E1B4B', '#0C0A1A'] : ['#EDE9FE', '#DDD6FE']}
            style={styles.profileHero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarRow}>
              <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
                <Text style={[styles.avatarText, { fontFamily: 'Inter_700Bold' }]}>{initials}</Text>
              </View>
              <View style={styles.heroInfo}>
                <Pressable onPress={() => { setNameInput(userName); setEditingName(true); }} style={styles.nameRow}>
                  <Text style={[styles.heroName, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
                    {displayName}
                  </Text>
                  <View style={[styles.editBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)' }]}>
                    <Ionicons name="pencil" size={12} color={theme.tint} />
                  </View>
                </Pressable>
                <Text style={[styles.heroSub, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  Level {currentLevel.level} · {currentLevel.name}
                </Text>
              </View>
            </View>

            <View style={[styles.levelProgressBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(124,58,237,0.15)' }]}>
              <View style={[styles.levelProgressFill, { width: `${Math.max(levelProgress * 100, 2)}%`, backgroundColor: theme.tint }]} />
            </View>
            <View style={styles.heroStatsRow}>
              <HeroStat label="Streak" value={`${stats.currentStreak}d`} icon="flame" color="#EA580C" theme={theme} isDark={isDark} />
              <View style={[styles.heroStatDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]} />
              <HeroStat label="Affirmations" value={`${stats.totalAffirmationsRead}`} icon="sunny" color={theme.tint} theme={theme} isDark={isDark} />
              <View style={[styles.heroStatDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]} />
              <HeroStat label="Points" value={`${growthScore.total}`} icon="star" color="#F59E0B" theme={theme} isDark={isDark} />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(150)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBg, { backgroundColor: theme.tintLight }]}>
                <Ionicons name="create-outline" size={16} color={theme.tint} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
                My Reflections
              </Text>
              <Text style={[styles.sectionCount, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
                {reflections.length}
              </Text>
            </View>

            {reflections.length === 0 ? (
              <View style={styles.emptyReflections}>
                <Ionicons name="journal-outline" size={32} color={theme.textTertiary} />
                <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  Your saved reflections from daily devotionals will appear here.
                </Text>
              </View>
            ) : (
              reflections.map((r, i) => (
                <ReflectionCard
                  key={r.id}
                  reflection={r}
                  theme={theme}
                  isDark={isDark}
                  onDelete={() => handleDeleteReflection(r.id)}
                  isLast={i === reflections.length - 1}
                />
              ))
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(250)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBg, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="trophy-outline" size={16} color="#EA580C" />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
                Badges
              </Text>
              <Text style={[styles.sectionCount, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
                {earnedBadges.length}/{allBadges.length}
              </Text>
            </View>
            <View style={styles.badgeGrid}>
              {allBadges.map(badge => {
                const earned = earnedBadges.some(b => b.id === badge.id);
                return (
                  <View key={badge.id} style={[styles.badgeItem, !earned && styles.badgeLocked]}>
                    <View style={[
                      styles.badgeIcon,
                      {
                        backgroundColor: earned
                          ? (isDark ? `${theme.tint}25` : `${theme.tint}15`)
                          : (isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB'),
                        borderWidth: 1,
                        borderColor: earned ? `${theme.tint}30` : theme.cardBorder,
                      },
                    ]}>
                      <Ionicons name={badge.icon as any} size={22} color={earned ? theme.tint : theme.textTertiary} />
                    </View>
                    <Text style={[styles.badgeName, { color: earned ? theme.text : theme.textTertiary, fontFamily: 'Inter_500Medium' }]} numberOfLines={1}>
                      {badge.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(350)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBg, { backgroundColor: theme.accentLight }]}>
                <Ionicons name="bar-chart-outline" size={16} color={theme.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
                Activity
              </Text>
            </View>
            <SummaryRow icon="book-outline" label="Journal Entries" value={stats.journalEntries} theme={theme} color={theme.accent} />
            <SummaryRow icon="heart-outline" label="Prayers Supported" value={stats.communitySupports} theme={theme} color="#EF4444" />
            <SummaryRow icon="school-outline" label="Verses Memorized" value={stats.versesMemorized} theme={theme} color="#F59E0B" />
            <SummaryRow icon="document-text-outline" label="Devotionals Read" value={stats.devotionalsRead} theme={theme} color={theme.tint} />
            <SummaryRow icon="create-outline" label="Reflections Written" value={stats.reflectionsWritten} theme={theme} color="#0EA5E9" isLast />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(450)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBg, { backgroundColor: isDark ? '#1C1A2E' : '#F5F3FF' }]}>
                <Ionicons name="color-palette-outline" size={16} color={theme.tint} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
                Appearance
              </Text>
            </View>
            {(['system', 'light', 'dark'] as const).map(mode => (
              <Pressable
                key={mode}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode(mode);
                }}
                style={[styles.themeOption, {
                  backgroundColor: themeMode === mode
                    ? (isDark ? 'rgba(167,139,250,0.12)' : 'rgba(124,58,237,0.06)')
                    : 'transparent',
                }]}
              >
                <View style={[styles.themeOptionIcon, {
                  backgroundColor: themeMode === mode ? theme.tintLight : (isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6'),
                }]}>
                  <Ionicons
                    name={mode === 'system' ? 'phone-portrait-outline' : mode === 'light' ? 'sunny-outline' : 'moon-outline'}
                    size={18}
                    color={themeMode === mode ? theme.tint : theme.textSecondary}
                  />
                </View>
                <Text style={[styles.themeOptionText, {
                  color: themeMode === mode ? theme.text : theme.textSecondary,
                  fontFamily: themeMode === mode ? 'Inter_600SemiBold' : 'Inter_400Regular',
                }]}>
                  {mode === 'system' ? 'System Default' : mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Text>
                {themeMode === mode && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.tint} style={{ marginLeft: 'auto' }} />
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(400).delay(250)}>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBg, { backgroundColor: isAuthenticated ? theme.accentLight : theme.tintLight }]}>
                <Ionicons name={isAuthenticated ? 'person-circle-outline' : 'log-in-outline'} size={16} color={isAuthenticated ? theme.accent : theme.tint} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
                Replit Account
              </Text>
            </View>

            {isAuthenticated && authUser ? (
              <View>
                <View style={[styles.authRow, { borderColor: theme.border }]}>
                  <View style={[styles.authAvatar, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.authAvatarText, { fontFamily: 'Inter_700Bold' }]}>
                      {authUser.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.authName, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
                      {authUser.name}
                    </Text>
                    {!!authUser.email && (
                      <Text style={[styles.authEmail, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                        {authUser.email}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.connectedBadge, { backgroundColor: theme.accentLight }]}>
                    <Ionicons name="checkmark-circle" size={14} color={theme.accent} />
                    <Text style={[styles.connectedText, { color: theme.accent, fontFamily: 'Inter_600SemiBold' }]}>Connected</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    Alert.alert('Sign Out', 'Sign out of your Replit account?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Sign Out', style: 'destructive', onPress: logout },
                    ]);
                  }}
                  style={[styles.authBtn, { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.06)' }]}
                >
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  <Text style={[styles.authBtnText, { color: '#EF4444', fontFamily: 'Inter_600SemiBold' }]}>Sign Out</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text style={[styles.authHint, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  Sign in with your Replit account to sync your progress and access your profile across devices.
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    login();
                  }}
                  style={[styles.authBtn, { borderColor: theme.tint, backgroundColor: theme.tintLight }]}
                >
                  <Ionicons name="log-in-outline" size={18} color={theme.tint} />
                  <Text style={[styles.authBtnText, { color: theme.tint, fontFamily: 'Inter_600SemiBold' }]}>Sign in with Replit</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>Daily Grace v1.0</Text>
          <Text style={[styles.footerText, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>Built by Sam Obayemi</Text>
        </View>
      </ScrollView>

      <Modal visible={editingName} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>Your Name</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB', fontFamily: 'Inter_400Regular' }]}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
              placeholderTextColor={theme.textTertiary}
              autoFocus
              maxLength={40}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setEditingName(false)} style={[styles.modalCancelBtn, { borderColor: theme.border }]}>
                <Text style={[styles.modalCancelText, { color: theme.textSecondary, fontFamily: 'Inter_500Medium' }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveName} style={[styles.modalSaveBtn, { backgroundColor: theme.tint }]}>
                <Text style={[styles.modalSaveText, { fontFamily: 'Inter_600SemiBold' }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function HeroStat({ label, value, icon, color, theme, isDark }: {
  label: string; value: string; icon: string; color: string; theme: any; isDark: boolean;
}) {
  return (
    <View style={styles.heroStat}>
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.heroStatValue, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>{value}</Text>
      <Text style={[styles.heroStatLabel, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
    </View>
  );
}

function ReflectionCard({ reflection, theme, isDark, onDelete, isLast }: {
  reflection: Reflection; theme: any; isDark: boolean; onDelete: () => void; isLast: boolean;
}) {
  const date = new Date(reflection.date);
  return (
    <View style={[styles.reflectionCard, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.cardBorder }]}>
      <View style={styles.reflectionCardHeader}>
        <View>
          <Text style={[styles.reflectionCardTitle, { color: theme.textTertiary, fontFamily: 'Inter_500Medium' }]} numberOfLines={1}>
            {reflection.devotionalTitle}
          </Text>
          <Text style={[styles.reflectionCardDate, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={12}>
          <Ionicons name="trash-outline" size={16} color={theme.textTertiary} />
        </Pressable>
      </View>
      <Text style={[styles.reflectionCardText, { color: theme.text, fontFamily: 'Inter_400Regular' }]} numberOfLines={4}>
        {reflection.text}
      </Text>
    </View>
  );
}

function SummaryRow({ icon, label, value, theme, color, isLast }: {
  icon: string; label: string; value: number; theme: any; color: string; isLast?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.cardBorder }]}>
      <View style={[styles.summaryIconBg, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
      <Text style={[styles.summaryLabel, { color: theme.text, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: theme.tint, fontFamily: 'Inter_700Bold' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  profileHero: { borderRadius: 24, padding: 24, marginBottom: 14 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 24 },
  heroInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  heroName: { fontSize: 22 },
  editBadge: { width: 22, height: 22, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  heroSub: { fontSize: 14 },
  levelProgressBg: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 20 },
  levelProgressFill: { height: '100%', borderRadius: 3 },
  heroStatsRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, alignItems: 'center', gap: 4 },
  heroStatValue: { fontSize: 20 },
  heroStatLabel: { fontSize: 11 },
  heroStatDivider: { width: 1, height: 36 },
  section: { borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  sectionIconBg: { width: 32, height: 32, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { flex: 1, fontSize: 17 },
  sectionCount: { fontSize: 14 },
  emptyReflections: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  emptyText: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  reflectionCard: { paddingVertical: 14 },
  reflectionCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  reflectionCardTitle: { fontSize: 12, marginBottom: 2 },
  reflectionCardDate: { fontSize: 11 },
  reflectionCardText: { fontSize: 14, lineHeight: 22 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeItem: { width: '29%', flexGrow: 1, alignItems: 'center', gap: 8 },
  badgeLocked: { opacity: 0.45 },
  badgeIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  badgeName: { fontSize: 11, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  summaryIconBg: { width: 32, height: 32, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  summaryLabel: { flex: 1, fontSize: 15 },
  summaryValue: { fontSize: 16 },
  themeOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 14, marginBottom: 4 },
  themeOptionIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  themeOptionText: { fontSize: 15, flex: 1 },
  authHint: { fontSize: 14, lineHeight: 22, marginBottom: 14 },
  authBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 14, borderWidth: 1 },
  authBtnText: { fontSize: 15 },
  authRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, marginBottom: 14, borderBottomWidth: 1 },
  authAvatar: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  authAvatarText: { color: '#fff', fontSize: 15 },
  authName: { fontSize: 15, marginBottom: 2 },
  authEmail: { fontSize: 12 },
  connectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  connectedText: { fontSize: 11 },
  footer: { alignItems: 'center', marginTop: 16, gap: 4 },
  footerText: { fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  modalCard: { width: '100%', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, marginBottom: 16 },
  modalInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 16, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, borderWidth: 1, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  modalCancelText: { fontSize: 15 },
  modalSaveBtn: { flex: 1, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  modalSaveText: { color: '#fff', fontSize: 15 },
});
