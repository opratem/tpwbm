import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get('url');

    if (!mediaUrl) {
      return NextResponse.json({ error: 'Missing media URL' }, { status: 400 });
    }

    // Validate that it's a Cloudinary URL for security
    if (!mediaUrl.includes('res.cloudinary.com')) {
      return NextResponse.json({ error: 'Invalid media URL' }, { status: 400 });
    }

    console.log('Proxying media URL:', mediaUrl);

    // Fetch the media file from Cloudinary
    const response = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Church Website Media Proxy)',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch media:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch media: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the content type from the original response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Stream the media file back to the client with proper headers
    const mediaStream = response.body;

    return new NextResponse(mediaStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        // Forward content-length if available
        ...(response.headers.get('content-length') && {
          'Content-Length': response.headers.get('content-length')!
        }),
      },
    });

  } catch (error) {
    console.error('Media proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    },
  });
}
