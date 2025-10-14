import { NextResponse, type NextRequest } from 'next/server';
import { getSermonMedia } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = Number.parseInt(searchParams.get('limit') || '100');

    const sermons = await getSermonMedia(maxResults);

    return NextResponse.json({
      success: true,
      sermons,
      count: sermons.length
    });
  } catch (error) {
    console.error('Error fetching Cloudinary sermons:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sermons',
        sermons: []
      },
      { status: 500 }
    );
  }
}
