// YouTube Data API v3 integration for church content
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
  duration?: string;
  viewCount?: string;
  likeCount?: string;
  tags?: string[];
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  itemCount: number;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

interface YouTubeChannelApiResponse {
  items: YouTubeChannelResponse[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubePlaylistApiResponse {
  items: YouTubePlaylistResponse[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubeVideoApiResponse {
  items: YouTubeVideoResponse[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubeSearchApiResponse {
  items: YouTubeSearchResponse[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubePlaylistItemsApiResponse {
  items: YouTubePlaylistItemResponse[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface YouTubeChannelResponse {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  statistics?: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
}

interface YouTubeVideoResponse {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    tags?: string[];
  };
  contentDetails?: {
    duration: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

interface YouTubePlaylistResponse {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  contentDetails: {
    itemCount: number;
  };
}

interface YouTubePlaylistItemResponse {
  snippet: {
    resourceId: {
      videoId: string;
    };
  };
}

interface YouTubeSearchResponse {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
  };
}

class YouTubeAPI {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchYouTubeData<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.append('key', this.apiKey);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get channel information by handle or channel ID
  async getChannelInfo(channelHandle: string): Promise<YouTubeChannel | null> {
    try {
      // First try by handle (for @PrevailingWord-d7h4o)
      const response = await this.fetchYouTubeData<YouTubeChannelApiResponse>('channels', {
        part: 'snippet,statistics',
        forHandle: channelHandle.replace('@', ''),
        maxResults: '1'
      });

      if (response.items && response.items.length > 0) {
        const channel = response.items[0];
        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
          subscriberCount: channel.statistics?.subscriberCount,
          videoCount: channel.statistics?.videoCount,
          viewCount: channel.statistics?.viewCount
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return null;
    }
  }

  // Get playlists from a channel
  async getChannelPlaylists(channelId: string, maxResults = 50): Promise<YouTubePlaylist[]> {
    try {
      const response = await this.fetchYouTubeData<YouTubePlaylistApiResponse>('playlists', {
        part: 'snippet,contentDetails',
        channelId: channelId,
        maxResults: maxResults.toString()
      });

      return response.items?.map((item: YouTubePlaylistResponse) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: item.snippet.thumbnails,
        itemCount: item.contentDetails.itemCount
      })) || [];
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  }

  // Get videos from a playlist
  async getPlaylistVideos(playlistId: string, maxResults = 50): Promise<YouTubeVideo[]> {
    try {
      const response = await this.fetchYouTubeData<YouTubePlaylistItemsApiResponse>('playlistItems', {
        part: 'snippet',
        playlistId: playlistId,
        maxResults: maxResults.toString()
      });

      const videoIds = response.items?.map((item: YouTubePlaylistItemResponse) => item.snippet.resourceId.videoId).filter(Boolean).join(',');

      if (!videoIds) return [];

      // Get additional video details (duration, statistics)
      const videoDetails = await this.fetchYouTubeData<YouTubeVideoApiResponse>('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds
      });

      return videoDetails.items?.map((video: YouTubeVideoResponse) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: video.snippet.thumbnails,
        channelTitle: video.snippet.channelTitle,
        duration: video.contentDetails?.duration,
        viewCount: video.statistics?.viewCount,
        likeCount: video.statistics?.likeCount,
        tags: video.snippet.tags || []
      })) || [];
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      return [];
    }
  }

  // Get videos from a channel
  async getChannelVideos(channelId: string, maxResults = 50): Promise<YouTubeVideo[]> {
    try {
      const response = await this.fetchYouTubeData<YouTubeSearchApiResponse>('search', {
        part: 'snippet',
        channelId: channelId,
        type: 'video',
        order: 'date',
        maxResults: maxResults.toString()
      });

      const videoIds = response.items?.map((item: YouTubeSearchResponse) => item.id.videoId).filter(Boolean).join(',');

      if (!videoIds) return [];

      // Get additional video details
      const videoDetails = await this.fetchYouTubeData<YouTubeVideoApiResponse>('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds
      });

      return videoDetails.items?.map((video: YouTubeVideoResponse) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: video.snippet.thumbnails,
        channelTitle: video.snippet.channelTitle,
        duration: video.contentDetails?.duration,
        viewCount: video.statistics?.viewCount,
        likeCount: video.statistics?.likeCount,
        tags: video.snippet.tags || []
      })) || [];
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      return [];
    }
  }

  // Search for videos by query
  async searchVideos(query: string, maxResults = 50): Promise<YouTubeVideo[]> {
    try {
      const response = await this.fetchYouTubeData<YouTubeSearchApiResponse>('search', {
        part: 'snippet',
        q: query,
        type: 'video',
        order: 'relevance',
        maxResults: maxResults.toString()
      });

      const videoIds = response.items?.map((item: YouTubeSearchResponse) => item.id.videoId).filter(Boolean).join(',');

      if (!videoIds) return [];

      // Get additional video details
      const videoDetails = await this.fetchYouTubeData<YouTubeVideoApiResponse>('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds
      });

      return videoDetails.items?.map((video: YouTubeVideoResponse) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: video.snippet.thumbnails,
        channelTitle: video.snippet.channelTitle,
        duration: video.contentDetails?.duration,
        viewCount: video.statistics?.viewCount,
        likeCount: video.statistics?.likeCount,
        tags: video.snippet.tags || []
      })) || [];
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }

  // Utility functions for formatting
  static formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = Number.parseInt(match[1] || '0');
    const minutes = Number.parseInt(match[2] || '0');
    const seconds = Number.parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static formatViewCount(count: string): string {
    const num = Number.parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }
}

// Create default instance with environment variable
let youtubeAPI: YouTubeAPI | null = null;

try {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    youtubeAPI = new YouTubeAPI(apiKey);
  }
} catch (error) {
  console.warn('YouTube API key not found in environment variables');
}

// Function to get YouTube API instance (for backwards compatibility)
export function getYouTubeAPI(): YouTubeAPI | null {
  return youtubeAPI;
}

export { YouTubeAPI };
export default youtubeAPI;
