import { useState, useEffect, useCallback } from 'react';
import { userApi, ApiError } from '@/lib/api';

// Types
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  bio?: string;
  profileImage?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  sessionReminders: boolean;
  clientUpdates: boolean;
  marketingEmails: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showClientPhotos: boolean;
  defaultCalendarView: 'day' | 'week' | 'month';
}

interface UseSettingsReturn {
  // Data
  userData: UserProfile | null;
//   notificationSettings: NotificationSettings | null;
//   appearanceSettings: AppearanceSettings | null;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
//   updateNotifications: (data: Partial<NotificationSettings>) => Promise<void>;
//   updateAppearance: (data: Partial<AppearanceSettings>) => Promise<void>;
//   changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

export const useSettings = (): UseSettingsReturn => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('Settings error:', error);
    if (error instanceof ApiError) {
      setError(`API Error: ${error.message}`);
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [profile] = await Promise.all([
        userApi.getUser('8922225c-931f-4c28-8cfe-84b22159acd8'),
        // userApi.getNotificationSettings(),
        // userApi.getAppearanceSettings(),
      ]);

      setUserData(profile);
    //   setNotificationSettings(notifications);
    //   setAppearanceSettings(appearance);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const updatedProfile = await userApi.updateUser('8922225c-931f-4c28-8cfe-84b22159acd8',data);
      setUserData(updatedProfile);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [handleError]);

//   const updateNotifications = useCallback(async (data: Partial<NotificationSettings>) => {
//     try {
//       setIsUpdating(true);
//       setError(null);
      
//       const updatedSettings = await userApi.updateNotificationSettings(data);
//       setNotificationSettings(updatedSettings);
//     } catch (error) {
//       handleError(error);
//       throw error;
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [handleError]);

//   const updateAppearance = useCallback(async (data: Partial<AppearanceSettings>) => {
//     try {
//       setIsUpdating(true);
//       setError(null);
      
//       const updatedSettings = await userApi.updateAppearanceSettings(data);
//       setAppearanceSettings(updatedSettings);
//     } catch (error) {
//       handleError(error);
//       throw error;
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [handleError]);

//   const changePassword = useCallback(async (data: { 
//     currentPassword: string; 
//     newPassword: string; 
//     confirmPassword: string;
//   }) => {
//     try {
//       setIsUpdating(true);
//       setError(null);
      
//       if (data.newPassword !== data.confirmPassword) {
//         throw new Error('Passwords do not match');
//       }
      
//       await userApi.changePassword({
//         currentPassword: data.currentPassword,
//         newPassword: data.newPassword,
//       });
//     } catch (error) {
//       handleError(error);
//       throw error;
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [handleError]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Data
    userData,
    // notificationSettings,
    // appearanceSettings,
    
    // Loading states
    isLoading,
    isUpdating,
    
    // Error state
    error,
    
    // Actions
    updateProfile,
    // updateNotifications,
    // updateAppearance,
    // changePassword,
    clearError,
    refreshData,
  };
};
