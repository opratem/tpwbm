"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { YouTubeMediaPlayer } from "@/components/ui/youtube-media-player";
import { MediaPlayer } from "@/components/ui/media-player";
import {
  X,
  User,
  Calendar,
  ExternalLink,
  Share2,
  Youtube
} from "lucide-react";
import { useState } from "react";

interface EnhancedMediaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  title: string;
  preacher?: string;
  date?: string;
  description?: string;
  series?: string;
  coverImage?: string;
  isVideo?: boolean;
  embedUrl?: string;
  youtubeUrl?: string;
}

// Helper function to extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// Helper function to check if URL is a YouTube URL
function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || extractYouTubeVideoId(url) !== null;
}

export function EnhancedMediaPlayer({
                                      isOpen,
                                      onClose,
                                      mediaUrl,
                                      title,
                                      preacher,
                                      date,
                                      description,
                                      series,
                                      coverImage,
                                      isVideo = false,
                                      embedUrl,
                                      youtubeUrl
                                    }: EnhancedMediaPlayerProps) {
  const [playerType, setPlayerType] = useState<'youtube' | 'regular' | null>(null);

  // Determine which player to use
  const determinePlayerType = (): 'youtube' | 'regular' => {
    // Check if we have explicit YouTube URLs
    if (youtubeUrl && isYouTubeUrl(youtubeUrl)) {
      return 'youtube';
    }

    if (embedUrl && isYouTubeUrl(embedUrl)) {
      return 'youtube';
    }

    // Check if the main media URL is a YouTube URL
    if (isYouTubeUrl(mediaUrl)) {
      return 'youtube';
    }

    // Default to regular media player
    return 'regular';
  };

  const currentPlayerType = playerType || determinePlayerType();

  // Get YouTube video ID for YouTube player
  const getYouTubeVideoId = (): string => {
    const urlsToCheck = [youtubeUrl, embedUrl, mediaUrl].filter((url): url is string => Boolean(url));

    for (const url of urlsToCheck) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) return videoId;
    }

    return '';
  };

  // Handle player type switching
  const switchToRegularPlayer = () => {
    setPlayerType('regular');
  };

  const switchToYouTubePlayer = () => {
    setPlayerType('youtube');
  };

  const handleClose = () => {
    setPlayerType(null);
    onClose();
  };

  // If it's a YouTube video, use the YouTube player
  if (currentPlayerType === 'youtube') {
    const videoId = getYouTubeVideoId();

    if (videoId) {
      return (
          <div>
            <YouTubeMediaPlayer
                isOpen={isOpen}
                onClose={handleClose}
                videoId={videoId}
                title={title}
                preacher={preacher}
                date={date}
                description={description}
                series={series}
            />

            {/* Fallback option */}
            {mediaUrl && !isYouTubeUrl(mediaUrl) && (
                <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'block' : 'hidden'}`}>
                  <Button
                      onClick={switchToRegularPlayer}
                      variant="outline"
                      size="sm"
                      className="bg-white shadow-lg"
                  >
                    Use Regular Player
                  </Button>
                </div>
            )}
          </div>
      );
    }
  }

  // Use regular media player for non-YouTube content
  return (
      <div>
        <MediaPlayer
            isOpen={isOpen}
            onClose={handleClose}
            mediaUrl={mediaUrl}
            title={title}
            preacher={preacher}
            coverImage={coverImage}
            isVideo={isVideo}
            series={series}
            date={date}
            description={description}
        />

        {/* YouTube option if available */}
        {(youtubeUrl || embedUrl) && (
            <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'block' : 'hidden'}`}>
              <Button
                  onClick={switchToYouTubePlayer}
                  variant="outline"
                  size="sm"
                  className="bg-white shadow-lg text-red-600 hover:bg-red-50"
              >
                <Youtube className="h-4 w-4 mr-2" />
                Watch on YouTube
              </Button>
            </div>
        )}
      </div>
  );
}

// Export helper functions for use in other components
export { extractYouTubeVideoId, isYouTubeUrl };
