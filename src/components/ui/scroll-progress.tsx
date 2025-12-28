'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/hooks/useScrollAnimation';

interface ScrollProgressProps {
  className?: string;
  position?: 'top' | 'bottom';
  height?: number;
}

export function ScrollProgress({
  className,
  position = 'top',
  height = 3
}: ScrollProgressProps) {
  const { scrollProgress, isScrolling } = useScrollProgress();

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 transition-all duration-300',
        position === 'top' ? 'top-0' : 'bottom-0',
        isScrolling ? 'opacity-100' : 'opacity-70',
        className
      )}
      style={{
        height: `${height}px`,
        width: `${scrollProgress}%`,
        transformOrigin: 'left center'
      }}
    />
  );
}

// Alternative circular progress indicator
export function CircularScrollProgress({
  size = 60,
  strokeWidth = 4,
  className
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const { scrollProgress } = useScrollProgress();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className={cn('fixed bottom-8 right-8 z-50', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(229 231 235)"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="dark:stroke-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          {Math.round(scrollProgress)}%
        </span>
      </div>
    </div>
  );
}
