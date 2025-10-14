import { type NextRequest, NextResponse } from 'next/server';
import { listTPWBMImages } from '@/lib/cloudinary';
import cloudinary from '@/lib/cloudinary';
import type { CloudinaryGalleryImage } from '@/lib/cloudinary-client';

// Extended interface for audio/video resources
interface CloudinaryAudioVideoResource {
  id: string;
  src: string;
  title: string;
  resource_type: 'image' | 'video' | 'raw';
  format: string;
  duration?: number;
  public_id: string;
}

// Interface for raw Cloudinary API resource
interface CloudinaryResource {
  public_id: string;
  asset_folder?: string;
  resource_type: string;
  format: string;
  duration?: number;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'tpwbm';
    const subfolder = searchParams.get('subfolder') || '';
    const maxResults = Number.parseInt(searchParams.get('maxResults') || '50');

    console.log('API Route - Parameters:', { folder, subfolder, maxResults });

    // For audio_messages, also fetch video/audio files
    if (subfolder === 'audio_messages') {
      try {
        // Fetch both images and videos from audio_messages folder
        const [images, videos] = await Promise.all([
          listTPWBMImages(subfolder, maxResults),
          fetchAudioVideoFiles(subfolder, maxResults)
        ]);

        const combinedResults = {
          images,
          videos,
          audioFiles: videos // alias for backward compatibility
        };

        console.log(`API Route - Found ${images.length} images and ${videos.length} video/audio files`);
        return NextResponse.json(combinedResults);
      } catch (error) {
        console.error('Error fetching audio_messages content:', error);
        // Fallback to images only
        const images = await listTPWBMImages(subfolder, maxResults);
        return NextResponse.json({ images, videos: [], audioFiles: [] });
      }
    }

    // For other subfolders, fetch images only
    const images = await listTPWBMImages(subfolder, maxResults);
    console.log(`API Route - Found ${images.length} images`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error in Cloudinary API route:', error);
    return NextResponse.json(
        { error: 'Failed to fetch images from Cloudinary', images: [], videos: [], audioFiles: [] },
        { status: 500 }
    );
  }
}

// Helper function to fetch audio/video files from Cloudinary
async function fetchAudioVideoFiles(subfolder: string, maxResults = 50): Promise<CloudinaryAudioVideoResource[]> {
  try {
    const folderPath = `tpwbm/${subfolder}`;
    console.log(`Fetching video/audio files from: ${folderPath}`);

    // First try organized folder structure
    let organizedVideos: CloudinaryResource[] = [];
    try {
      const videoResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: maxResults,
        resource_type: 'video'
      });
      organizedVideos = videoResult?.resources || [];
      console.log(`Found ${organizedVideos.length} video/audio files in organized folder`);
    } catch (error) {
      console.log('No organized folder found or error accessing it');
    }

    // Always check root level for videos that should belong to audio_messages
    console.log('Checking root level for video/audio files...');
    const rootVideoResult = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'video'
    });

    const audioMessageFiles = rootVideoResult.resources?.filter((resource: CloudinaryResource) => {
      const publicId = resource.public_id.toLowerCase();
      const assetFolder = resource.asset_folder?.toLowerCase() || '';

      // Don't include sample videos
      if (publicId.startsWith('samples/')) return false;

      // First priority: Check if file is in the actual audio_messages asset folder
      if (assetFolder.includes('audio_messages')) {
        return true;
      }

      // Second priority: Include videos that match audio message patterns
      return publicId.includes('akoko') ||
          publicId.includes('iriju') ||
          publicId.includes('sermon') ||
          publicId.includes('message') ||
          publicId.includes('pastor') ||
          publicId.includes('audio') ||
          publicId.includes('truth') ||
          publicId.includes('kingdom') ||
          publicId.includes('proof') ||
          publicId.includes('commitment') ||
          publicId.includes('god');
    }) || [];

    console.log(`Found ${audioMessageFiles.length} video/audio files in root level using asset_folder + patterns`);
    console.log('Root level video files:', audioMessageFiles.map((r: CloudinaryResource) => ({
      public_id: r.public_id,
      asset_folder: r.asset_folder
    })));


    // Combine organized folder videos (if any) with root level videos
    const allVideos = [...organizedVideos, ...audioMessageFiles];

    console.log(`Total: ${organizedVideos.length} organized + ${audioMessageFiles.length} root level = ${allVideos.length} video/audio files`);
    return mapVideoResources(allVideos);

  } catch (error) {
    console.error('Error fetching video/audio files:', error);
    return [];
  }
}

// Helper function to map video resources to our interface
function mapVideoResources(resources: any[]): CloudinaryAudioVideoResource[] {
  return resources.map((resource: any) => ({
    id: resource.public_id,
    src: resource.secure_url,
    title: formatResourceTitle(resource.public_id),
    resource_type: resource.resource_type,
    format: resource.format,
    duration: resource.duration,
    public_id: resource.public_id
  }));
}

// Helper function to format resource title
function formatResourceTitle(publicId: string): string {
  return publicId
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .split('/')
      .pop() || 'Media File';
}
