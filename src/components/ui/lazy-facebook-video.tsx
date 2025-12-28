"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Facebook } from "lucide-react";

interface LazyFacebookVideoProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  className?: string;
}

export function LazyFacebookVideo({
  videoUrl,
  thumbnailUrl,
  title,
  className = "",
}: LazyFacebookVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleClick = () => {
    // Open Facebook video in new tab instead of embedding for better performance
    window.open(videoUrl, '_blank');
  };

  return (
    <div className={`relative aspect-video overflow-hidden rounded-lg ${className}`}>
      <button
        onClick={handleClick}
        className="relative w-full h-full group cursor-pointer"
        aria-label={`Play ${title}`}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <Facebook className="w-6 h-6 text-white" />
        </div>
      </button>
    </div>
  );
}
