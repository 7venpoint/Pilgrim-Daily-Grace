import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useApp } from '@/contexts/AppContext';
import { categoryInfo, Category, getAffirmationsByCategory } from '@/constants/affirmations';

export default function CategoriesScreen() {
  const { theme, isDark } = useApp();
  const insets = useSafeAreaInsets();
  const categories = Object.entries(categoryInfo) as [Category, typeof categoryInfo[Category]][];

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
        <Text style={[styles.title, { color: theme.text, fontFamily: 'Inter_700Bold' }]}>
          Categories
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: 'Inter_400Regular' }]}>
          Explore affirmations by area of life
        </Text>

        <View style={styles.grid}>
          {categories.map(([key, info], index) => {
            const count = getAffirmationsByCategory(key).length;
            const iconColor = isDark ? info.darkColor : info.color;
            return (
              <Animated.View key={key} entering={FadeIn.duration(400).delay(index * 80)} style={styles.gridItem}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({ pathname: '/category/[id]', params: { id: key } });
                  }}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.cardBorder,
                      opacity: pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: isDark ? `${iconColor}20` : `${info.color}12` }]}>
                    <Ionicons name={info.icon as any} size={28} color={iconColor} />
                  </View>
                  <Text style={[styles.categoryName, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>
                    {info.label}
                  </Text>
                  <Text style={[styles.categoryCount, { color: theme.textTertiary, fontFamily: 'Inter_400Regular' }]}>
                    {count} affirmations
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { fontSize: 15, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%', flexGrow: 1 },
  categoryCard: { borderRadius: 16, padding: 20, borderWidth: 1, minHeight: 150, justifyContent: 'flex-end' },
  iconContainer: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  categoryName: { fontSize: 15, marginBottom: 4 },
  categoryCount: { fontSize: 12 },
});
