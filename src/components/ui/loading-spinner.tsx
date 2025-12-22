import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'border-2 border-gray-200 border-t-blue-600 rounded-full loading-spinner',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full loading-spinner mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Loading...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your worship experience
          </p>
        </div>
      </div>
    </div>
  );
}

// Skeleton component for content loading
export function SkeletonCard() {
  return (
    <div className="church-card p-6 space-y-4">
      <div className="loading-skeleton h-48 rounded-lg" />
      <div className="space-y-3">
        <div className="loading-skeleton h-6 rounded w-3/4" />
        <div className="loading-skeleton h-4 rounded w-1/2" />
        <div className="space-y-2">
          <div className="loading-skeleton h-3 rounded" />
          <div className="loading-skeleton h-3 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'loading-skeleton h-4 rounded',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

// Enhanced grid skeleton for announcements/events
export function SkeletonGrid({ items = 6, columns = 3 }: { items?: number; columns?: number }) {
  return (
    <div className={cn(
      'grid gap-6',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'grid-cols-1 md:grid-cols-2',
      columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    )}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Loading state for announcements
export function AnnouncementsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="loading-skeleton h-8 w-48 rounded" />
        <div className="loading-skeleton h-10 w-32 rounded-lg" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="church-card p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="loading-skeleton h-6 w-3/4 rounded" />
                <div className="loading-skeleton h-4 w-24 rounded" />
              </div>
              <div className="loading-skeleton h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="loading-skeleton h-4 w-full rounded" />
              <div className="loading-skeleton h-4 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading state for events
export function EventsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="loading-skeleton h-8 w-36 rounded" />
        <div className="loading-skeleton h-10 w-28 rounded-lg" />
      </div>
      <SkeletonGrid items={6} columns={2} />
    </div>
  );
}
