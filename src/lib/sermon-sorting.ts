// Utility functions for sermon series sorting and organization

interface SermonItem {
  id: string | number;
  title: string;
  date: string;
  series?: string;
  publishedAt?: string;
}

// Extract part number from sermon title
export function extractPartNumber(title: string): number | null {
  const patterns = [
    /part\s*(\d+)/i,
    /pt\.?\s*(\d+)/i,
    /episode\s*(\d+)/i,
    /ep\.?\s*(\d+)/i,
    /chapter\s*(\d+)/i,
    /ch\.?\s*(\d+)/i,
    /session\s*(\d+)/i,
    /\b(\d+)\s*-\s*[a-z]/i, // "1 - Title" format
    /\b(\d+)\s*\.\s*[a-z]/i, // "1. Title" format
    /\b(\d+)\s*:\s*[a-z]/i, // "1: Title" format
    /\((\d+)\)/,            // "(1)" format
    /\[(\d+)\]/,            // "[1]" format
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      const partNumber = Number.parseInt(match[1], 10);
      if (!Number.isNaN(partNumber)) {
        return partNumber;
      }
    }
  }

  return null;
}

// Extract series name from title or use explicit series field
export function extractSeriesName(title: string, explicitSeries?: string): string {
  if (explicitSeries && explicitSeries !== 'Church Messages') {
    return explicitSeries;
  }

  // Common patterns for series extraction
  const seriesPatterns = [
    /^([^:]+):\s*part\s*\d+/i,
    /^([^:]+):\s*pt\.?\s*\d+/i,
    /^([^-]+)-\s*part\s*\d+/i,
    /^([^-]+)-\s*pt\.?\s*\d+/i,
    /^([^(]+)\s*\(\s*part\s*\d+/i,
    /^([^(]+)\s*\(\s*pt\.?\s*\d+/i,
    /^([^[]+)\s*\[\s*part\s*\d+/i,
    /^([^[]+)\s*\[\s*pt\.?\s*\d+/i,
  ];

  for (const pattern of seriesPatterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // Fallback: use explicit series or default
  return explicitSeries || 'Standalone Message';
}

// Check if two sermons belong to the same series
export function areSameSeries(sermon1: SermonItem, sermon2: SermonItem): boolean {
  const series1 = extractSeriesName(sermon1.title, sermon1.series);
  const series2 = extractSeriesName(sermon2.title, sermon2.series);

  return series1.toLowerCase() === series2.toLowerCase();
}

// Sort sermons with proper series ordering
export function sortSermons<T extends SermonItem>(
    sermons: T[],
    sortBy: 'newest' | 'oldest' | 'series' | 'alphabetical' = 'newest'
): T[] {
  const sortedSermons = [...sermons];

  switch (sortBy) {
    case 'series':
      return sortSermons(sortedSermons, 'newest').sort((a, b) => {
        const seriesA = extractSeriesName(a.title, a.series);
        const seriesB = extractSeriesName(b.title, b.series);

        // First sort by series name
        const seriesComparison = seriesA.localeCompare(seriesB);
        if (seriesComparison !== 0) {
          return seriesComparison;
        }

        // Then sort by part number within the same series
        const partA = extractPartNumber(a.title) || 0;
        const partB = extractPartNumber(b.title) || 0;

        if (partA !== partB) {
          return partA - partB;
        }

        // Finally sort by date if everything else is equal
        const dateA = new Date(a.publishedAt || a.date);
        const dateB = new Date(b.publishedAt || b.date);
        return dateA.getTime() - dateB.getTime();
      });

    case 'newest':
      return sortedSermons.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.date);
        const dateB = new Date(b.publishedAt || b.date);
        return dateB.getTime() - dateA.getTime();
      });

    case 'oldest':
      return sortedSermons.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.date);
        const dateB = new Date(b.publishedAt || b.date);
        return dateA.getTime() - dateB.getTime();
      });

    case 'alphabetical':
      return sortedSermons.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sortedSermons;
  }
}

// Group sermons by series
export function groupSermonsBySeries<T extends SermonItem>(sermons: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};

  for (const sermon of sermons) {
    const seriesName = extractSeriesName(sermon.title, sermon.series);

    if (!groups[seriesName]) {
      groups[seriesName] = [];
    }

    groups[seriesName].push(sermon);
  }

  // Sort sermons within each series by part number and date
  for (const seriesName in groups) {
    groups[seriesName] = sortSermons(groups[seriesName], 'series');
  }

  return groups;
}

// Get next/previous sermon in a series
export function getSeriesNavigation<T extends SermonItem>(
    currentSermon: T,
    allSermons: T[]
): { previous: T | null; next: T | null; seriesInfo: { total: number; current: number } } {
  const currentSeries = extractSeriesName(currentSermon.title, currentSermon.series);
  const seriesSermons = allSermons
      .filter(sermon => extractSeriesName(sermon.title, sermon.series) === currentSeries)
      .sort((a, b) => {
        const partA = extractPartNumber(a.title) || 0;
        const partB = extractPartNumber(b.title) || 0;

        if (partA !== partB) {
          return partA - partB;
        }

        const dateA = new Date(a.publishedAt || a.date);
        const dateB = new Date(b.publishedAt || b.date);
        return dateA.getTime() - dateB.getTime();
      });

  const currentIndex = seriesSermons.findIndex(sermon => sermon.id === currentSermon.id);

  return {
    previous: currentIndex > 0 ? seriesSermons[currentIndex - 1] : null,
    next: currentIndex < seriesSermons.length - 1 ? seriesSermons[currentIndex + 1] : null,
    seriesInfo: {
      total: seriesSermons.length,
      current: currentIndex + 1
    }
  };
}

// Generate series title with part information
export function formatSeriesTitle(sermon: SermonItem): string {
  const series = extractSeriesName(sermon.title, sermon.series);
  const part = extractPartNumber(sermon.title);

  if (part && series !== 'Standalone Message') {
    return `${series} - Part ${part}`;
  }

  return sermon.title;
}

// Check if a sermon is part of a multi-part series
export function isMultiPartSeries<T extends SermonItem>(sermon: T, allSermons: T[]): boolean {
  const seriesName = extractSeriesName(sermon.title, sermon.series);
  const seriesSermons = allSermons.filter(s =>
      extractSeriesName(s.title, s.series) === seriesName
  );

  return seriesSermons.length > 1;
}
