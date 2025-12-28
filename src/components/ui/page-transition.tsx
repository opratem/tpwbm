'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Small delay before showing content
      setTimeout(() => setIsVisible(true), 100);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <div className="text-center space-y-8">
          {/* Enhanced loading animation */}
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full loading-spinner mx-auto" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-blue-400 rounded-full loading-spinner mx-auto animation-delay-500" />
          </div>

          {/* Loading text with typewriter effect */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 animate-pulse">
              Loading...
            </h2>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-100" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Preparing your worship experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  );
}

// Enhanced skeleton components
export function SkeletonHero() {
  return (
    <div className="w-full h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      <div className="container px-4 md:px-6 flex items-center justify-center h-full">
        <div className="text-center space-y-6 max-w-4xl">
          <div className="space-y-4">
            <div className="loading-skeleton h-16 w-3/4 mx-auto rounded-lg" />
            <div className="loading-skeleton h-8 w-2/3 mx-auto rounded-lg" />
          </div>
          <div className="flex justify-center gap-4">
            <div className="loading-skeleton h-12 w-32 rounded-full" />
            <div className="loading-skeleton h-12 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="w-full py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="space-y-12">
          {/* Section header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="loading-skeleton h-4 w-24 mx-auto rounded" />
            <div className="loading-skeleton h-12 w-2/3 mx-auto rounded-lg" />
            <div className="loading-skeleton h-6 w-full rounded" />
            <div className="loading-skeleton h-6 w-4/5 mx-auto rounded" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="loading-skeleton h-48 rounded-xl" />
                <div className="space-y-3 p-4">
                  <div className="loading-skeleton h-6 w-3/4 rounded" />
                  <div className="loading-skeleton h-4 w-full rounded" />
                  <div className="loading-skeleton h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading state for specific content
export function ContentLoader({
  lines = 3,
  showImage = true,
  className
}: {
  lines?: number;
  showImage?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {showImage && (
        <div className="loading-skeleton h-48 w-full rounded-lg" />
      )}
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "loading-skeleton h-4 rounded",
              i === lines - 1 ? "w-2/3" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// Progress bar component
export function LoadingProgress({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>Loading</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
