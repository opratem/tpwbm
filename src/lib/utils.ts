import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a UUID with fallback for environments where crypto.randomUUID() is not available
 */
export function generateUUID(): string {
  // Try native crypto.randomUUID() first
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    try {
      return window.crypto.randomUUID();
    } catch (error) {
      console.warn('crypto.randomUUID() failed, falling back to custom implementation');
    }
  }

  // Fallback implementation for non-secure contexts or unsupported browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Check if EventSource is supported in the current environment
 */
export function isEventSourceSupported(): boolean {
  return typeof window !== 'undefined' && 'EventSource' in window;
}

/**
 * Check if we're in a secure context (required for some crypto APIs)
 */
export function isSecureContext(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext;
}

/**
 * Format a number with commas for thousands separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format a decimal as a percentage
 */
export function formatPercentage(decimal: number): string {
  return `${Math.round(decimal * 100)}%`;
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}
