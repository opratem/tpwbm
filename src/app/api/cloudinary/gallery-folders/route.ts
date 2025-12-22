import { type NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import type { CloudinaryGalleryImage } from '@/lib/cloudinary-client';

// Gallery folder configuration - matches your Cloudinary structure
// Excluding 'leaders' and 'pastor' folders as they are for leadership page profile pictures
const GALLERY_FOLDERS = [
  'convention',
  'Bible Study',
  'Sunday Service', // Also matches "Sunday School"
  'children', // Children ministry photos
  'men', // Men ministry photos
  'women', // Women ministry photos
  'music', // Music ministry photos
  'youth' // Youth ministry photos
];

// Resource images to exclude from gallery folders (book covers, guides, etc.)
const EXCLUDED_RESOURCE_IDS = [
  'nurturing',
  'nurturing_your_child',
  'nurturing-your-child',
  'child_nurturing',
  'child-nurturing',
  'resources/nurturing',
  'books/nurturing',
  'guides/nurturing'
];

// Helper function to check if an image should be excluded as a resource
function isResourceImage(publicId: string, folderName: string): boolean {
  const lowerPublicId = publicId.toLowerCase();

  // Check against excluded resource IDs
  if (EXCLUDED_RESOURCE_IDS.some(excludedId => lowerPublicId.includes(excludedId))) {
    return true;
  }

  // Additional keyword checks for resource materials
  const resourceKeywords = ['nurturing', 'resource', 'book', 'cover', 'guide', 'manual', 'handbook', 'curriculum'];
  return resourceKeywords.some(keyword => lowerPublicId.includes(keyword));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder'); // Specific folder to fetch
    const maxResults = Number.parseInt(searchParams.get('maxResults') || '50');

    console.log('Gallery folders API - Parameters:', { folder, maxResults });

    // If specific folder requested, fetch from that folder only
    if (folder) {
      const images = await fetchImagesFromGalleryFolder(folder, maxResults);
      console.log(`Found ${images.length} images in gallery/${folder}`);
      return NextResponse.json({ images, folder });
    }

    // Otherwise, fetch from all gallery folders and organize by folder
    const organizedImages: { [key: string]: CloudinaryGalleryImage[] } = {};

    for (const folderName of GALLERY_FOLDERS) {
      const images = await fetchImagesFromGalleryFolder(folderName, maxResults);
      organizedImages[folderName] = images;
      console.log(`Found ${images.length} images in gallery/${folderName}`);
    }

    // Calculate total images
    const totalImages = Object.values(organizedImages).reduce((sum, imgs) => sum + imgs.length, 0);

    console.log(`Total gallery images organized: ${totalImages}`);

    return NextResponse.json({
      success: true,
      organizedImages,
      totalImages,
      availableFolders: GALLERY_FOLDERS
    });

  } catch (error) {
    console.error('Error in gallery folders API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images by folders', organizedImages: {}, totalImages: 0 },
      { status: 500 }
    );
  }
}

// Helper function to fetch images from a specific gallery folder
async function fetchImagesFromGalleryFolder(folderName: string, maxResults = 50): Promise<CloudinaryGalleryImage[]> {
  try {
    const folderPath = `gallery/${folderName}`;
    console.log(`Fetching images from: ${folderPath}`);

    // Try to fetch from the organized folder structure first
    let result;
    try {
      result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: maxResults,
        resource_type: 'image'
      });

      if (result && result.resources && result.resources.length > 0) {
        console.log(`Found ${result.resources.length} images in organized folder: ${folderPath}`);

        // Filter out sample images
        const validResources = result.resources.filter((resource: any) =>
          !resource.public_id.startsWith('samples/') &&
          !resource.public_id.startsWith('cld-sample') &&
          resource.public_id !== 'sample' &&
          // Filter out resource materials using helper function
          !isResourceImage(resource.public_id, folderName)
        );

        return validResources.map((resource: any) => ({
          id: resource.public_id,
          src: resource.secure_url,
          alt: formatImageAlt(resource.public_id, folderName),
          category: folderName,
          title: formatImageTitle(resource.public_id, folderName),
          date: new Date(resource.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          thumbnailSrc: generateThumbnailUrl(resource.public_id)
        }));
      }
    } catch (folderError) {
      console.log(`No organized folder found: ${folderPath}, trying fallback patterns`);
    }

    // Fallback: Try to find images in root that match this folder pattern
    console.log(`Falling back to pattern matching for: ${folderName}`);

    const rootResult = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'image'
    });

    if (!rootResult || !rootResult.resources) {
      return [];
    }

    // Filter images based on folder-specific patterns
    const filteredResources = rootResult.resources.filter((resource: any) => {
      const publicId = resource.public_id.toLowerCase();

      // Filter out sample images, leader/pastor images, and resource materials
      if (publicId.startsWith('samples/') ||
          publicId.startsWith('cld-sample') ||
          publicId === 'sample' ||
          publicId.includes('leader') ||
          publicId.includes('pastor') ||
          isResourceImage(resource.public_id, folderName)) {
        return false;
      }

      // Match patterns for different folders
      switch (folderName.toLowerCase()) {
        case 'convention':
          return publicId.includes('convention') ||
                 publicId.includes('church2') || // From your existing Church2_g1vs2z image
                 publicId.includes('gathering');

        case 'bible study':
          return publicId.includes('bible') ||
                 publicId.includes('study') ||
                 publicId.includes('teaching');

        case 'sunday service':
        case 'sunday school':
          return publicId.includes('sunday') ||
                 publicId.includes('service') ||
                 publicId.includes('school') ||
                 publicId.includes('worship');

        case 'children':
          return publicId.includes('children') || publicId.includes('child');

        case 'men':
          return publicId.includes('men');

        case 'women':
          return publicId.includes('women');

        case 'music':
          return publicId.includes('music') || publicId.includes('choir') || publicId.includes('band');

        case 'youth':
          return publicId.includes('youth');

        default:
          return publicId.includes(folderName.toLowerCase().replace(/\s+/g, '_'));
      }
    });

    console.log(`Found ${filteredResources.length} images using pattern matching for ${folderName}`);

    return filteredResources.slice(0, maxResults).map((resource: any) => ({
      id: resource.public_id,
      src: resource.secure_url,
      alt: formatImageAlt(resource.public_id, folderName),
      category: folderName,
      title: formatImageTitle(resource.public_id, folderName),
      date: new Date(resource.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      thumbnailSrc: generateThumbnailUrl(resource.public_id)
    }));

  } catch (error) {
    console.error(`Error fetching images from gallery/${folderName}:`, error);
    return [];
  }
}

// Helper function to format alt text
function formatImageAlt(publicId: string, folderName: string): string {
  const filename = publicId.split('/').pop() || 'image';
  const cleanName = filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
  return `${folderName} - ${cleanName}`;
}

// Helper function to format title
function formatImageTitle(publicId: string, folderName: string): string {
  const filename = publicId.split('/').pop() || 'image';
  const cleanName = filename
    .replace(/[-_]/g, ' ')
    .replace(/\.[^/.]+$/, '')
    .replace(/\b\w/g, l => l.toUpperCase());
  return cleanName;
}

// Helper function to generate thumbnail URL
function generateThumbnailUrl(publicId: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dk0wlbfky';
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_200,c_fill,q_auto,f_auto/v1/${publicId}`;
}
