// Core data types for the dramas.fm platform

export interface RadioShow {
  id: string;
  title: string;
  series: string;
  duration: string;
  year: string;
  description: string;
  archiveUrl: string;
  thumbnail?: string;
  genre: string[];
  actors: string[];
  rating: number;
  playCount: number;
  tags: string[];
  ageRating?: 'G' | 'PG' | 'PG13' | 'R';
  quality: {
    audioQuality: number; // 1-5 rating
    transcriptionAccuracy: number;
    userReports: number;
  };
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  shows: RadioShow[];
  curatedBy: string; // admin user ID
  featured: boolean;
  category: string;
  thumbnailUrl?: string;
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  userLevel: UserLevel;
  createdAt: Date;
  lastActive: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface AnonymousUser {
  cookieId: string;
  preferences: UserPreferences;
  sessionPlaylists: Playlist[];
  createdAt: Date;
  lastActive: Date;
}

export enum UserLevel {
  ANONYMOUS = 0,
  REGISTERED = 1,
  POWER_USER = 2,
  ADMIN = 3
}

export interface UserPreferences {
  favoriteGenres: string[];
  autoplay: boolean;
  volume: number;
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
}

export interface UserStats {
  totalListeningTime: number; // in minutes
  showsCompleted: number;
  playlistsCreated: number;
  contributionsCount: number; // crowdsourced data submissions
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  shows: string[]; // array of show IDs
  userId?: string; // undefined for anonymous users
  cookieId?: string; // for anonymous users
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  aiGenerated: boolean;
  tags: string[];
}

export interface CrowdsourceData {
  id: string;
  showId: string;
  userId?: string;
  cookieId?: string;
  submittedAt: Date;
  data: {
    qualityRating?: number; // 1-5
    emotionTags?: string[]; // happy, sad, suspenseful, etc.
    ageAppropriate?: boolean;
    contentWarnings?: string[];
    transcriptionCorrections?: string;
    additionalTags?: string[];
  };
  verified: boolean;
  verifiedBy?: string; // admin user ID
}

export interface SearchFilters {
  genre?: string[];
  year?: {
    min?: number;
    max?: number;
  };
  duration?: {
    min?: number; // in minutes
    max?: number;
  };
  rating?: {
    min?: number;
    max?: number;
  };
  series?: string;
  actors?: string[];
  tags?: string[];
  ageRating?: string[];
}

export interface SearchResult {
  shows: RadioShow[];
  totalCount: number;
  facets: {
    genres: { [key: string]: number };
    years: { [key: string]: number };
    series: { [key: string]: number };
    actors: { [key: string]: number };
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}