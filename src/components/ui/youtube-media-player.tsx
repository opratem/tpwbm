"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  X,
  User,
  Calendar,
  ExternalLink,
  Share2,
  Youtube
} from "lucide-react";
import { useState } from "react";

interface YouTubeMediaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
  preacher?: string;
  date?: string;
  description?: string;
  series?: string;
}

export function YouTubeMediaPlayer({
                                     isOpen,
                                     onClose,
                                     videoId,
                                     title,
                                     preacher,
                                     date,
                                     description,
                                     series,
                                   }: YouTubeMediaPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  const getYouTubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const handleShare = async () => {
    const url = getYouTubeUrl(videoId);
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Watch "${title}" by ${preacher}`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackCopyToClipboard(url);
      }
    } else {
      fallbackCopyToClipboard(url);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Link copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <DialogHeader className="p-6 pb-4 border-b bg-white">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <DialogTitle className="text-xl font-bold text-left pr-4">{title}</DialogTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {preacher && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {preacher}
                        </div>
                    )}
                    {date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(date)}
                        </div>
                    )}
                  </div>
                  {series && (
                      <div className="text-sm text-blue-600 font-medium">
                        {series}
                      </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                      onClick={handleShare}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                      title="Share this video"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                      onClick={() => window.open(getYouTubeUrl(videoId), '_blank')}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      title="Watch on YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </Button>
                  <Button
                      onClick={onClose}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* YouTube Player */}
            <div className="flex-1 bg-black relative">
              {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                      <p>Loading video...</p>
                    </div>
                  </div>
              )}
              <iframe
                  src={getEmbedUrl(videoId)}
                  className="w-full h-full"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsLoading(false)}
                  style={{ border: 'none' }}
              />
            </div>

            {/* Description */}
            {description && (
                <div className="p-6 bg-gray-50 border-t max-h-32 overflow-y-auto">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
}
