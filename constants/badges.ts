export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  threshold: number;
  type: 'streak' | 'journal' | 'community' | 'scripture' | 'devotional';
}

export interface Level {
  level: number;
  name: string;
  minScore: number;
  maxScore: number;
}

export const badges: Badge[] = [
  { id: 'first_light', name: 'First Light', description: 'Read your first daily affirmation', icon: 'sunny-outline', requirement: 'affirmations_read', threshold: 1, type: 'devotional' },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame-outline', requirement: 'streak', threshold: 7, type: 'streak' },
  { id: 'steadfast', name: 'Steadfast', description: 'Maintain a 30-day streak', icon: 'shield-outline', requirement: 'streak', threshold: 30, type: 'streak' },
  { id: 'unbreakable', name: 'Unbreakable', description: 'Maintain a 100-day streak', icon: 'diamond-outline', requirement: 'streak', threshold: 100, type: 'streak' },
  { id: 'prayer_starter', name: 'Prayer Starter', description: 'Write your first prayer journal entry', icon: 'book-outline', requirement: 'journal_entries', threshold: 1, type: 'journal' },
  { id: 'prayer_warrior', name: 'Prayer Warrior', description: 'Write 10 prayer journal entries', icon: 'bookmarks-outline', requirement: 'journal_entries', threshold: 10, type: 'journal' },
  { id: 'intercessor', name: 'Intercessor', description: 'Write 50 prayer journal entries', icon: 'library-outline', requirement: 'journal_entries', threshold: 50, type: 'journal' },
  { id: 'community_member', name: 'Community Member', description: 'Post your first prayer request', icon: 'people-outline', requirement: 'community_posts', threshold: 1, type: 'community' },
  { id: 'encourager', name: 'Encourager', description: 'Support 10 community prayers', icon: 'heart-outline', requirement: 'community_supports', threshold: 10, type: 'community' },
  { id: 'scripture_student', name: 'Scripture Student', description: 'Mark 5 verses as memorized', icon: 'school-outline', requirement: 'verses_memorized', threshold: 5, type: 'scripture' },
  { id: 'word_keeper', name: 'Word Keeper', description: 'Mark 20 verses as memorized', icon: 'ribbon-outline', requirement: 'verses_memorized', threshold: 20, type: 'scripture' },
  { id: 'devotion_seeker', name: 'Devotion Seeker', description: 'Read 7 devotionals', icon: 'telescope-outline', requirement: 'devotionals_read', threshold: 7, type: 'devotional' },
  { id: 'faithful_reader', name: 'Faithful Reader', description: 'Read 30 devotionals', icon: 'star-outline', requirement: 'devotionals_read', threshold: 30, type: 'devotional' },
  { id: 'deep_thinker', name: 'Deep Thinker', description: 'Write 10 devotional reflections', icon: 'bulb-outline', requirement: 'reflections_written', threshold: 10, type: 'devotional' },
];

export const levels: Level[] = [
  { level: 1, name: 'Seed', minScore: 0, maxScore: 49 },
  { level: 2, name: 'Sprout', minScore: 50, maxScore: 149 },
  { level: 3, name: 'Sapling', minScore: 150, maxScore: 299 },
  { level: 4, name: 'Growing Tree', minScore: 300, maxScore: 499 },
  { level: 5, name: 'Fruitful Tree', minScore: 500, maxScore: 749 },
  { level: 6, name: 'Mighty Oak', minScore: 750, maxScore: 999 },
  { level: 7, name: 'Ancient Cedar', minScore: 1000, maxScore: 1499 },
  { level: 8, name: 'Mountain of Faith', minScore: 1500, maxScore: 2499 },
  { level: 9, name: 'Pillar of Light', minScore: 2500, maxScore: 4999 },
  { level: 10, name: 'Crown of Glory', minScore: 5000, maxScore: 999999 },
];

export function getCurrentLevel(score: number): Level {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (score >= levels[i].minScore) {
      return levels[i];
    }
  }
  return levels[0];
}

export function getLevelProgress(score: number): number {
  const level = getCurrentLevel(score);
  const range = level.maxScore - level.minScore;
  const progress = score - level.minScore;
  return Math.min(progress / range, 1);
}

export function calculateGrowthScore(stats: {
  currentStreak: number;
  totalAffirmationsRead: number;
  journalEntries: number;
  communityPosts: number;
  communitySupports: number;
  versesMemorized: number;
  devotionalsRead: number;
  reflectionsWritten: number;
}): {
  total: number;
  consistency: number;
  reflectionDepth: number;
  prayerEngagement: number;
  scriptureMemorization: number;
  communityParticipation: number;
} {
  const consistency = Math.min(stats.currentStreak * 3 + stats.totalAffirmationsRead * 1, 100);
  const reflectionDepth = Math.min(stats.reflectionsWritten * 5 + stats.devotionalsRead * 2, 100);
  const prayerEngagement = Math.min(stats.journalEntries * 4, 100);
  const scriptureMemorization = Math.min(stats.versesMemorized * 8, 100);
  const communityParticipation = Math.min(stats.communityPosts * 5 + stats.communitySupports * 2, 100);

  const total = Math.round(
    consistency * 0.25 +
    reflectionDepth * 0.25 +
    prayerEngagement * 0.2 +
    scriptureMemorization * 0.15 +
    communityParticipation * 0.15
  );

  return {
    total: Math.round(total * stats.currentStreak * 0.1 + total),
    consistency,
    reflectionDepth,
    prayerEngagement,
    scriptureMemorization,
    communityParticipation,
  };
}
