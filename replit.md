# Pilgrim's Daily Grace — replit.md

## Overview

**Pilgrim's Daily Grace** is a Christian devotional mobile app built with Expo/React Native. The app provides daily spiritual affirmations, devotionals, a prayer journal, community prayer wall, and gamified faith progression tracking. It targets iOS and Android (portrait orientation only), with web support as well.

Core features:
- **Daily Affirmations**: Rotating biblical affirmations across 10 spiritual categories (faith, healing, hope, etc.)
- **Devotionals**: Daily readings with scripture, reflection, and prayer
- **Prayer Journal**: Personal journal entries with mood tracking
- **Community Wall**: Shared prayer requests with support interactions
- **Growth Tracking**: Streaks, badges, levels, and a multi-dimensional growth score
- **Background Worship Music**: Streaming ambient worship tracks via expo-av

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Mobile App)
- **Framework**: Expo SDK ~54 with React Native 0.81, using the **Expo Router** file-based navigation system
- **Navigation structure**:
  - `app/(tabs)/` — six tab screens: Today (home), Categories, Bible, Journal, Community, Profile
  - `app/category/[id]` — dynamic category detail screen
  - `app/journal/new` — modal for creating journal entries
  - `app/devotional` — card-presentation devotional reader with tappable scripture references
- **Bible tab**: KJV Bible reader via bible-api.com (free, no auth). Supports reference search (e.g. "John 3:16"), quick verse chips, book browser, and auto-loading from devotional links via `?ref=` query param
- **UI approach**: Custom theming via `constants/colors.ts` with full light/dark mode support. Theme is driven by `AppContext` which respects system preference or manual override.
- **Fonts**: Inter (400, 500, 600, 700) loaded via `@expo-google-fonts/inter`
- **Animations**: `react-native-reanimated` for spring/fade animations; `expo-haptics` for tactile feedback
- **Platform handling**: Conditional logic for iOS, Android, and web throughout components (e.g., `webTopInset`, keyboard behavior, blur effects)
- **Tab bar**: Uses `expo-glass-effect` for Liquid Glass on supported iOS; falls back to BlurView/standard tabs on other platforms

### State Management
- **Global app state**: React Context via `AppContext` — holds user stats, journal entries, community prayers, badges, theme, streak logic, userName, and saved reflections
- **Auth state**: `AuthContext` (contexts/AuthContext.tsx) — wraps Replit OIDC auth. `isAuthenticated`, `user`, `login()`, `logout()` exposed via `useAuth()`. Fetches from `/api/auth/user`.
- **Persistence**: `AsyncStorage` (`@react-native-async-storage/async-storage`) stores all user data locally (stats, journal, community prayers, theme preference, userName, reflections)
- **Server data**: `@tanstack/react-query` is wired up for server-side fetching (currently minimal API usage)

### Content Data
- **Affirmations**: Statically defined in `constants/affirmations.ts` — 10 categories, ~40+ affirmations per category, with daily rotation based on day of year
- **Devotionals**: Also static in `constants/affirmations.ts`, with daily rotation
- **Badges/Levels**: Defined in `constants/badges.ts` — 14 badges across 5 types, 10 levels with names (Seed → Crown of Glory)

### Backend (Express Server)
- **Framework**: Express 5 (`server/index.ts`) with TypeScript, bundled via esbuild for production
- **Auth**: Replit OIDC authentication via `server/replitAuth.ts`. Routes: `GET /api/auth/login` → initiates OIDC flow with PKCE, `GET /api/auth/callback` → exchanges code for tokens, `GET /api/auth/logout` → destroys session, `GET /api/auth/user` → returns current user or `{isAuthenticated: false}`. Uses `openid-client` v6 with PostgreSQL-backed sessions via `connect-pg-simple`.
- **CORS**: Configured to allow Replit dev/deployment domains and localhost origins

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect (`drizzle.config.ts`)
- **Schema** (`shared/schema.ts`): Currently only a `users` table (id, username, password) — minimal foundation
- **Validation**: Drizzle-Zod for schema-derived TypeScript types and insert validation
- **Status**: Database is provisioned but largely unused — all user data currently lives in AsyncStorage on-device

### Build & Deployment
- **Dev mode**: Metro bundler via `npx expo start --localhost`, proxied through Replit dev domain
- **Production build**: Custom `scripts/build.js` handles static Expo web export, then Express serves those files
- **Environment**: `EXPO_PUBLIC_DOMAIN` used by the client to construct API URLs; `REPLIT_DEV_DOMAIN` and `REPLIT_DOMAINS` used for CORS and build configuration

## External Dependencies

| Dependency | Purpose |
|---|---|
| **PostgreSQL** (via `pg`) | Database — currently minimally used, schema ready for expansion |
| **Drizzle ORM** | Type-safe SQL query builder and migration tool |
| **AsyncStorage** | On-device persistence for all user state |
| **TanStack Query** | Server state management and API caching |
| **expo-av** | Audio playback for background worship music |
| **Pixabay CDN** | Source for streaming worship audio tracks (hardcoded URLs) |
| **expo-linear-gradient** | Gradient UI elements |
| **expo-blur** | Tab bar blur effect on iOS |
| **expo-glass-effect** | Liquid Glass tab bar on iOS 26+ |
| **expo-haptics** | Haptic feedback on interactions |
| **expo-image-picker** | (Installed, not yet actively used) |
| **expo-location** | (Installed, not yet actively used) |
| **expo-sharing** | Share affirmations/devotionals via native share sheet |
| **react-native-reanimated** | Declarative animations |
| **react-native-gesture-handler** | Gesture system foundation |
| **react-native-keyboard-controller** | Cross-platform keyboard-aware scroll view |
| **@expo-google-fonts/inter** | Inter font family |
| **@expo/vector-icons (Ionicons)** | Icon set used throughout the app |