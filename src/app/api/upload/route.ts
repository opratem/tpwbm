import { type NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Image compression settings for different content types
const COMPRESSION_SETTINGS = {
  blog: {
    quality: 80,
    maxWidth: 1200,
    maxHeight: 800,
    format: 'auto' as const,
    crop: 'fit' as const
  },
  event: {
    quality: 85,
    maxWidth: 1080,
    maxHeight: 1350, // Good for flyer aspect ratios
    format: 'auto' as const,
    crop: 'fit' as const
  },
  gallery: {
    quality: 90,
    maxWidth: 1600,
    maxHeight: 1200,
    format: 'auto' as const,
    crop: 'fit' as const
  },
  profile: {
    quality: 85,
    maxWidth: 400,
    maxHeight: 400,
    format: 'auto' as const,
    crop: 'fill' as const // Square crop for profile pictures
  },
  default: {
    quality: 75,
    maxWidth: 1024,
    maxHeight: 768,
    format: 'auto' as const,
    crop: 'fit' as const
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'church_media';
    const tags = formData.get('tags') as string || 'church,media';
    const contentType = formData.get('contentType') as string || 'default'; // blog, event, gallery, default

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      return NextResponse.json({
        error: 'File size too large. Maximum size is 10MB.'
      }, { status: 400 });
    }

    // Get compression settings based on content type
    const compressionSettings = COMPRESSION_SETTINGS[contentType as keyof typeof COMPRESSION_SETTINGS] || COMPRESSION_SETTINGS.default;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 data URL
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Clean filename for public ID
    const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = Date.now();
    const publicId = `${cleanFileName}_${timestamp}`;

    // Upload to Cloudinary with compression
    const result = await uploadToCloudinary(base64Data, {
      folder,
      tags: [...tags.split(','), contentType],
      publicId,
      transformation: {
        width: compressionSettings.maxWidth,
        height: compressionSettings.maxHeight,
        crop: compressionSettings.crop,
        quality: compressionSettings.quality,
        format: compressionSettings.format,
        // Auto-orient based on EXIF data
        angle: 'auto_right'
      }
    });

    // Calculate estimated compression ratio
    const originalSizeKB = Math.round(file.size / 1024);
    const compressionInfo = {
      originalSize: `${originalSizeKB} KB`,
      contentType,
      compressionLevel: compressionSettings.quality,
      maxDimensions: `${compressionSettings.maxWidth}x${compressionSettings.maxHeight}`
    };

    return NextResponse.json({
      success: true,
      url: result.secureUrl,
      publicId: result.publicId,
      compressionInfo,
      message: 'Image uploaded and compressed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
    );
  }
}

// Support for bulk upload with compression
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'church_media';
    const tags = formData.get('tags') as string || 'church,media';
    const contentType = formData.get('contentType') as string || 'default';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate batch size
    if (files.length > 10) {
      return NextResponse.json({
        error: 'Too many files. Maximum 10 files per batch.'
      }, { status: 400 });
    }

    const compressionSettings = COMPRESSION_SETTINGS[contentType as keyof typeof COMPRESSION_SETTINGS] || COMPRESSION_SETTINGS.default;

    const uploadPromises = files.map(async (file, index) => {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          return {
            success: false,
            filename: file.name,
            error: 'Invalid file type'
          };
        }

        // Validate file size
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeInBytes) {
          return {
            success: false,
            filename: file.name,
            error: 'File size too large'
          };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

        const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
        const timestamp = Date.now();
        const publicId = `${cleanFileName}_${timestamp}_${index}`;

        const result = await uploadToCloudinary(base64Data, {
          folder,
          tags: [...tags.split(','), contentType, 'bulk_upload'],
          publicId,
          transformation: {
            width: compressionSettings.maxWidth,
            height: compressionSettings.maxHeight,
            crop: compressionSettings.crop,
            quality: compressionSettings.quality,
            format: compressionSettings.format,
            angle: 'auto_right'
          }
        });

        const originalSizeKB = Math.round(file.size / 1024);

        return {
          success: true,
          filename: file.name,
          url: result.secureUrl,
          publicId: result.publicId,
          compressionInfo: {
            originalSize: `${originalSizeKB} KB`,
            compressionLevel: compressionSettings.quality
          }
        };
      } catch (error) {
        return {
          success: false,
          filename: file.name,
          error: error instanceof Error ? error.message : 'Upload failed'
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        compressionSettings: {
          contentType,
          quality: compressionSettings.quality,
          maxDimensions: `${compressionSettings.maxWidth}x${compressionSettings.maxHeight}`
        }
      }
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
        { error: 'Failed to upload images' },
        { status: 500 }
    );
  }
}
