import { type NextRequest, NextResponse } from 'next/server';
import { getYouTubeAPI, YouTubeAPI, type YouTubeVideo } from '@/lib/youtube-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('playlistId');
    const channelId = searchParams.get('channelId');
    const maxResults = Number.parseInt(searchParams.get('maxResults') || '50');

    if (!playlistId && !channelId) {
      return NextResponse.json(
          { error: 'Either playlistId or channelId is required' },
          { status: 400 }
      );
    }

    const youtube = getYouTubeAPI();

    if (!youtube) {
      return NextResponse.json(
          { error: 'YouTube API not configured properly' },
          { status: 500 }
      );
    }

    let videos: YouTubeVideo[];

    if (playlistId) {
      videos = await youtube.getPlaylistVideos(playlistId, maxResults);
    } else if (channelId) {
      videos = await youtube.getChannelVideos(channelId, maxResults);
    } else {
      videos = []; // This should never happen due to validation above, but satisfies TypeScript
    }

    // Format the videos for frontend consumption
    const formattedVideos = videos?.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      publishedAt: video.publishedAt,
      thumbnail: video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default?.url,
      thumbnails: video.thumbnails,
      channelTitle: video.channelTitle,
      duration: video.duration ? YouTubeAPI.formatDuration(video.duration) : 'Unknown',
      rawDuration: video.duration,
      viewCount: video.viewCount ? YouTubeAPI.formatViewCount(video.viewCount) : '0',
      rawViewCount: video.viewCount,
      likeCount: video.likeCount,
      tags: video.tags || [],
      youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
      embedUrl: `https://www.youtube.com/embed/${video.id}`
    })) || [];

    return NextResponse.json({
      success: true,
      videos: formattedVideos,
      count: formattedVideos.length,
      source: playlistId ? 'playlist' : 'channel'
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
        {
          error: 'Failed to fetch videos',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
    );
  }
}
