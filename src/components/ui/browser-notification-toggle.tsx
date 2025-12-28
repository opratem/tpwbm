"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Info, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  isNotificationSupported,
  getNotificationPermission,
  setupBrowserNotifications,
  setNotificationPreference,
  getNotificationPreference,
} from '@/lib/browser-notification';

export function BrowserNotificationToggle() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check support and permission on mount
    setIsSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
    setIsEnabled(getNotificationPreference());
  }, []);

  const handleToggle = async (checked: boolean) => {
    if (!checked) {
      // User wants to disable notifications
      setNotificationPreference(false);
      setIsEnabled(false);
      toast.success('Browser notifications disabled');
      return;
    }

    // User wants to enable notifications
    setIsLoading(true);

    try {
      const result = await setupBrowserNotifications();

      if (result.success) {
        setPermission(result.permission);
        setIsEnabled(true);
        toast.success(result.message);
      } else {
        setPermission(result.permission);
        setIsEnabled(false);
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to setup browser notifications');
      setIsEnabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
            <Info className="h-5 w-5" />
            Browser Notifications Not Supported
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-500">
            Your browser doesn't support desktop notifications. Consider updating to a modern browser like Chrome, Firefox, or Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Browser Notifications
        </CardTitle>
        <CardDescription>
          Get notified even when you're not on this page - just like YouTube or Telegram!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="browser-notifications" className="text-base">
              Enable Desktop Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive real-time updates for prayer requests, events, and announcements
            </p>
          </div>
          <Switch
            id="browser-notifications"
            checked={isEnabled && permission === 'granted'}
            onCheckedChange={handleToggle}
            disabled={isLoading || permission === 'denied'}
          />
        </div>

        {/* Permission Status */}
        <div className="rounded-lg border p-4 space-y-2">
          <p className="text-sm font-medium">Permission Status:</p>

          {permission === 'granted' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Granted - Notifications enabled</span>
            </div>
          )}

          {permission === 'denied' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Blocked - Notifications disabled</span>
              </div>
              <p className="text-xs text-muted-foreground">
                To enable notifications, click the lock icon in your browser's address bar and allow notifications for this site.
              </p>
            </div>
          )}

          {permission === 'default' && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Info className="h-4 w-4" />
              <span className="text-sm">Not set - Click the toggle to enable</span>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <p className="font-medium">How it works:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>When you're actively on the site: notifications appear as toasts</li>
                <li>When you're on another tab/app: you'll get desktop notifications</li>
                <li>High-priority items always show notifications</li>
                <li>You can disable this anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
