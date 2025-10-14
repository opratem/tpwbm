import { type NextRequest, NextResponse } from 'next/server';

interface FacebookVideo {
  id: string;
  title: string;
  description: string;
  created_time: string;
  picture: string;
  source?: string;
  permalink_url: string;
  thumbnails?: {
    data: Array<{
      uri: string;
      width: number;
      height: number;
    }>;
  };
}

interface FacebookGroupVideosResponse {
  data: FacebookVideo[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';

    const groupId = process.env.FACEBOOK_GROUP_ID;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!groupId || !accessToken) {
      return NextResponse.json(
        { error: 'Facebook configuration not found' },
        { status: 500 }
      );
    }

    // Try to fetch videos from Facebook Group using Graph API
    const facebookUrl = `https://graph.facebook.com/v18.0/${groupId}/videos`;
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,title,description,created_time,picture,source,permalink_url,thumbnails',
      limit: limit,
    });

    const response = await fetch(`${facebookUrl}?${params.toString()}`);
    const data: FacebookGroupVideosResponse = await response.json();

    if (!response.ok) {
      console.error('Facebook API error:', data);

      // Return mock data if API fails (for development/demo purposes)
      const mockVideos = [
        {
          id: 'mock_1',
          title: 'Sunday Worship Service - Live Stream',
          description: 'Join us for our weekly worship service with Pastor \'Tunde Olufemi',
          created_time: new Date().toISOString(),
          picture: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop',
          permalink_url: 'https://web.facebook.com/groups/1873785202754614',
          embed_html: null
        },
        {
          id: 'mock_2',
          title: 'Midweek Bible Study',
          description: 'Diving deeper into God\'s word with our church family',
          created_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
          permalink_url: 'https://web.facebook.com/groups/1873785202754614',
          embed_html: null
        },
        {
          id: 'mock_3',
          title: 'Youth Ministry Outreach',
          description: 'Our youth making a difference in the community',
          created_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          picture: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=450&fit=crop',
          permalink_url: 'https://web.facebook.com/groups/1873785202754614',
          embed_html: null
        }
      ];

      return NextResponse.json({
        success: true,
        videos: mockVideos,
        message: 'Using demo data - configure Facebook access token for live data'
      });
    }

    // Process the videos
    const processedVideos = data.data?.map(video => ({
      id: video.id,
      title: video.title || 'Church Video',
      description: video.description || '',
      created_time: video.created_time,
      picture: video.picture || '/placeholder-video.jpg',
      permalink_url: video.permalink_url,
      embed_html: video.source ? `
        <iframe
          src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.permalink_url)}&width=500"
          width="500"
          height="280"
          style="border:none;overflow:hidden"
          scrolling="no"
          frameborder="0"
          allowfullscreen="true"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
        </iframe>
      ` : null
    })) || [];

    return NextResponse.json({
      success: true,
      videos: processedVideos,
      total: processedVideos.length
    });

  } catch (error) {
    console.error('Facebook videos API error:', error);

    // Return mock data as fallback
    const mockVideos = [
      {
        id: 'mock_1',
        title: 'Sunday Worship Service - Live Stream',
        description: 'Join us for our weekly worship service with Pastor \'Tunde Olufemi',
        created_time: new Date().toISOString(),
        picture: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop',
        permalink_url: 'https://web.facebook.com/groups/1873785202754614',
        embed_html: null
      }
    ];

    return NextResponse.json({
      success: true,
      videos: mockVideos,
      message: 'Using demo data - check Facebook API configuration'
    });
  }
}
