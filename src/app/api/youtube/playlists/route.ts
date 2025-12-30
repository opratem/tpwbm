import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeAPI, YouTubeAPI, YouTubeVideo } from '@/lib/youtube-api';

// Church channel configuration
const CHURCH_CHANNEL_HANDLE = 'PrevailingWord-d7h4o';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type'); // 'sermons' | 'audio-messages' | 'all'
    const maxResults = parseInt(searchParams.get('maxResults') || '20');

    const youtube = getYouTubeAPI();

    if (!youtube) {
      return NextResponse.json(
          { error: 'YouTube API not available' },
          { status: 503 }
      );
    }

    const channelInfo = await youtube.getChannelInfo(CHURCH_CHANNEL_HANDLE);

    if (!channelInfo) {
      return NextResponse.json(
          { error: 'Church channel not found' },
          { status: 404 }
      );
    }

    // Get all playlists from the channel
    const playlists = await youtube.getChannelPlaylists(channelInfo.id);

    // Find sermons and audio messages playlists
    const sermonsPlaylist = playlists.find(p =>
        p.title.toLowerCase().includes('sermon') ||
        p.title.toLowerCase().includes('preaching')
    );

    const audioMessagesPlaylist = playlists.find(p =>
        p.title.toLowerCase().includes('audio') ||
        p.title.toLowerCase().includes('message') ||
        p.title.toLowerCase().includes('teaching')
    );

    let sermonsVideos: YouTubeVideo[] = [];
    let audioVideos: YouTubeVideo[] = [];

    // Fetch videos based on content type requested
    if (contentType === 'sermons' || contentType === 'all' || !contentType) {
      if (sermonsPlaylist) {
        sermonsVideos = await youtube.getPlaylistVideos(sermonsPlaylist.id, maxResults);
      } else {
        // Fallback: get recent videos from channel and filter by keywords
        const allVideos = await youtube.getChannelVideos(channelInfo.id, maxResults * 2);
        sermonsVideos = allVideos.filter(video =>
            video.title.toLowerCase().includes('sermon') ||
            video.title.toLowerCase().includes('preaching') ||
            video.title.toLowerCase().includes('service')
        ).slice(0, maxResults);
      }
    }

    if (contentType === 'audio-messages' || contentType === 'all' || !contentType) {
      if (audioMessagesPlaylist) {
        audioVideos = await youtube.getPlaylistVideos(audioMessagesPlaylist.id, maxResults);
      } else {
        // Fallback: get recent videos and filter by audio/message keywords
        const allVideos = await youtube.getChannelVideos(channelInfo.id, maxResults * 2);
        audioVideos = allVideos.filter(video =>
            video.title.toLowerCase().includes('message') ||
            video.title.toLowerCase().includes('teaching') ||
            video.title.toLowerCase().includes('audio') ||
            (!video.title.toLowerCase().includes('sermon') &&
                !video.title.toLowerCase().includes('service'))
        ).slice(0, maxResults);
      }
    }

    // Format videos for frontend
    const formatVideos = (videos: any[]) => videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      publishedAt: video.publishedAt,
      date: new Date(video.publishedAt).toISOString().split('T')[0],
      thumbnail: video.thumbnails.maxres?.url || video.thumbnails.high?.url || video.thumbnails.medium?.url,
      thumbnails: video.thumbnails,
      speaker: video.channelTitle || 'Pastor Tunde Olufemi', // Default speaker
      duration: video.duration ? YouTubeAPI.formatDuration(video.duration) : 'Unknown',
      rawDuration: video.duration,
      viewCount: video.viewCount ? YouTubeAPI.formatViewCount(video.viewCount) : '0',
      rawViewCount: video.viewCount,
      likeCount: video.likeCount,
      tags: video.tags || [],
      youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
      // Additional fields to match the existing sermon structure
      series: 'Church Messages',
      featured: false,
      notes: [
        "God's word brings comfort and guidance",
        "Faith grows through hearing God's message",
        "Apply these truths to your daily life",
        "Share this message with others"
      ]
    }));

    const response: any = {
      success: true,
      channel: channelInfo,
      playlists: {
        sermons: sermonsPlaylist,
        audioMessages: audioMessagesPlaylist,
        all: playlists
      }
    };

    // Add content based on request type
    if (contentType === 'sermons') {
      response.sermons = formatVideos(sermonsVideos);
      response.count = sermonsVideos.length;
    } else if (contentType === 'audio-messages') {
      response.audioMessages = formatVideos(audioVideos);
      response.count = audioVideos.length;
    } else {
      response.sermons = formatVideos(sermonsVideos);
      response.audioMessages = formatVideos(audioVideos);
      response.count = {
        sermons: sermonsVideos.length,
        audioMessages: audioVideos.length,
        total: sermonsVideos.length + audioVideos.length
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching church content:', error);
    return NextResponse.json(
        {
          error: 'Failed to fetch church content',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
    );
  }
}
