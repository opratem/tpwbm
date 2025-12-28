"use client";

import { useNotificationToasts } from '@/hooks/useNotificationToasts';
import type { ReactNode } from 'react';

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Initialize notification toasts
  useNotificationToasts();

  return <>{children}</>;
}
