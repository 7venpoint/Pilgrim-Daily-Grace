import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/contexts/AppContext';

const moods = [
  { key: 'grateful', label: 'Grateful', icon: 'heart', color: '#C44536' },
  { key: 'hopeful', label: 'Hopeful', icon: 'sunny', color: '#C8963E' },
  { key: 'reflective', label: 'Reflective', icon: 'water', color: '#4A6FA5' },
  { key: 'seeking', label: 'Seeking', icon: 'compass', color: '#7B5EA7' },
  { key: 'praising', label: 'Praising', icon: 'musical-notes', color: '#2D5A3D' },
] as const;

const categories = ['Prayer', 'Gratitude', 'Confession', 'Intercession', 'Reflection', 'Scripture Meditation'];

export default function NewJournalEntryScreen() {
  const { theme, isDark, addJournalEntry } = useApp();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<typeof moods[number]['key']>('reflective');
  const [selectedCategory, setSelectedCategory] = useState('Prayer');

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const canSave = title.trim() && content.trim();

  const handleSave = () => {
    if (!canSave) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      mood: selectedMood,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
          New Entry
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          hitSlop={12}
        >
          <Ionicons name="checkmark" size={28} color={canSave ? theme.tint : theme.textTertiary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={[styles.titleInput, { color: theme.text, fontFamily: 'Inter_600SemiBold', borderBottomColor: theme.border }]}
          placeholder="Title your prayer..."
          placeholderTextColor={theme.textTertiary}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: 'Inter_500Medium' }]}>
          How are you feeling?
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
          {moods.map(mood => (
            <Pressable
              key={mood.key}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedMood(mood.key);
              }}
              style={[
                styles.moodChip,
                {
                  backgroundColor: selectedMood === mood.key
                    ? `${mood.color}${isDark ? '30' : '15'}`
                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                  borderColor: selectedMood === mood.key ? mood.color : 'transparent',
                  borderWidth: 1,
                },
              ]}
            >
              <Ionicons
                name={mood.icon as any}
                size={16}
                color={selectedMood === mood.key ? mood.color : theme.textTertiary}
              />
              <Text style={[
                styles.moodText,
                {
                  color: selectedMood === mood.key ? mood.color : theme.textTertiary,
                  fontFamily: selectedMood === mood.key ? 'Inter_600SemiBold' : 'Inter_400Regular',
                }
              ]}>
                {mood.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: 'Inter_500Medium' }]}>
          Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(cat => (
            <Pressable
              key={cat}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedCategory(cat);
              }}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === cat
                    ? theme.tintLight
                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                  borderColor: selectedCategory === cat ? theme.tint : 'transparent',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[
                styles.categoryChipText,
                {
                  color: selectedCategory === cat ? theme.tint : theme.textTertiary,
                  fontFamily: selectedCategory === cat ? 'Inter_600SemiBold' : 'Inter_400Regular',
                }
              ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextInput
          style={[styles.contentInput, {
            color: theme.text,
            fontFamily: 'Inter_400Regular',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
          }]}
          placeholder="Pour out your heart in prayer, gratitude, or reflection..."
          placeholderTextColor={theme.textTertiary}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 17 },
  scrollContent: { paddingHorizontal: 20 },
  titleInput: { fontSize: 22, paddingVertical: 16, borderBottomWidth: 1, marginBottom: 20 },
  sectionLabel: { fontSize: 13, letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' },
  moodScroll: { marginBottom: 20 },
  moodChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  moodText: { fontSize: 13 },
  categoryScroll: { marginBottom: 20 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  categoryChipText: { fontSize: 13 },
  contentInput: { fontSize: 16, lineHeight: 26, minHeight: 200, borderRadius: 16, padding: 18 },
});
