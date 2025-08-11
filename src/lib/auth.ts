'use client';

import Cookies from 'js-cookie';
import { AnonymousUser, User, UserLevel, UserPreferences } from './types';

// Generate a unique cookie ID for anonymous users
export function generateCookieId(): string {
  return 'dramas_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Get or create anonymous user from cookie
export function getAnonymousUser(): AnonymousUser {
  const cookieId = Cookies.get('dramas_user_id');
  const existingPrefs = Cookies.get('dramas_preferences');
  
  let user: AnonymousUser;
  
  if (cookieId) {
    // Existing anonymous user
    user = {
      cookieId,
      preferences: existingPrefs ? JSON.parse(existingPrefs) : getDefaultPreferences(),
      sessionPlaylists: [],
      createdAt: new Date(Cookies.get('dramas_created') || Date.now()),
      lastActive: new Date()
    };
  } else {
    // New anonymous user
    const newCookieId = generateCookieId();
    user = {
      cookieId: newCookieId,
      preferences: getDefaultPreferences(),
      sessionPlaylists: [],
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    // Set cookies with long expiration (1 year)
    Cookies.set('dramas_user_id', newCookieId, { expires: 365 });
    Cookies.set('dramas_created', new Date().toISOString(), { expires: 365 });
  }
  
  // Update last active
  Cookies.set('dramas_last_active', new Date().toISOString(), { expires: 365 });
  
  return user;
}

// Save anonymous user preferences
export function saveAnonymousUserPreferences(preferences: UserPreferences): void {
  Cookies.set('dramas_preferences', JSON.stringify(preferences), { expires: 365 });
}

// Get default user preferences
export function getDefaultPreferences(): UserPreferences {
  return {
    favoriteGenres: [],
    autoplay: false,
    volume: 0.7,
    theme: 'dark',
    notifications: true
  };
}

// Mock authentication functions (would be replaced with real auth)
export function getCurrentUser(): User | null {
  // This would check for JWT token or session
  // For now, return null to simulate logged out state
  return null;
}

export function getUserLevel(): UserLevel {
  const user = getCurrentUser();
  if (user) {
    return user.userLevel;
  }
  return UserLevel.ANONYMOUS;
}

export function canAccessFeature(requiredLevel: UserLevel): boolean {
  const currentLevel = getUserLevel();
  return currentLevel >= requiredLevel;
}

// Simulate login (would make API call in real app)
export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        const user: User = {
          id: 'user_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)),
          username: email.split('@')[0],
          email,
          userLevel: UserLevel.REGISTERED,
          createdAt: new Date(),
          lastActive: new Date(),
          preferences: getDefaultPreferences(),
          stats: {
            totalListeningTime: 0,
            showsCompleted: 0,
            playlistsCreated: 0,
            contributionsCount: 0
          }
        };
        resolve({ success: true, user });
      } else {
        resolve({ success: false, error: 'Invalid credentials' });
      }
    }, 1000);
  });
}

// Simulate registration
export async function register(email: string, password: string, username: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password && username) {
        const user: User = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          username,
          email,
          userLevel: UserLevel.REGISTERED,
          createdAt: new Date(),
          lastActive: new Date(),
          preferences: getDefaultPreferences(),
          stats: {
            totalListeningTime: 0,
            showsCompleted: 0,
            playlistsCreated: 0,
            contributionsCount: 0
          }
        };
        resolve({ success: true, user });
      } else {
        resolve({ success: false, error: 'Missing required fields' });
      }
    }, 1000);
  });
}