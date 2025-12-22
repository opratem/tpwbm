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
    console.log('Testing Cloudinary connection...');

    // Test 1: Basic connection and list some resources
    const basicTest = await cloudinary.search
        .max_results(20)
        .execute();

    // Test 1b: Try listing all resources without any filters
    const allResourcesTest = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50,
      resource_type: 'image'
    });

    // Test 2: Try different approaches to search tpwbm folder
    const tpwbmTest: any = {};

    // Try Admin API approach
    try {
      const adminResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'tpwbm',
        max_results: 20,
        resource_type: 'image'
      });
      tpwbmTest.admin_api = {
        total_count: adminResult.resources?.length || 0,
        resources: adminResult.resources?.map((r: any) => ({
          public_id: r.public_id,
          folder: r.folder,
          format: r.format
        })) || []
      };
    } catch (adminError) {
      tpwbmTest.admin_api = { error: adminError instanceof Error ? adminError.message : 'Unknown error' };
    }

    // Try Search API approach
    try {
      const searchResult = await cloudinary.search
          .expression('folder:tpwbm*')
          .max_results(20)
          .execute();
      tpwbmTest.search_api = {
        total_count: searchResult.total_count || 0,
        resources_found: searchResult.resources?.length || 0,
        resources: searchResult.resources?.map((r: any) => ({
          public_id: r.public_id,
          folder: r.folder,
          format: r.format
        })) || []
      };
    } catch (searchError) {
      tpwbmTest.search_api = { error: searchError instanceof Error ? searchError.message : 'Unknown error' };
    }

    // Test 3: Try to get folders list
    let foldersTest;
    try {
      foldersTest = await cloudinary.api.sub_folders('tpwbm');
    } catch (folderError) {
      console.log('TPWBM subfolders test failed:', folderError);
      try {
        // Try getting root folders
        foldersTest = await cloudinary.api.sub_folders('');
      } catch (rootError) {
        foldersTest = { error: rootError instanceof Error ? rootError.message : 'Unknown error' };
      }
    }

    // Test 4: Try gallery specific search using Admin API
    let galleryTest;
    try {
      galleryTest = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'tpwbm/gallery',
        max_results: 10,
        resource_type: 'image'
      });
      console.log('Gallery Admin API result:', galleryTest);
    } catch (galleryError) {
      console.log('Gallery test failed:', galleryError);
      galleryTest = { error: galleryError instanceof Error ? galleryError.message : 'Unknown error' };
    }

    // Test 5: Try audio_messages specific search
    let audioTest;
    try {
      audioTest = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'tpwbm/audio_messages',
        max_results: 5,
        resource_type: 'image'
      });
    } catch (audioError) {
      console.log('Audio messages test failed:', audioError);
      audioTest = { error: audioError instanceof Error ? audioError.message : 'Unknown error' };
    }

    return NextResponse.json({
      success: true,
      connection: 'OK',
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        has_api_key: !!process.env.CLOUDINARY_API_KEY,
        has_api_secret: !!process.env.CLOUDINARY_API_SECRET
      },
      debug: {
        env_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        expected_from_url: 'c-0fd29caafece4d85b10e592ba84a0b',
        actual_cloudinary_config: {
          cloud_name: cloudinary.config().cloud_name,
          api_key: cloudinary.config().api_key ? 'SET' : 'NOT_SET',
          api_secret: cloudinary.config().api_secret ? 'SET' : 'NOT_SET'
        }
      },
      tests: {
        basic: {
          total_count: basicTest.total_count || 0,
          resources_found: basicTest.resources?.length || 0,
          sample_resources: basicTest.resources?.slice(0, 5).map((r: any) => ({
            public_id: r.public_id,
            folder: r.folder,
            format: r.format
          })) || []
        },
        all_resources: {
          total_count: allResourcesTest.resources?.length || 0,
          sample_resources: allResourcesTest.resources?.slice(0, 10).map((r: any) => ({
            public_id: r.public_id,
            folder: r.folder,
            format: r.format
          })) || []
        },
        tpwbm_folder: tpwbmTest,
        folders_list: {
          folders: foldersTest.folders || [],
          error: foldersTest.error
        },
        gallery_test: {
          total_count: galleryTest.resources?.length || 0,
          resources: galleryTest.resources?.slice(0, 3).map((r: any) => ({
            public_id: r.public_id,
            secure_url: r.secure_url,
            folder: r.folder
          })) || [],
          error: galleryTest.error
        },
        audio_messages: {
          total_count: audioTest.resources?.length || 0,
          resources_found: audioTest.resources?.length || 0,
          error: audioTest.error
        }
      }
    });
  } catch (error) {
    console.error('Cloudinary test failed:', error);
    return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: error
        },
        { status: 500 }
    );
  }
}
