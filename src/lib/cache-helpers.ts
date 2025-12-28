// Cache helper utilities for Next.js caching strategies

export const cacheConfig = {
  // Revalidate times in seconds
  revalidate: {
    fast: 60, // 1 minute - for frequently changing data
    medium: 300, // 5 minutes - for semi-static data
    slow: 3600, // 1 hour - for mostly static data
    daily: 86400, // 24 hours - for very static data
    weekly: 604800, // 7 days - for rarely changing data
  },
  // Cache tags for granular revalidation
  tags: {
    announcements: 'announcements',
    events: 'events',
    blog: 'blog',
    sermons: 'sermons',
    prayerRequests: 'prayer-requests',
    users: 'users',
    gallery: 'gallery',
    youtube: 'youtube',
    facebook: 'facebook',
  },
};

export const apiCacheHeaders = {
  // No cache - for user-specific or auth-required data
  noCache: {
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  // Short cache - 1 minute
  shortCache: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
  },
  // Medium cache - 5 minutes
  mediumCache: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
  // Long cache - 1 hour
  longCache: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  },
  // Very long cache - 24 hours
  veryLongCache: {
    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
  },
  // Static assets - 1 year
  staticCache: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
};

// Helper to set cache headers on Response
export function setCacheHeaders(
  headers: Record<string, string>,
  cacheType: keyof typeof apiCacheHeaders = 'mediumCache'
): Record<string, string> {
  return {
    ...headers,
    ...apiCacheHeaders[cacheType],
  };
}

// Helper for Next.js fetch with caching
export async function cachedFetch(
  url: string,
  options: RequestInit & {
    revalidate?: number;
    tags?: string[]
  } = {}
) {
  const { revalidate, tags, ...fetchOptions } = options;

  return fetch(url, {
    ...fetchOptions,
    next: {
      revalidate: revalidate || cacheConfig.revalidate.medium,
      tags: tags || [],
    },
  });
}
