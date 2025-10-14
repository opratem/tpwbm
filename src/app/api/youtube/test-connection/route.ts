import { type NextRequest, NextResponse } from 'next/server';
import { getYouTubeAPI } from '@/lib/youtube-api';

export async function GET(request: NextRequest) {
  try {
    const youtube = getYouTubeAPI();

    if (!youtube) {
      return NextResponse.json({
        success: false,
        error: 'YouTube API not initialized',
        details: 'Please check your YouTube API key configuration'
      }, { status: 500 });
    }

    console.log('Testing YouTube API connection...');

    // Test 1: Get channel info
    const channelInfo = await youtube.getChannelInfo('PrevailingWord-d7h4o');

    if (!channelInfo) {
      return NextResponse.json({
        success: false,
        error: 'Could not find channel @PrevailingWord-d7h4o',
        details: 'Please verify the channel handle is correct and the channel is public'
      });
    }

    console.log('Channel found:', channelInfo.title);

    // Test 2: Get playlists
    const playlists = await youtube.getChannelPlaylists(channelInfo.id);

    console.log(`Found ${playlists.length} playlists`);

    // Test 3: Look for specific playlists
    const sermonsPlaylist = playlists.find(p =>
        p.title.toLowerCase().includes('sermon') ||
        p.title.toLowerCase().includes('preaching')
    );

    const audioPlaylist = playlists.find(p =>
        p.title.toLowerCase().includes('audio') ||
        p.title.toLowerCase().includes('message') ||
        p.title.toLowerCase().includes('teaching')
    );

    // Test 4: Get some recent videos
    const recentVideos = await youtube.getChannelVideos(channelInfo.id, 5);

    return NextResponse.json({
      success: true,
      channel: {
        id: channelInfo.id,
        title: channelInfo.title,
        description: channelInfo.description?.substring(0, 200) + '...',
        subscriberCount: channelInfo.subscriberCount,
        videoCount: channelInfo.videoCount
      },
      playlists: {
        total: playlists.length,
        all: playlists.map(p => ({
          id: p.id,
          title: p.title,
          itemCount: p.itemCount
        })),
        sermonsPlaylist: sermonsPlaylist ? {
          id: sermonsPlaylist.id,
          title: sermonsPlaylist.title,
          itemCount: sermonsPlaylist.itemCount
        } : null,
        audioPlaylist: audioPlaylist ? {
          id: audioPlaylist.id,
          title: audioPlaylist.title,
          itemCount: audioPlaylist.itemCount
        } : null
      },
      recentVideos: {
        count: recentVideos.length,
        videos: recentVideos.map(v => ({
          id: v.id,
          title: v.title,
          publishedAt: v.publishedAt,
          viewCount: v.viewCount
        }))
      },
      message: 'YouTube API connection successful! All systems ready.'
    });

  } catch (error) {
    console.error('YouTube API test failed:', error);

    let errorMessage = 'Unknown error occurred';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: errorDetails,
      apiKeySet: !!process.env.YOUTUBE_API_KEY || !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    }, { status: 500 });
  }
}
