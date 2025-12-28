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
    console.log('=== CLOUDINARY DEBUG START ===');

    // Test 1: Get ALL resources to see what's actually in the account
    const allResources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      resource_type: 'image'
    });

    console.log(`Total resources found: ${allResources.resources?.length || 0}`);

    // Log all public_ids to see the structure
    const allPublicIds = allResources.resources?.map((r: any) => r.public_id) || [];
    console.log('All public IDs:', allPublicIds);

    // Filter those that contain 'tpwbm'
    const tpwbmResources = allResources.resources?.filter((r: any) =>
        r.public_id.toLowerCase().includes('tpwbm')
    ) || [];

    console.log(`TPWBM resources found: ${tpwbmResources.length}`);
    console.log('TPWBM public IDs:', tpwbmResources.map((r: any) => r.public_id));

    // Test 2: Try to get root folders
    let rootFolders = [];
    try {
      const foldersResult = await cloudinary.api.sub_folders('');
      rootFolders = foldersResult.folders || [];
      console.log('Root folders:', rootFolders.map((f: any) => f.name));
    } catch (error) {
      console.log('Could not get root folders:', error instanceof Error ? error.message : String(error));
    }

    // NEW: Test 3a: Check what's specifically in the tpwbm folder
    let tpwbmFolderContents = [];
    try {
      const tpwbmResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'tpwbm/',
        max_results: 50,
        resource_type: 'image'
      });
      tpwbmFolderContents = tpwbmResult.resources || [];
      console.log(`Images in tpwbm folder: ${tpwbmFolderContents.length}`);
      console.log('TPWBM folder contents:', tpwbmFolderContents.map((r: any) => r.public_id));
    } catch (error) {
      console.log('Could not access tpwbm folder:', error instanceof Error ? error.message : String(error));
    }

    // NEW: Test 3b: Check subfolders of tpwbm
    let tpwbmSubfolders = [];
    try {
      const subfoldersResult = await cloudinary.api.sub_folders('tpwbm');
      tpwbmSubfolders = subfoldersResult.folders || [];
      console.log('TPWBM subfolders:', tpwbmSubfolders.map((f: any) => f.name));
    } catch (error) {
      console.log('Could not get TPWBM subfolders:', error instanceof Error ? error.message : String(error));
    }

    // Test 4: Try different variations for tpwbm
    const variations = ['tpwbm', 'TPWBM', 'tpwbm/', 'TPWBM/'];
    const variationResults: { [key: string]: any } = {};

    for (const variation of variations) {
      try {
        const result = await cloudinary.api.resources({
          type: 'upload',
          prefix: variation,
          max_results: 10,
          resource_type: 'image'
        });
        variationResults[variation] = {
          count: result.resources?.length || 0,
          resources: result.resources?.map((r: any) => r.public_id) || []
        };
      } catch (error) {
        variationResults[variation] = { error: error instanceof Error ? error.message : String(error) };
      }
    }

    console.log('Variation results:', variationResults);

    return NextResponse.json({
      success: true,
      summary: {
        total_images: allResources.resources?.length || 0,
        tpwbm_images: tpwbmResources.length,
        root_folders: rootFolders.map((f: any) => f.name),
        tpwbm_folder_images: tpwbmFolderContents.length,
        tpwbm_subfolders: tpwbmSubfolders.map((f: any) => f.name)
      },
      all_public_ids: allPublicIds.slice(0, 20), // Limit to first 20 for readability
      tpwbm_resources: tpwbmResources.map((r: any) => ({
        public_id: r.public_id,
        folder: r.folder,
        secure_url: r.secure_url,
        format: r.format
      })),
      tpwbm_folder_contents: tpwbmFolderContents.map((r: any) => ({
        public_id: r.public_id,
        folder: r.folder,
        secure_url: r.secure_url
      })),
      variation_tests: variationResults
    });

  } catch (error) {
    console.error('Debug API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: errorStack
    }, { status: 500 });
  }
}
