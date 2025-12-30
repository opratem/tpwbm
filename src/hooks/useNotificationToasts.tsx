"use client";

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, Calendar, MessageSquare, Users, BookOpen } from 'lucide-react';
import { useRealTimeNotifications } from './useRealTimeNotifications';

export interface NotificationToastData {
  title: string;
  message: string;
  type: 'announcement' | 'event' | 'prayer_request' | 'membership_request' | 'sermon';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
}

export function useNotificationToasts() {
  const { notifications } = useRealTimeNotifications();

  useEffect(() => {
    // This hook is initialized to work with the real-time notification system
    // Toast notifications are handled by useRealTimeNotifications directly
  }, [notifications]);
}

export function showNotificationToast(data: NotificationToastData) {
  const getIcon = () => {
    switch (data.type) {
      case 'announcement':
        return Bell;
      case 'event':
        return Calendar;
      case 'prayer_request':
        return MessageSquare;
      case 'membership_request':
        return Users;
      case 'sermon':
        return BookOpen;
      default:
        return Bell;
    }
  };

  const Icon = getIcon();

  const toastOptions = {
    duration: data.priority === 'urgent' || data.priority === 'high' ? 8000 : 5000,
    action: data.actionUrl ? {
      label: data.actionLabel || 'View',
      onClick: () => window.location.href = data.actionUrl!,
    } : undefined,
  };

  // Play notification sound for high priority notifications
  if (data.priority === 'high' || data.priority === 'urgent') {
    playNotificationSound();
  }

  // Show toast based on priority
  if (data.priority === 'urgent') {
    toast.error(
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">{data.title}</p>
          <p className="text-sm opacity-90">{data.message}</p>
        </div>
      </div>,
      toastOptions
    );
  } else if (data.priority === 'high') {
    toast.warning(
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">{data.title}</p>
          <p className="text-sm opacity-90">{data.message}</p>
        </div>
      </div>,
      toastOptions
    );
  } else {
    toast.success(
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">{data.title}</p>
          <p className="text-sm opacity-90">{data.message}</p>
        </div>
      </div>,
      toastOptions
    );
  }
}

// Simple notification sound
function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
}
