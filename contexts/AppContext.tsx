import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import Colors, { ThemeColors } from '@/constants/colors';
import { badges as allBadges, Badge, calculateGrowthScore, getCurrentLevel, getLevelProgress, Level } from '@/constants/badges';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  mood: 'grateful' | 'hopeful' | 'reflective' | 'seeking' | 'praising';
}

export interface CommunityPrayer {
  id: string;
  text: string;
  author: string;
  date: string;
  supportCount: number;
  supported: boolean;
}

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalAffirmationsRead: number;
  journalEntries: number;
  communityPosts: number;
  communitySupports: number;
  versesMemorized: number;
  devotionalsRead: number;
  reflectionsWritten: number;
  memorizedVerseIds: string[];
  readDevotionalIds: string[];
}

interface AppContextValue {
  theme: ThemeColors;
  isDark: boolean;
  themeMode: 'system' | 'light' | 'dark';
  setThemeMode: (mode: 'system' | 'light' | 'dark') => void;
  stats: UserStats;
  journalEntries: JournalEntry[];
  communityPrayers: CommunityPrayer[];
  earnedBadges: Badge[];
  growthScore: ReturnType<typeof calculateGrowthScore>;
  currentLevel: Level;
  levelProgress: number;
  markAffirmationRead: () => void;
  markDevotionalRead: (id: string) => void;
  markVerseMemorized: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  deleteJournalEntry: (id: string) => void;
  addCommunityPrayer: (text: string) => void;
  supportPrayer: (id: string) => void;
  writeReflection: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  STATS: 'daily_grace_stats',
  JOURNAL: 'daily_grace_journal',
  COMMUNITY: 'daily_grace_community',
  THEME: 'daily_grace_theme',
};

const defaultStats: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalAffirmationsRead: 0,
  journalEntries: 0,
  communityPosts: 0,
  communitySupports: 0,
  versesMemorized: 0,
  devotionalsRead: 0,
  reflectionsWritten: 0,
  memorizedVerseIds: [],
  readDevotionalIds: [],
};

