// Google Drive utility functions for fetching church gallery images

interface GoogleDriveFile {
  id: string;
  name: string;
  webContentLink?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  date: string;
  thumbnailSrc?: string;
}

// Convert Google Drive file ID to direct image URL
export function getGoogleDriveImageUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// Convert Google Drive file to GalleryImage format
export function convertGoogleDriveFileToGalleryImage(file: GoogleDriveFile, category: string = 'events'): GalleryImage {
  const fileId = file.id;
  const directImageUrl = getGoogleDriveImageUrl(fileId);

  // Extract date from filename or use created date
  const date = new Date(file.createdTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return {
    id: fileId,
    src: directImageUrl,
    alt: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
    category: category,
    title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '), // Clean filename
    date: date,
    thumbnailSrc: file.thumbnailLink
  };
}

// Extract folder ID from Google Drive share link
export function extractFolderIdFromShareLink(shareLink: string): string | null {
  const match = shareLink.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Note: To actually fetch from Google Drive API, you would need:
// 1. Google Drive API key
// 2. Make the folder publicly accessible
// 3. Use the Google Drive API endpoint:
//    https://www.googleapis.com/drive/v3/files?q=parents+in+'FOLDER_ID'&key=API_KEY

// For now, this is a placeholder that would work with proper API setup
export async function fetchGoogleDriveImages(folderId: string, apiKey?: string): Promise<GalleryImage[]> {
  if (!apiKey) {
    // Return mock data for demo purposes
    console.warn('Google Drive API key not provided. Returning mock data.');
    return getMockGoogleDriveImages();
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=parents+in+'${folderId}'+and+mimeType+contains+'image/'&fields=files(id,name,webContentLink,webViewLink,thumbnailLink,mimeType,createdTime,modifiedTime)&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.statusText}`);
    }

    const data = await response.json();
    const files: GoogleDriveFile[] = data.files || [];

    return files.map(file => convertGoogleDriveFileToGalleryImage(file));
  } catch (error) {
    console.error('Error fetching Google Drive images:', error);
    return getMockGoogleDriveImages();
  }
}

// Mock data for development/demo purposes
export function getMockGoogleDriveImages(): GalleryImage[] {
  return [
    {
      id: 'mock-1',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop',
      alt: 'Church Service',
      category: 'worship',
      title: 'Sunday Morning Service',
      date: 'January 2025'
    },
    {
      id: 'mock-2',
      src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=500&h=400&fit=crop',
      alt: 'Church Fellowship',
      category: 'events',
      title: 'Community Fellowship',
      date: 'December 2024'
    },
    {
      id: 'mock-3',
      src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&h=400&fit=crop',
      alt: 'Youth Ministry',
      category: 'ministry',
      title: 'Youth Ministry Event',
      date: 'December 2024'
    },
    {
      id: 'mock-4',
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=400&fit=crop',
      alt: 'Choir Performance',
      category: 'music',
      title: 'Christmas Choir Performance',
      date: 'December 2024'
    }
  ];
}
