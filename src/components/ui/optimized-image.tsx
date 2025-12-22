"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 85,
  sizes,
  fill = false,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Optimize Cloudinary URLs
  const getOptimizedSrc = (url: string) => {
    // Check if it's a Cloudinary URL
    if (url.includes('res.cloudinary.com')) {
      // Extract the parts
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        // Add optimization transformations
        const transformations = [
          'f_auto', // Auto format (WebP/AVIF)
          'q_auto:good', // Auto quality
          'c_fill', // Fill crop mode
          ...(width ? [`w_${width}`] : []),
          ...(height ? [`h_${height}`] : []),
        ].join(',');

        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
      }
    }
    return url;
  };

  const optimizedSrc = getOptimizedSrc(imgSrc);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    // Fallback to placeholder on error
    setImgSrc('/placeholder-image.jpg');
    setIsLoading(false);
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className={`object-${objectFit} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width || 800}
        height={height || 600}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
