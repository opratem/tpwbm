'use client';

import { useState } from 'react';
import { Bell, BellOff, Mail, Smartphone, Monitor, Clock, Loader2, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';

interface NotificationCategoryProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

function NotificationCategory({
  title,
  description,
  enabled,
  onToggle,
  disabled = false,
  loading = false,
}: NotificationCategoryProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium text-gray-900">{title}</Label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={disabled || loading}
        />
      </div>
    </div>
  );
}

export function NotificationSettings() {
  const {
    preferences,
    isLoading: prefsLoading,
    isSaving,
    updatePreferences,
  } = useNotificationPreferences();

  const {
    isSupported: pushSupported,
    isSubscribed: pushSubscribed,
    isLoading: pushLoading,
    permission: pushPermission,
    error: pushError,
    subscribe: subscribeToPush,
    unsubscribe: unsubscribeFromPush,
  } = usePushNotifications();

  const [savingField, setSavingField] = useState<string | null>(null);

  const handleToggle = async (field: string, value: boolean) => {
    setSavingField(field);
    await updatePreferences({ [field]: value });
    setSavingField(null);
  };

  const handlePushToggle = async () => {
    if (pushSubscribed) {
      await unsubscribeFromPush();
      await handleToggle('pushEnabled', false);
    } else {
      const success = await subscribeToPush();
      if (success) {
        await handleToggle('pushEnabled', true);
      }
    }
  };

  const handleQuietHoursChange = async (start: string, end: string) => {
    await updatePreferences({
      quietHoursEnabled: true,
      quietHoursStart: start,
      quietHoursEnd: end,
    });
  };

  if (prefsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Push Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Push Notifications</CardTitle>
          </div>
          <CardDescription>
            Receive notifications even when you're not on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pushSupported ? (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-600">
                Push notifications are not supported on this device/browser.
              </p>
            </div>
          ) : pushPermission === 'denied' ? (
            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg">
              <BellOff className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-700">
                  Notifications Blocked
                </p>
                <p className="text-xs text-red-600">
                  Please enable notifications in your browser settings.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  {pushSubscribed ? (
                    <Bell className="h-6 w-6 text-amber-600" />
                  ) : (
                    <BellOff className="h-6 w-6 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {pushSubscribed ? 'Push notifications enabled' : 'Enable push notifications'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pushSubscribed
                        ? 'You will receive notifications on this device'
                        : 'Get notified about important updates'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={pushSubscribed ? 'outline' : 'default'}
                  size="sm"
                  onClick={handlePushToggle}
                  disabled={pushLoading}
                  className={pushSubscribed ? '' : 'bg-amber-600 hover:bg-amber-700'}
                >
                  {pushLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : pushSubscribed ? (
                    'Disable'
                  ) : (
                    'Enable'
                  )}
                </Button>
              </div>

              {pushError && (
                <p className="text-sm text-red-500 mb-4">{pushError}</p>
              )}

              {pushSubscribed && preferences && (
                <div className="space-y-1">
                  <NotificationCategory
                    title="Announcements"
                    description="New announcements and updates from the church"
                    enabled={preferences.pushAnnouncements}
                    onToggle={(v) => handleToggle('pushAnnouncements', v)}
                    loading={savingField === 'pushAnnouncements'}
                  />
                  <NotificationCategory
                    title="Events"
                    description="Upcoming events and event reminders"
                    enabled={preferences.pushEvents}
                    onToggle={(v) => handleToggle('pushEvents', v)}
                    loading={savingField === 'pushEvents'}
                  />
                  <NotificationCategory
                    title="Prayer Requests"
                    description="Updates on prayer requests you're following"
                    enabled={preferences.pushPrayerRequests}
                    onToggle={(v) => handleToggle('pushPrayerRequests', v)}
                    loading={savingField === 'pushPrayerRequests'}
                  />
                  <NotificationCategory
                    title="System Alerts"
                    description="Important system and account notifications"
                    enabled={preferences.pushSystemAlerts}
                    onToggle={(v) => handleToggle('pushSystemAlerts', v)}
                    loading={savingField === 'pushSystemAlerts'}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Email Notifications</CardTitle>
          </div>
          <CardDescription>
            Manage what emails you receive from us
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preferences && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <p className="font-medium text-gray-900">Email notifications</p>
                  <p className="text-xs text-gray-500">Master toggle for all email notifications</p>
                </div>
                <Switch
                  checked={preferences.emailEnabled}
                  onCheckedChange={(v) => handleToggle('emailEnabled', v)}
                  disabled={savingField === 'emailEnabled'}
                />
              </div>

              {preferences.emailEnabled && (
                <div className="space-y-1">
                  <NotificationCategory
                    title="Announcements"
                    description="Weekly digest of church announcements"
                    enabled={preferences.emailAnnouncements}
                    onToggle={(v) => handleToggle('emailAnnouncements', v)}
                    loading={savingField === 'emailAnnouncements'}
                  />
                  <NotificationCategory
                    title="Events"
                    description="Event invitations and reminders"
                    enabled={preferences.emailEvents}
                    onToggle={(v) => handleToggle('emailEvents', v)}
                    loading={savingField === 'emailEvents'}
                  />
                  <NotificationCategory
                    title="Prayer Requests"
                    description="Prayer request updates and responses"
                    enabled={preferences.emailPrayerRequests}
                    onToggle={(v) => handleToggle('emailPrayerRequests', v)}
                    loading={savingField === 'emailPrayerRequests'}
                  />
                  <NotificationCategory
                    title="System Alerts"
                    description="Account and security notifications"
                    enabled={preferences.emailSystemAlerts}
                    onToggle={(v) => handleToggle('emailSystemAlerts', v)}
                    loading={savingField === 'emailSystemAlerts'}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* In-App Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">In-App Notifications</CardTitle>
          </div>
          <CardDescription>
            Notifications you see while browsing the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preferences && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <p className="font-medium text-gray-900">In-app notifications</p>
                  <p className="text-xs text-gray-500">Show notifications while on the site</p>
                </div>
                <Switch
                  checked={preferences.inAppEnabled}
                  onCheckedChange={(v) => handleToggle('inAppEnabled', v)}
                  disabled={savingField === 'inAppEnabled'}
                />
              </div>

              {preferences.inAppEnabled && (
                <div className="space-y-1">
                  <NotificationCategory
                    title="Announcements"
                    description="Real-time announcement notifications"
                    enabled={preferences.inAppAnnouncements}
                    onToggle={(v) => handleToggle('inAppAnnouncements', v)}
                    loading={savingField === 'inAppAnnouncements'}
                  />
                  <NotificationCategory
                    title="Events"
                    description="Event updates and registrations"
                    enabled={preferences.inAppEvents}
                    onToggle={(v) => handleToggle('inAppEvents', v)}
                    loading={savingField === 'inAppEvents'}
                  />
                  <NotificationCategory
                    title="Prayer Requests"
                    description="Prayer request notifications"
                    enabled={preferences.inAppPrayerRequests}
                    onToggle={(v) => handleToggle('inAppPrayerRequests', v)}
                    loading={savingField === 'inAppPrayerRequests'}
                  />
                  <NotificationCategory
                    title="System Alerts"
                    description="System and admin notifications"
                    enabled={preferences.inAppSystemAlerts}
                    onToggle={(v) => handleToggle('inAppSystemAlerts', v)}
                    loading={savingField === 'inAppSystemAlerts'}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Quiet Hours Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Quiet Hours</CardTitle>
          </div>
          <CardDescription>
            Pause notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preferences && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <p className="font-medium text-gray-900">Enable quiet hours</p>
                  <p className="text-xs text-gray-500">No push notifications during this time</p>
                </div>
                <Switch
                  checked={preferences.quietHoursEnabled}
                  onCheckedChange={(v) => handleToggle('quietHoursEnabled', v)}
                  disabled={savingField === 'quietHoursEnabled'}
                />
              </div>

              {preferences.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="quiet-start" className="text-sm text-gray-600">Start time</Label>
                    <input
                      id="quiet-start"
                      type="time"
                      value={preferences.quietHoursStart || '22:00'}
                      onChange={(e) => handleQuietHoursChange(e.target.value, preferences.quietHoursEnd || '07:00')}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end" className="text-sm text-gray-600">End time</Label>
                    <input
                      id="quiet-end"
                      type="time"
                      value={preferences.quietHoursEnd || '07:00'}
                      onChange={(e) => handleQuietHoursChange(preferences.quietHoursStart || '22:00', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Status */}
      {isSaving && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving changes...
        </div>
      )}
    </div>
  );
}

export default NotificationSettings;
