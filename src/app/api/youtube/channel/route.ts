import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeAPI } from '@/lib/youtube-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelHandle = searchParams.get('handle');

    if (!channelHandle) {
      return NextResponse.json(
          { error: 'Channel handle is required' },
          { status: 400 }
      );
    }

    const youtube = getYouTubeAPI();

    if (!youtube) {
      return NextResponse.json(
          { error: 'YouTube API not available' },
          { status: 503 }
      );
    }

    const channelInfo = await youtube.getChannelInfo(channelHandle);

    if (!channelInfo) {
      return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      channel: channelInfo
    });

  } catch (error) {
    console.error('Error fetching channel info:', error);
    return NextResponse.json(
        {
          error: 'Failed to fetch channel information',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
    );
  }
}
