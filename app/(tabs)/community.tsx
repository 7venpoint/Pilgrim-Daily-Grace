import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { CommunityPrayer } from '@/contexts/AppContext';

export default function CommunityScreen() {
  const { theme, isDark, communityPrayers, addCommunityPrayer, supportPrayer } = useApp();
  const insets = useSafeAreaInsets();
  const [showInput, setShowInput] = useState(false);
  const [newPrayer, setNewPrayer] = useState('');

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const handleSubmit = () => {
    if (!newPrayer.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addCommunityPrayer(newPrayer.trim());
    setNewPrayer('');
    setShowInput(false);
  };

  const handleSupport = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    supportPrayer(id);
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderPrayer = ({ item, index }: { item: CommunityPrayer; index: number }) => (
    <Animated.View entering={FadeIn.duration(300).delay(index * 60)}>
      <View style={[styles.prayerCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.prayerHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.tintLight }]}>
            <Text style={[styles.avatarText, { color: theme.tint, fontFamily: 'Inter_700Bold' }]}>
              {item.author.charAt(0)}
            </Text>
          </View>
          <View style={styles.prayerMeta}>
            <Text style={[styles.authorName, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
              {item.author}
            </Text>
            <Text style={[styles.timeAgo, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
              {getTimeAgo(item.date)}
            </Text>
          </View>
        </View>
        <Text style={[styles.prayerText, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
          {item.text}
        </Text>
        <Pressable
          onPress={() => handleSupport(item.id)}
          disabled={item.supported}
          style={({ pressed }) => [
            styles.supportButton,
            {
              backgroundColor: item.supported
                ? (isDark ? theme.accentLight : '#E8F0EB')
                : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Ionicons
            name={item.supported ? 'hands-outline' : 'hands-outline'}
            size={16}
            color={item.supported ? theme.accent : theme.textTertiary}
          />
          <Text style={[
            styles.supportText,
            {
              color: item.supported ? theme.accent : theme.textTertiary,
              fontFamily: 'Inter_500Medium',
            }
          ]}>
            {item.supported ? 'Praying' : 'Pray'} ({item.supportCount})
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={[styles.headerArea, { paddingTop: insets.top + webTopInset + 16 }]}>
        <View>
          <Text style={[styles.title, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
            Prayer Wall
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            Lift each other up in prayer
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowInput(!showInput);
          }}
          style={[styles.addButton, { backgroundColor: theme.tint }]}
        >
          <Ionicons name={showInput ? 'close' : 'add'} size={24} color="#fff" />
        </Pressable>
      </View>

      {showInput && (
        <Animated.View entering={FadeIn.duration(200)} style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <TextInput
            style={[styles.input, { color: theme.text, fontFamily: 'Inter_400Regular' }]}
            placeholder="Share your prayer request..."
            placeholderTextColor={theme.textTertiary}
            value={newPrayer}
            onChangeText={setNewPrayer}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSubmit}
            disabled={!newPrayer.trim()}
            style={[
              styles.submitButton,
              {
                backgroundColor: newPrayer.trim() ? theme.tint : theme.border,
              },
            ]}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </Animated.View>
      )}

      <FlatList
        data={communityPrayers}
        renderItem={renderPrayer}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!communityPrayers.length}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerArea: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  addButton: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  inputContainer: { marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  input: { flex: 1, fontSize: 15, lineHeight: 22, maxHeight: 100, minHeight: 44 },
  submitButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20 },
  prayerCard: { borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1 },
  prayerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16 },
  prayerMeta: { flex: 1 },
  authorName: { fontSize: 15, marginBottom: 2 },
  timeAgo: { fontSize: 12 },
  prayerText: { fontSize: 15, lineHeight: 24, marginBottom: 14 },
  supportButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  supportText: { fontSize: 13 },
});
