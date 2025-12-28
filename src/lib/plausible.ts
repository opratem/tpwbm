// Plausible Analytics API Service
interface PlausibleStatsResponse {
  results: {
    visitors: { value: number };
    pageviews: { value: number };
    bounce_rate: { value: number };
    visit_duration: { value: number };
  };
}

interface PlausiblePageviewsResponse {
  results: Array<{
    page: string;
    visitors: number;
    pageviews: number;
  }>;
}

interface PlausibleTimeseriesResponse {
  results: Array<{
    date: string;
    visitors: number;
    pageviews: number;
  }>;
}

interface PlausibleCountriesResponse {
  results: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
}

interface PlausibleReferrersResponse {
  results: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
}

export interface AnalyticsData {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  visitDuration: number;
  topPages: Array<{ page: string; visitors: number; pageviews: number }>;
  timeseriesData: Array<{ date: string; visitors: number; pageviews: number }>;
  topCountries: Array<{ country: string; visitors: number; percentage: number }>;
  topReferrers: Array<{ source: string; visitors: number; percentage: number }>;
}

class PlausibleService {
  private baseUrl = 'https://plausible.io/api/v1/stats';
  private apiKey: string;
  private siteId: string;

  constructor() {
    this.apiKey = process.env.PLAUSIBLE_API_KEY || '';
    this.siteId = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || '';
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    if (!this.apiKey || !this.siteId) {
      throw new Error('Plausible API key or domain not configured');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('site_id', this.siteId);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      // Cache for 5 minutes
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Plausible API error:', response.status, errorText);
      throw new Error(`Plausible API error: ${response.status}`);
    }

    return response.json();
  }

  // Get aggregate stats for a time period
  async getAggregateStats(period = '30d'): Promise<{
    visitors: number;
    pageviews: number;
    bounceRate: number;
    visitDuration: number;
  }> {
    try {
      const data: PlausibleStatsResponse = await this.makeRequest('/aggregate', {
        period,
        metrics: 'visitors,pageviews,bounce_rate,visit_duration'
      });

      return {
        visitors: data.results.visitors?.value || 0,
        pageviews: data.results.pageviews?.value || 0,
        bounceRate: data.results.bounce_rate?.value || 0,
        visitDuration: data.results.visit_duration?.value || 0,
      };
    } catch (error) {
      console.error('Error fetching aggregate stats:', error);
      // Return fallback data
      return {
        visitors: 0,
        pageviews: 0,
        bounceRate: 0,
        visitDuration: 0,
      };
    }
  }

  // Get top pages
  async getTopPages(period = '30d', limit = 10): Promise<Array<{
    page: string;
    visitors: number;
    pageviews: number;
  }>> {
    try {
      const data: PlausiblePageviewsResponse = await this.makeRequest('/breakdown', {
        period,
        property: 'page',
        metrics: 'visitors,pageviews',
        limit: limit.toString()
      });

      return data.results || [];
    } catch (error) {
      console.error('Error fetching top pages:', error);
      return [];
    }
  }

  // Get timeseries data
  async getTimeseriesData(period = '30d'): Promise<Array<{
    date: string;
    visitors: number;
    pageviews: number;
  }>> {
    try {
      const data: PlausibleTimeseriesResponse = await this.makeRequest('/timeseries', {
        period,
        metrics: 'visitors,pageviews'
      });

      return data.results || [];
    } catch (error) {
      console.error('Error fetching timeseries data:', error);
      return [];
    }
  }

  // Get top countries
  async getTopCountries(period = '30d', limit = 5): Promise<Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>> {
    try {
      const data: PlausibleCountriesResponse = await this.makeRequest('/breakdown', {
        period,
        property: 'country',
        metrics: 'visitors',
        limit: limit.toString()
      });

      return data.results || [];
    } catch (error) {
      console.error('Error fetching top countries:', error);
      return [];
    }
  }

  // Get top referrers
  async getTopReferrers(period = '30d', limit = 5): Promise<Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>> {
    try {
      const data: PlausibleReferrersResponse = await this.makeRequest('/breakdown', {
        period,
        property: 'source',
        metrics: 'visitors',
        limit: limit.toString()
      });

      return data.results || [];
    } catch (error) {
      console.error('Error fetching top referrers:', error);
      return [];
    }
  }

  // Get comprehensive analytics data
  async getAnalyticsData(period = '30d'): Promise<AnalyticsData> {
    try {
      const [
        aggregateStats,
        topPages,
        timeseriesData,
        topCountries,
        topReferrers
      ] = await Promise.all([
        this.getAggregateStats(period),
        this.getTopPages(period, 10),
        this.getTimeseriesData(period),
        this.getTopCountries(period, 5),
        this.getTopReferrers(period, 5)
      ]);

      return {
        visitors: aggregateStats.visitors,
        pageviews: aggregateStats.pageviews,
        bounceRate: aggregateStats.bounceRate,
        visitDuration: aggregateStats.visitDuration,
        topPages,
        timeseriesData,
        topCountries,
        topReferrers
      };
    } catch (error) {
      console.error('Error fetching comprehensive analytics data:', error);
      // Return fallback data
      return {
        visitors: 0,
        pageviews: 0,
        bounceRate: 0,
        visitDuration: 0,
        topPages: [],
        timeseriesData: [],
        topCountries: [],
        topReferrers: []
      };
    }
  }

  // Helper method to check if Plausible is configured
  isConfigured(): boolean {
    return !!(this.apiKey && this.siteId);
  }

  // Get real-time visitor count (if available)
  async getRealtimeVisitors(): Promise<number> {
    try {
      const data = await this.makeRequest('/realtime/visitors');
      return data.visitors || 0;
    } catch (error) {
      console.error('Error fetching realtime visitors:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const plausibleService = new PlausibleService();

// Export utility functions
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
