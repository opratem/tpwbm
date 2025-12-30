// Client-safe Cloudinary utilities (no server SDK imports)

// Interface for image transformations
interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
}

// Interface for gallery images (client-side compatible)
export interface CloudinaryGalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  date: string;
  thumbnailSrc?: string;
}

// Generate optimized Cloudinary URL (client-safe)
export function getCloudinaryImageUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dk0wlbfky';

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto'
  } = options;

  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (gravity) transformations.push(`g_${gravity}`);

  const transformString = transformations.length > 0 ? `/${transformations.join(',')}` : '';

  return `https://res.cloudinary.com/${cloudName}/image/upload${transformString}/v1/${publicId}`;
}

// Generate thumbnail URL (client-safe)
export function getCloudinaryThumbnail(publicId: string): string {
  return getCloudinaryImageUrl(publicId, {
    width: 300,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
}

// Generate responsive image srcSet (client-safe)
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

// Generate optimized Cloudinary media URL for audio/video with CORS handling
export function getCloudinaryMediaUrl(
  publicId: string,
  options: {
    resourceType?: 'video' | 'audio' | 'auto';
    format?: 'auto' | 'mp3' | 'mp4' | 'webm' | 'ogg';
    quality?: 'auto' | number;
    streaming?: boolean;
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dk0wlbfky';

  const {
    resourceType = 'video',
    format = 'auto',
    quality = 'auto',
    streaming = true
  } = options;

  const transformations = [];

  // Add CORS-friendly transformations
  transformations.push('fl_force_strip'); // Remove metadata that might cause CORS issues

  if (format !== 'auto') transformations.push(`f_${format}`);
  if (quality !== 'auto') transformations.push(`q_${quality}`);

  // Add streaming attachment for better CORS handling
  if (streaming) {
    transformations.push('fl_streaming_attachment');
  }

  const transformString = transformations.length > 0 ? `/${transformations.join(',')}` : '';

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload${transformString}/v1/${publicId}`;
}

// Church-specific image paths using your tpwbm folder (client-safe)
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
    // Real leader images will be fetched from Cloudinary API
    // Available: Mrs., Dn., Dns., Bro., Evang., Minister titles
  },
  children: {
    children1: 'Children-1_efo7ka',
    children2: 'Children-2_chweao'
  },
  resources: {
    winningChurch: 'The-Winning-Church-Workers-and-Leaders_fllazl',
    successLaws: '42-Success-Laws-Of-Productive-Church-Workers_w015hd',
    responsibleMothers: 'The-Responsible-Mothers_xyz123', // Add when available
    nurturing: 'Nuturing-Your-Children-In-God-s-Own-Way_xyz123', // Add when available
    isegun: 'Isegun-Lori-Ogun-To-Ndena_Ogo_xyz123' // Add when available
  }
};
