import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log('🔍 Starting Cloudinary structure investigation...');

    // Get all images to see the actual structure
    const allImages = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'image'
    });

    console.log(`Found ${allImages.resources?.length || 0} total images`);

    // Filter out sample images
    const nonSampleImages = allImages.resources.filter((resource: any) =>
        !resource.public_id.startsWith('samples/') &&
        !resource.public_id.startsWith('cld-sample') &&
        resource.public_id !== 'sample'
    );

    console.log(`Non-sample images: ${nonSampleImages.length}`);

    // Analyze the folder structure
    const folderAnalysis: { [key: string]: string[] } = {};
    const publicIds = nonSampleImages.map((img: any) => img.public_id);

    publicIds.forEach((id: string) => {
      const parts = id.split('/');
      if (parts.length > 1) {
        const folder = parts[0];
        if (!folderAnalysis[folder]) {
          folderAnalysis[folder] = [];
        }
        folderAnalysis[folder].push(id);
      } else {
        if (!folderAnalysis['root']) {
          folderAnalysis['root'] = [];
        }
        folderAnalysis['root'].push(id);
      }
    });

    // Try to get folders using API
    let folders = [];
    try {
      const folderResult = await cloudinary.api.root_folders();
      folders = folderResult.folders || [];
    } catch (error) {
      console.log('Could not fetch folders:', error instanceof Error ? error.message : String(error));
    }

    return NextResponse.json({
      success: true,
      totalImages: allImages.resources?.length || 0,
      nonSampleImages: nonSampleImages.length,
      folderStructure: folderAnalysis,
      cloudinaryFolders: folders,
      samplePublicIds: publicIds.slice(0, 20), // First 20 for inspection
      debugInfo: {
        message: 'This endpoint shows the actual structure of your Cloudinary account',
        nextSteps: 'Use this information to update the folder paths in your code'
      }
    });

  } catch (error) {
    console.error('Debug structure error:', error);
    return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to debug structure',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        },
        { status: 500 }
    );
  }
}