const sampleCommunityPrayers: CommunityPrayer[] = [
  { id: 'cp1', text: 'Please pray for my family during this season of transition. We are trusting God for direction and peace.', author: 'Grace M.', date: new Date(Date.now() - 3600000).toISOString(), supportCount: 24, supported: false },
  { id: 'cp2', text: 'Asking for healing prayers for my mother who is recovering from surgery. God is faithful.', author: 'David O.', date: new Date(Date.now() - 7200000).toISOString(), supportCount: 41, supported: false },
  { id: 'cp3', text: 'Praying for wisdom in a major career decision. I want to follow God\'s path, not my own.', author: 'Sarah K.', date: new Date(Date.now() - 14400000).toISOString(), supportCount: 18, supported: false },
  { id: 'cp4', text: 'Lord, strengthen the marriages in our community. Let love and grace overflow in every home.', author: 'Pastor James', date: new Date(Date.now() - 28800000).toISOString(), supportCount: 56, supported: false },
  { id: 'cp5', text: 'Prayers needed for the youth in our church. May they find purpose and identity in Christ.', author: 'Hannah B.', date: new Date(Date.now() - 43200000).toISOString(), supportCount: 33, supported: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<'system' | 'light' | 'dark'>('system');
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [communityPrayers, setCommunityPrayers] = useState<CommunityPrayer[]>(sampleCommunityPrayers);
  const [isLoading, setIsLoading] = useState(true);

  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedStats, savedJournal, savedCommunity, savedTheme] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STATS),
        AsyncStorage.getItem(STORAGE_KEYS.JOURNAL),
        AsyncStorage.getItem(STORAGE_KEYS.COMMUNITY),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
      ]);

      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats({ ...defaultStats, ...parsed });
        checkStreak({ ...defaultStats, ...parsed });
      }
      if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
      if (savedCommunity) setCommunityPrayers(JSON.parse(savedCommunity));
      if (savedTheme) setThemeModeState(savedTheme as 'system' | 'light' | 'dark');
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStreak = (currentStats: UserStats) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (currentStats.lastActiveDate === today) return;
    if (currentStats.lastActiveDate === yesterday) return;
    if (currentStats.lastActiveDate && currentStats.lastActiveDate !== today && currentStats.lastActiveDate !== yesterday) {
      const updated = { ...currentStats, currentStreak: 0 };
      setStats(updated);
      AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
    }
  };

  const saveStats = useCallback(async (newStats: UserStats) => {
    setStats(newStats);
    await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
  }, []);

  const updateStreak = useCallback((currentStats: UserStats): UserStats => {
    const today = new Date().toDateString();
    if (currentStats.lastActiveDate === today) return currentStats;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = currentStats.lastActiveDate === yesterday ? currentStats.currentStreak + 1 : 1;
    return {
      ...currentStats,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentStats.longestStreak),
      lastActiveDate: today,
    };
  }, []);

  const markAffirmationRead = useCallback(() => {
    const updated = updateStreak({ ...stats, totalAffirmationsRead: stats.totalAffirmationsRead + 1 });
    saveStats(updated);
  }, [stats, updateStreak, saveStats]);

  const markDevotionalRead = useCallback((id: string) => {
    if (stats.readDevotionalIds.includes(id)) return;
    const updated = updateStreak({
      ...stats,
      devotionalsRead: stats.devotionalsRead + 1,
      readDevotionalIds: [...stats.readDevotionalIds, id],
    });
    saveStats(updated);
  }, [stats, updateStreak, saveStats]);

  const markVerseMemorized = useCallback((id: string) => {
    if (stats.memorizedVerseIds.includes(id)) {
      const updated = {
        ...stats,
        versesMemorized: Math.max(0, stats.versesMemorized - 1),
        memorizedVerseIds: stats.memorizedVerseIds.filter(v => v !== id),
      };
      saveStats(updated);
      return;
    }
    const updated = updateStreak({
      ...stats,
      versesMemorized: stats.versesMemorized + 1,
      memorizedVerseIds: [...stats.memorizedVerseIds, id],
    });
    saveStats(updated);
  }, [stats, updateStreak, saveStats]);

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    AsyncStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));

    const updatedStats = updateStreak({ ...stats, journalEntries: stats.journalEntries + 1 });
    saveStats(updatedStats);
  }, [journalEntries, stats, updateStreak, saveStats]);

  const deleteJournalEntry = useCallback((id: string) => {
    const updated = journalEntries.filter(e => e.id !== id);
    setJournalEntries(updated);
    AsyncStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(updated));
  }, [journalEntries]);

  const addCommunityPrayer = useCallback((text: string) => {
    const newPrayer: CommunityPrayer = {
      id: Date.now().toString(),
      text,
      author: 'You',
      date: new Date().toISOString(),
      supportCount: 0,
      supported: false,
    };
    const updated = [newPrayer, ...communityPrayers];
    setCommunityPrayers(updated);
    AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(updated));

    const updatedStats = updateStreak({ ...stats, communityPosts: stats.communityPosts + 1 });
    saveStats(updatedStats);
  }, [communityPrayers, stats, updateStreak, saveStats]);

  const supportPrayer = useCallback((id: string) => {
    const updated = communityPrayers.map(p => {
      if (p.id === id && !p.supported) {
        return { ...p, supportCount: p.supportCount + 1, supported: true };
      }
      return p;
    });
    setCommunityPrayers(updated);
    AsyncStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(updated));

    const prayer = communityPrayers.find(p => p.id === id);
    if (prayer && !prayer.supported) {
      const updatedStats = { ...stats, communitySupports: stats.communitySupports + 1 };
      saveStats(updatedStats);
    }
  }, [communityPrayers, stats, saveStats]);

  const writeReflection = useCallback(() => {
    const updatedStats = updateStreak({ ...stats, reflectionsWritten: stats.reflectionsWritten + 1 });
    saveStats(updatedStats);
  }, [stats, updateStreak, saveStats]);

  const setThemeMode = useCallback((mode: 'system' | 'light' | 'dark') => {
    setThemeModeState(mode);
    AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
  }, []);

  const earnedBadges = useMemo(() => {
    return allBadges.filter(badge => {
      const val = (stats as Record<string, unknown>)[badge.requirement];
      if (typeof val === 'number') return val >= badge.threshold;
      if (badge.requirement === 'streak') return stats.currentStreak >= badge.threshold;
      return false;
    });
  }, [stats]);

  const growthScore = useMemo(() => calculateGrowthScore(stats), [stats]);
  const currentLevel = useMemo(() => getCurrentLevel(growthScore.total), [growthScore.total]);
  const levelProgress = useMemo(() => getLevelProgress(growthScore.total), [growthScore.total]);

  const value = useMemo(() => ({
    theme,
    isDark,
    themeMode,
    setThemeMode,
    stats,
    journalEntries,
    communityPrayers,
    earnedBadges,
    growthScore,
    currentLevel,
    levelProgress,
    markAffirmationRead,
    markDevotionalRead,
    markVerseMemorized,
    addJournalEntry,
    deleteJournalEntry,
    addCommunityPrayer,
    supportPrayer,
    writeReflection,
    isLoading,
  }), [theme, isDark, themeMode, setThemeMode, stats, journalEntries, communityPrayers, earnedBadges, growthScore, currentLevel, levelProgress, markAffirmationRead, markDevotionalRead, markVerseMemorized, addJournalEntry, deleteJournalEntry, addCommunityPrayer, supportPrayer, writeReflection, isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
