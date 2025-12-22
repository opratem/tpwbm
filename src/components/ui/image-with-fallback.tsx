"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  fallbackBgColor?: string;
  onErrorCallback?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function ImageWithFallback({
                                    src,
                                    alt,
                                    fill = false,
                                    className = "",
                                    fallbackSrc,
                                    fallbackIcon,
                                    fallbackBgColor = "bg-gradient-to-br from-purple-500 to-pink-500",
                                    onErrorCallback,
                                    ...props
                                  }: ImageWithFallbackProps) {
  // Check for empty or invalid src and handle it immediately
  const isValidSrc = src && (typeof src === 'string' ? src.trim() !== "" : true);
  const initialSrc = isValidSrc ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(!initialSrc);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else if (!hasError && !fallbackSrc) {
      setHasError(true);
    }

    if (onErrorCallback) {
      onErrorCallback(e);
    }
  };

  // If we have an error and no fallbackSrc, show the fallback icon/background
  if (hasError && !fallbackSrc) {
    return (
        <div className={`w-full h-full ${fallbackBgColor} flex items-center justify-center ${className}`}>
          {fallbackIcon}
        </div>
    );
  }

  // If we don't have a valid src at all, show fallback
  if (!imgSrc || (typeof imgSrc === 'string' && imgSrc.trim() === "")) {
    return (
        <div className={`w-full h-full ${fallbackBgColor} flex items-center justify-center ${className}`}>
          {fallbackIcon}
        </div>
    );
  }

  return (
      <Image
          {...props}
          src={imgSrc}
          alt={alt}
          fill={fill}
          className={className}
          onError={handleImageError}
      />
  );
}
