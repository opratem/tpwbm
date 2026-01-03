'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NotificationPreferences {
  // Email preferences
  emailEnabled: boolean;
  emailAnnouncements: boolean;
  emailEvents: boolean;
  emailPrayerRequests: boolean;
  emailSystemAlerts: boolean;

  // Push preferences
  pushEnabled: boolean;
  pushAnnouncements: boolean;
  pushEvents: boolean;
  pushPrayerRequests: boolean;
  pushSystemAlerts: boolean;

  // In-app preferences
  inAppEnabled: boolean;
  inAppAnnouncements: boolean;
  inAppEvents: boolean;
  inAppPrayerRequests: boolean;
  inAppSystemAlerts: boolean;

  // Frequency settings
  digestFrequency: 'instant' | 'daily' | 'weekly';
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
}

export interface UseNotificationPreferencesReturn {
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<boolean>;
  refreshPreferences: () => Promise<void>;
}

const defaultPreferences: NotificationPreferences = {
  emailEnabled: true,
  emailAnnouncements: true,
  emailEvents: true,
  emailPrayerRequests: true,
  emailSystemAlerts: true,
  pushEnabled: true,
  pushAnnouncements: true,
  pushEvents: true,
  pushPrayerRequests: true,
  pushSystemAlerts: true,
  inAppEnabled: true,
  inAppAnnouncements: true,
  inAppEvents: true,
  inAppPrayerRequests: true,
  inAppSystemAlerts: true,
  digestFrequency: 'instant',
  quietHoursEnabled: false,
  quietHoursStart: null,
  quietHoursEnd: null,
};

/**
 * Hook for managing user notification preferences
 */
export function useNotificationPreferences(): UseNotificationPreferencesReturn {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences from server
  const refreshPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/notification-preferences');

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated - use defaults
          setPreferences(defaultPreferences);
          return;
        }
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();

      if (data.isDefault) {
        setPreferences(defaultPreferences);
      } else {
        setPreferences({
          emailEnabled: data.preferences.emailEnabled ?? true,
          emailAnnouncements: data.preferences.emailAnnouncements ?? true,
          emailEvents: data.preferences.emailEvents ?? true,
          emailPrayerRequests: data.preferences.emailPrayerRequests ?? true,
          emailSystemAlerts: data.preferences.emailSystemAlerts ?? true,
          pushEnabled: data.preferences.pushEnabled ?? true,
          pushAnnouncements: data.preferences.pushAnnouncements ?? true,
          pushEvents: data.preferences.pushEvents ?? true,
          pushPrayerRequests: data.preferences.pushPrayerRequests ?? true,
          pushSystemAlerts: data.preferences.pushSystemAlerts ?? true,
          inAppEnabled: data.preferences.inAppEnabled ?? true,
          inAppAnnouncements: data.preferences.inAppAnnouncements ?? true,
          inAppEvents: data.preferences.inAppEvents ?? true,
          inAppPrayerRequests: data.preferences.inAppPrayerRequests ?? true,
          inAppSystemAlerts: data.preferences.inAppSystemAlerts ?? true,
          digestFrequency: data.preferences.digestFrequency ?? 'instant',
          quietHoursEnabled: data.preferences.quietHoursEnabled ?? false,
          quietHoursStart: data.preferences.quietHoursStart ?? null,
          quietHoursEnd: data.preferences.quietHoursEnd ?? null,
        });
      }
    } catch (err) {
      console.error('[PREFS] Error fetching preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
      // Use defaults on error
      setPreferences(defaultPreferences);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update preferences on server
  const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>): Promise<boolean> => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/notification-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update preferences');
      }

      const data = await response.json();

      // Update local state with new preferences
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          ...updates,
        };
      });

      console.log('[PREFS] Preferences updated successfully');
      return true;
    } catch (err) {
      console.error('[PREFS] Error updating preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Load preferences on mount
  useEffect(() => {
    refreshPreferences();
  }, [refreshPreferences]);

  return {
    preferences,
    isLoading,
    isSaving,
    error,
    updatePreferences,
    refreshPreferences,
  };
}

export default useNotificationPreferences;
