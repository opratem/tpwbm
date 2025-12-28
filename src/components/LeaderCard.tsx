'use client';

import Image from 'next/image';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Users } from 'lucide-react';
import { getLeaderImagePath, getFallbackImage, getCloudinaryLeaderImage } from '@/lib/leader-images';

interface Leader {
  name: string;
  position?: string;
}

export default function LeaderCard({
  leader,
  showPosition = false
}: {
  leader: Leader;
  showPosition?: boolean;
}) {
  // Get the best image source: Cloudinary direct mapping first, then local fallback
  const getImageSource = (): string | null => {
    // Try Cloudinary direct mapping first (no API call needed)
    const cloudinaryImage = getCloudinaryLeaderImage(leader.name);
    if (cloudinaryImage) {
      return cloudinaryImage;
    }

    // Fallback to local images
    const localImage = getLeaderImagePath(leader.name);
    if (localImage) {
      return localImage;
    }

    // Final fallback
    return getFallbackImage(leader.name);
  };

  const imageSource = getImageSource();

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-200">
        {imageSource ? (
          <ImageWithFallback
            src={imageSource}
            alt={leader.name}
            fill
            className="object-cover"
            fallbackSrc=""
            onErrorCallback={() => {
              // Will fall back to showing the Users icon placeholder
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        )}
      </div>
      <h4 className="font-semibold text-sm text-gray-900">{leader.name}</h4>
      {showPosition && leader.position && (
        <p className="text-xs text-gray-600 mt-1">{leader.position}</p>
      )}
    </div>
  );
}
