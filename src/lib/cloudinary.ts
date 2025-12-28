import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Interface for Cloudinary resource objects
interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  url: string;
  filename?: string;
  created_at: string;
  tags?: string[];
  context?: {
    custom?: {
      title?: string;
      speaker?: string;
      date?: string;
      series?: string;
      description?: string;
      video_url?: string;
      audio_url?: string;
      duration?: string;
    };
  };
}

// Interface for Cloudinary API response
interface CloudinaryApiResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
  total_count?: number;
}

// Interface for image transformations
interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  angle?: string | number;
}

// Interface for gallery images
export interface CloudinaryGalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  date: string;
  thumbnailSrc?: string;
}

// Generate optimized Cloudinary URL
export function getCloudinaryImageUrl(
    publicId: string,
    options: CloudinaryTransformOptions = {}
): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    angle
  } = options;

  const transformations = [];

  // Always apply automatic format and quality for best performance
  transformations.push('f_auto'); // Auto format (WebP/AVIF)
  transformations.push('q_auto:good'); // Auto quality optimization

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (angle !== undefined) transformations.push(`a_${angle}`);

  // Add dpr_auto for retina displays
  transformations.push('dpr_auto');

  const transformString = transformations.length > 0 ? `/${transformations.join(',')}` : '';

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload${transformString}/v1/${publicId}`;
}

// Generate thumbnail URL
export function getCloudinaryThumbnail(publicId: string): string {
  return getCloudinaryImageUrl(publicId, {
    width: 300,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
}

// Generate responsive image srcSet
export function getCloudinaryResponsiveUrls(publicId: string): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  const src = getCloudinaryImageUrl(publicId, { width: 800, quality: 'auto' });

  const srcSet = [
    `${getCloudinaryImageUrl(publicId, { width: 400, quality: 'auto' })} 400w`,
    `${getCloudinaryImageUrl(publicId, { width: 800, quality: 'auto' })} 800w`,
    `${getCloudinaryImageUrl(publicId, { width: 1200, quality: 'auto' })} 1200w`,
    `${getCloudinaryImageUrl(publicId, { width: 1600, quality: 'auto' })} 1600w`,
  ].join(', ');

  const sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1600px';

  return { src, srcSet, sizes };
}

// Upload image to Cloudinary (server-side only)
export async function uploadToCloudinary(
    file: File | Buffer | string,
    options: {
      folder?: string;
      publicId?: string;
      tags?: string[];
      transformation?: CloudinaryTransformOptions;
    } = {}
): Promise<{ url: string; publicId: string; secureUrl: string }> {
  try {
    const uploadOptions = {
      folder: options.folder || 'church_media',
      public_id: options.publicId,
      tags: options.tags || ['church', 'media'],
      resource_type: 'image' as const,
      ...options.transformation && {
        transformation: [options.transformation]
      }
    };

    const result = await cloudinary.uploader.upload(file as string, uploadOptions);

    return {
      url: result.url,
      publicId: result.public_id,
      secureUrl: result.secure_url
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

// List images from a specific folder
export async function listCloudinaryImages(
    folder = 'tpwbm',
    maxResults = 50
): Promise<CloudinaryGalleryImage[]> {
  try {
    console.log(`Searching for images in folder: ${folder}`);

    // Try using Admin API instead of Search API
    let result: CloudinaryApiResponse | null = null;
    try {
      // Use Admin API to list resources in folder
      result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: maxResults,
        resource_type: 'image'
      }) as CloudinaryApiResponse;

      console.log(`Admin API - Found ${result.resources?.length || 0} images in folder: ${folder}`);
    } catch (adminError) {
      console.log('Admin API failed, trying Search API...', adminError);

      // Fallback to Search API with different syntax
      try {
        result = await cloudinary.search
            .expression(`folder="${folder}"`)
            .sort_by('created_at', 'desc')
            .max_results(maxResults)
            .execute() as CloudinaryApiResponse;

        console.log(`Search API - Found ${result.resources?.length || 0} images in folder: ${folder}`);
      } catch (searchError) {
        console.log('Search API also failed:', searchError);

        // Try without quotes
        result = await cloudinary.search
            .expression(`public_id:${folder}/*`)
            .sort_by('created_at', 'desc')
            .max_results(maxResults)
            .execute() as CloudinaryApiResponse;

        console.log(`Public ID search - Found ${result.resources?.length || 0} images in folder: ${folder}`);
      }
    }

    if (!result || !result.resources) {
      console.log(`No resources found in folder: ${folder}`);
      return [];
    }

    console.log(`Found ${result.resources.length} images in folder: ${folder}`);

    return result.resources.map((resource: CloudinaryResource) => ({
      id: resource.public_id,
      src: resource.secure_url,
      alt: resource.filename || resource.public_id.split('/').pop() || 'Church Image',
      category: determineCategoryFromPath(resource.public_id),
      title: resource.filename?.replace(/[-_]/g, ' ') || 'Church Image',
      date: new Date(resource.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      }),
      thumbnailSrc: getCloudinaryImageUrl(resource.public_id, { width: 300, height: 200, crop: 'fill' })
    }));
  } catch (error) {
    console.error('Error listing Cloudinary images:', error);

    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

// List images from a specific TPWBM subfolder
export async function listTPWBMImages(
    subfolder: string,
    maxResults = 50
): Promise<CloudinaryGalleryImage[]> {
  console.log(`Fetching TPWBM images for subfolder: ${subfolder}`);

  try {
    // First try to fetch from organized folder structure
    const folderPath = `tpwbm/${subfolder}`;
    console.log(`Trying organized folder path: ${folderPath}`);

    let result: CloudinaryApiResponse | null = null;
    try {
      // Try Admin API for folder structure first
      result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: maxResults,
        resource_type: 'image'
      }) as CloudinaryApiResponse;

      if (result?.resources && result.resources.length > 0) {
        console.log(`Found ${result.resources.length} images in organized folder: ${folderPath}`);

        const validResources = result.resources.filter((resource: CloudinaryResource) =>
            !resource.public_id.startsWith('samples/') &&
            !resource.public_id.startsWith('cld-sample') &&
            resource.public_id !== 'sample'
        );

        return validResources.map((resource: CloudinaryResource) => ({
          id: resource.public_id,
          src: resource.secure_url,
          alt: formatImageAlt(resource.public_id),
          category: subfolder,
          title: formatImageTitle(resource.public_id),
          date: new Date(resource.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          }),
          thumbnailSrc: getCloudinaryImageUrl(resource.public_id, { width: 300, height: 200, crop: 'fill' })
        }));
      }
    } catch (folderError) {
      console.log(`No organized folder found: ${folderPath}`);
    }

    // Fallback: Fetch from root level and filter by naming patterns
    console.log(`Falling back to root-level filtering for: ${subfolder}`);

    result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'image'
    }) as CloudinaryApiResponse;

    if (!result || !result.resources) {
      return [];
    }

    // Filter out Cloudinary sample images
    const nonSampleResources = result.resources.filter((resource: CloudinaryResource) =>
        !resource.public_id.startsWith('samples/') &&
        !resource.public_id.startsWith('cld-sample') &&
        resource.public_id !== 'sample'
    );

    // Filter images based on subfolder type using improved naming patterns
    let filteredResources: CloudinaryResource[] = [];

    switch (subfolder) {
      case 'gallery':
        filteredResources = nonSampleResources.filter((resource: CloudinaryResource) => {
          const publicId = resource.public_id.toLowerCase();
          return publicId.startsWith('church') && !publicId.includes('logo');
        });
        break;

      case 'leaders':
        // First try the organized tpwbm/leaders folder
        try {
          result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'tpwbm/leaders',
            max_results: maxResults,
            resource_type: 'image'
          }) as CloudinaryApiResponse;

          if (result?.resources && result.resources.length > 0) {
            console.log(`Found ${result.resources.length} images in tpwbm/leaders folder`);
            filteredResources = result.resources;
            break; // Exit the switch case early since we found images
          }
        } catch (error) {
          console.log('No images found in tpwbm/leaders folder, trying root directory');
        }

        // Fallback: If no images in tpwbm/leaders, look in root directory for leader images
        filteredResources = nonSampleResources.filter((resource: CloudinaryResource) => {
          const publicId = resource.public_id.toLowerCase();
          return (publicId.includes('pastor') && (publicId.includes('tunde') || publicId.includes('esther'))) ||
              publicId.includes('dn.') || publicId.includes('dns.') ||
              publicId.includes('evang') || publicId.includes('minister') ||
              (publicId.includes('mrs.') || publicId.includes('mrs_')) ||
              (publicId.includes('bro.') || publicId.includes('bro_'));
        });
        break;

      case 'pastor':
        filteredResources = nonSampleResources.filter((resource: CloudinaryResource) => {
          const publicId = resource.public_id.toLowerCase();
          return publicId.includes('pastor-image') ||
              publicId.includes('pastor_tunde') ||
              publicId.includes('pastor_esther');
        });
        break;

      case 'resources':
        filteredResources = nonSampleResources.filter((resource: CloudinaryResource) => {
          const publicId = resource.public_id.toLowerCase();
          return publicId.includes('success-laws') ||
              publicId.includes('winning-church') ||
              publicId.includes('responsible-mothers') ||
              publicId.includes('nuturing') ||
              publicId.includes('isegun');
        });
        break;

      case 'children':
        filteredResources = nonSampleResources.filter((resource: CloudinaryResource) => {
          const publicId = resource.public_id.toLowerCase();
          return publicId.includes('children');
        });
        break;

      case 'audio_messages':
      case 'sermons':
        filteredResources = nonSampleResources.filter((resource: CloudinaryResource) => {
          const publicId = resource.public_id.toLowerCase();
          return publicId.includes('sermon') ||
              publicId.includes('message') ||
              publicId.includes('audio') ||
              publicId.includes('bible_study');
        });
        break;

      default:
        filteredResources = nonSampleResources.filter((resource: CloudinaryResource) =>
            resource.public_id.toLowerCase().includes(subfolder.toLowerCase())
        );
    }

    console.log(`Found ${filteredResources.length} images for ${subfolder} using naming patterns:`);
    console.log('Image public IDs:', filteredResources.map(r => r.public_id));

    // Limit results
    const limitedResources = filteredResources.slice(0, maxResults);

    return limitedResources.map((resource: CloudinaryResource) => ({
      id: resource.public_id,
      src: resource.secure_url,
      alt: formatImageAlt(resource.public_id),
      category: subfolder,
      title: formatImageTitle(resource.public_id),
      date: new Date(resource.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      }),
      thumbnailSrc: getCloudinaryImageUrl(resource.public_id, { width: 300, height: 200, crop: 'fill' })
    }));

  } catch (error) {
    console.error(`Error fetching TPWBM images for ${subfolder}:`, error);
    return [];
  }
}

// Helper function to format alt text from public_id
function formatImageAlt(publicId: string): string {
  return publicId
      .replace(/[-_]/g, ' ')
      .split('/')
      .pop() || 'Church Image';
}

// Helper function to format title from public_id
function formatImageTitle(publicId: string): string {
  return publicId
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .split('/')
      .pop() || 'Church Image';
}

// Determine category from the folder path
function determineCategoryFromPath(publicId: string): string {
  const path = publicId.toLowerCase();

  if (path.includes('tpwbm/gallery')) return 'gallery';
  if (path.includes('tpwbm/audio_messages')) return 'audio';
  if (path.includes('tpwbm/sermon')) return 'sermon';
  if (path.includes('tpwbm/leaders')) return 'leadership';
  if (path.includes('tpwbm/pastor')) return 'pastor';
  if (path.includes('tpwbm/events')) return 'events';
  if (path.includes('tpwbm/ministries')) return 'ministry';
  if (path.includes('tpwbm/children')) return 'children';
  if (path.includes('tpwbm/resources')) return 'resources';
  if (path.includes('tpwbm/worship')) return 'worship';

  return 'general';
}

// Church-specific image paths using your tpwbm folder
export const churchImages = {
  logo: 'CHURCH_LOGO_wkergc', // Using actual public ID from debug
  theme2025: '2025_theme_zg0zqd', // Using actual public ID from debug
  pastor: {
    image1: 'pastor-image-1_qvub82',
    image2: 'pastor-image-2_siqk1f'
  },
  gallery: {
    church1: 'Church1_ihqqwc',
    church2: 'Church2_g1vs2z',
    church3: 'Church3_biwr04',
    church4: 'Church4_jququz'
  },
  leaders: {
    // Will be populated with your actual leader image public IDs
  },
  children: {
    children1: 'Children-1_efo7ka',
    children2: 'Children-2_chweao'
  },
  resources: {
    winningChurch: 'The-Winning-Church-Workers-and-Leaders_fllazl',
    successLaws: '42-Success-Laws-Of-Productive-Church-Workers_w015hd'
  }
};

// Interface for sermon media from Cloudinary
export interface CloudinarySermonMedia {
  id: string;
  title: string;
  speaker: string;
  date: string;
  series?: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  audioUrl?: string;
  duration?: string;
  tags: string[];
}

// Get sermon media from TPWBM sermon folder
export async function getSermonMedia(maxResults = 50): Promise<CloudinarySermonMedia[]> {
  try {
    const result = await cloudinary.search
        .expression('folder:tpwbm/sermon')
        .sort_by('created_at', 'desc')
        .max_results(maxResults)
        .execute() as CloudinaryApiResponse;

    return result.resources.map((resource: CloudinaryResource) => {
      // Extract metadata from filename or tags if available
      const filename = resource.filename || resource.public_id.split('/').pop() || '';
      const cleanTitle = filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');

      return {
        id: resource.public_id,
        title: resource.context?.custom?.title || cleanTitle || 'Sermon',
        speaker: resource.context?.custom?.speaker || 'Church Speaker',
        date: resource.context?.custom?.date || resource.created_at,
        series: resource.context?.custom?.series,
        description: resource.context?.custom?.description || "A powerful message from our church family.",
        thumbnail: resource.secure_url,
        videoUrl: resource.context?.custom?.video_url,
        audioUrl: resource.context?.custom?.audio_url,
        duration: resource.context?.custom?.duration,
        tags: resource.tags || ['sermon', 'message']
      };
    });
  } catch (error) {
    console.error('Error fetching sermon media from Cloudinary:', error);
    return [];
  }
}

export default cloudinary;
