import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/hooks/useSettings';

interface UserContextValue {
  userId: string | null;
  user: UserProfile | null;
  setUser: (userId: string, user: UserProfile) => void;
  clearUser: () => void;
}

const STORAGE_KEY = 'tunix_selected_user';

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUserState] = useState<UserProfile | null>(null);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { userId: string; user: UserProfile };
        setUserId(parsed.userId);
        setUserState(parsed.user);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const setUser = useCallback((id: string, profile: UserProfile) => {
    setUserId(id);
    setUserState(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: id, user: profile }));
  }, []);

  const clearUser = useCallback(() => {
    setUserId(null);
    setUserState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <UserContext.Provider value={{ userId, user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
