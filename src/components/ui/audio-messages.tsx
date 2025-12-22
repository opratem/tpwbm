"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaPlayer } from "@/components/ui/media-player";
import { EnhancedMediaPlayer } from "@/components/ui/enhanced-media-player";
import { useMediaPlayer } from "@/contexts/MediaPlayerContext";
import type { MediaItem } from "@/contexts/MediaPlayerContext";
import { sortSermons } from "@/lib/sermon-sorting";
import { Play, Pause, Bookmark, BookmarkCheck, Search, Calendar, User, Clock, Loader2, Maximize } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import type { CloudinaryGalleryImage } from "@/lib/cloudinary-client";

interface AudioMessage {
  id: string;
  title: string;
  preacher: string;
  date: string;
  duration: string;
  series?: string;
  description: string;
  imageUrl: string;
  audioUrl?: string;
  cloudinaryAudioUrl?: string;
  isVideo?: boolean;
  fileFormat?: string;
  tags?: string[];
  youtubeUrl?: string;
  embedUrl?: string;
  videoUrl?: string;
}

interface CloudinaryAudioFile {
  public_id: string;
  secure_url: string;
  resource_type: 'video' | 'image' | 'raw';
  format: string;
  display_name: string;
}

interface CloudinaryVideoFile {
  id: string;
  src: string;
  title?: string;
  resource_type: 'video' | 'image' | 'raw';
  format: string;
  duration?: string;
  public_id: string;
  uploadedAt?: string;
  description?: string;
  audioUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

export function AudioMessages() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [cloudinaryAudioImages, setCloudinaryAudioImages] = useState<CloudinaryGalleryImage[]>([]);
  const [cloudinaryVideoFiles, setCloudinaryVideoFiles] = useState<CloudinaryVideoFile[]>([]);
  const [audioMessages, setAudioMessages] = useState<AudioMessage[]>([]);
  const [youtubeMessages, setYoutubeMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<AudioMessage | null>(null);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [failedMedia, setFailedMedia] = useState<Set<string>>(new Set());
  const [useProxy, setUseProxy] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<Record<string, boolean>>({});

  // Use global media player context
  const { currentMedia, isPlaying, playMedia, pauseMedia, resumeMedia } = useMediaPlayer();

  // Helper function to determine if file is video based on format
  const isVideoFormat = (format: string): boolean => {
    const videoFormats = ['mp4', 'webm', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'm4v'];
    return videoFormats.includes(format.toLowerCase());
  };

  // Helper function to create audio messages from Cloudinary data
  const createAudioMessagesFromCloudinary = useCallback((
      videoFiles: CloudinaryVideoFile[],
      images: CloudinaryGalleryImage[]
  ): AudioMessage[] => {
    if (videoFiles.length === 0) {
      // Return placeholder messages when no Cloudinary files found
      return [
        {
          id: "placeholder-1",
          title: "Walking in Divine Purpose",
          preacher: "Pastor Tunde Olufemi",
          date: "2025-06-10",
          duration: "45:32",
          series: "Purpose Driven Life",
          description: "Understanding God's plan for your life and how to walk in divine alignment with His purpose.",
          imageUrl: "/images/pastor/Pastor_Tunde_ Olufemi.jpeg",
          isVideo: false,
          tags: ['purpose', 'divine calling', 'spiritual growth']
        },
        {
          id: "placeholder-2",
          title: "The Power of Faith",
          preacher: "Pastor Esther Olufemi",
          date: "2025-06-03",
          duration: "38:15",
          series: "Faith Foundations",
          description: "Exploring how faith moves mountains and transforms lives through the power of believing.",
          imageUrl: "/images/pastor/pastor-image-2.jpeg",
          isVideo: false,
          tags: ['faith', 'miracles', 'spiritual power']
        },
        {
          id: "placeholder-3",
          title: "Understanding Grace",
          preacher: "Pastor Tunde Olufemi",
          date: "2025-05-27",
          duration: "42:18",
          series: "Grace Unveiled",
          description: "A deep dive into the meaning of grace and how it transforms our relationship with God.",
          imageUrl: "/images/pastor/pastor-image-3.jpeg",
          isVideo: false,
          tags: ['grace', 'salvation', 'relationship with God']
        }
      ];
    }

    // Process video files from Cloudinary
    const audioMessages: AudioMessage[] = [];

    // Add video files (with audio) as audio messages
    videoFiles.forEach((video, index) => {
      const message: AudioMessage = {
        id: `cloudinary-video-${index}`,
        title: video.title || `Church Message ${index + 1}`,
        preacher: "Pastor Tunde Olufemi",
        date: new Date(video.uploadedAt || Date.now()).toISOString().split('T')[0],
        duration: video.duration || "Unknown",
        series: "Church Messages",
        description: video.description || "A powerful message from our church service.",
        audioUrl: video.audioUrl,
        imageUrl: video.thumbnailUrl || images[0]?.src || "/images/default-sermon.jpg",
        isVideo: true,
        videoUrl: video.videoUrl,
        tags: video.tags || ['message', 'teaching']
      };
      audioMessages.push(message);
    });

    return audioMessages;
  }, []);

  // Load audio content from YouTube first, then Cloudinary as fallback
  useEffect(() => {
    const loadAudioContent = async () => {
      setIsLoading(true);
      try {
        // First try to load from YouTube
        const youtubeResponse = await fetch('/api/youtube/church-content?type=audio-messages&maxResults=50');

        if (youtubeResponse.ok) {
          const youtubeData = await youtubeResponse.json();
          if (youtubeData.success && youtubeData.audioMessages) {
            const youtubeAudioMessages = youtubeData.audioMessages.map((video: any, index: number) => ({
              id: `youtube-${video.id}`,
              title: video.title,
              preacher: video.speaker || 'Pastor Tunde Olufemi',
              date: video.date,
              duration: video.duration,
              series: video.series || 'Audio Messages',
              description: video.description,
              imageUrl: (video.thumbnail && video.thumbnail.trim() !== "") ? video.thumbnail : "/images/pastor/Pastor_Tunde_ Olufemi.jpeg",
              youtubeUrl: video.youtubeUrl,
              embedUrl: video.embedUrl,
              isVideo: true,
              fileFormat: 'youtube',
              tags: video.tags || ['message', 'teaching']
            }));

            // Sort YouTube messages properly
            const sortedYoutubeMessages = sortSermons(youtubeAudioMessages, 'newest') as AudioMessage[];
            setYoutubeMessages(youtubeData.audioMessages);
            setAudioMessages(sortedYoutubeMessages);

            console.log(`✅ Loaded ${youtubeAudioMessages.length} audio messages from YouTube`);
            setIsLoading(false);
            return; // Exit early if YouTube content loaded successfully
          }
        }

        console.log('YouTube content not available, loading from Cloudinary...');

        // Fallback to Cloudinary content
        const cloudinaryResponse = await fetch('/api/cloudinary/images?subfolder=audio_messages');
        const cloudinaryData = await cloudinaryResponse.json();

        const images = cloudinaryData.images || [];
        const videos = cloudinaryData.videos || cloudinaryData.audioFiles || [];

        setCloudinaryAudioImages(images);
        setCloudinaryVideoFiles(videos);

        // Create audio messages from Cloudinary content
        const messages = createAudioMessagesFromCloudinary(videos, images);
        setAudioMessages(messages);

        console.log(` Loaded ${images.length} images and ${videos.length} media files from Cloudinary as fallback`);

      } catch (error) {
        console.error('Error loading audio content:', error);
        setCloudinaryAudioImages([]);
        setCloudinaryVideoFiles([]);
        setYoutubeMessages([]);

        // Create placeholder messages on error
        setAudioMessages(createAudioMessagesFromCloudinary([], []));
      } finally {
        setIsLoading(false);
      }
    };

    loadAudioContent();
  }, [createAudioMessagesFromCloudinary]);

  // Function to get audio URL with fallback options
  const getAudioUrl = (audioMessage: AudioMessage, useProxy = false): string | null => {
    // For YouTube audio messages, return the YouTube URL
    if (audioMessage.id.startsWith('youtube-') && audioMessage.youtubeUrl) {
      console.log(`YouTube URL for ${audioMessage.title}:`, audioMessage.youtubeUrl);
      return audioMessage.youtubeUrl;
    }

    // Return actual URLs if available
    if (audioMessage.cloudinaryAudioUrl || audioMessage.audioUrl) {
      let url = audioMessage.cloudinaryAudioUrl || audioMessage.audioUrl || null;

      // If it's a Cloudinary URL, add transformation parameters for better compatibility
      if (url && url.includes('cloudinary.com')) {
        // For MP4 files, use minimal transformations to ensure proper playback
        if (url.includes('.mp4')) {
          url = url.replace('/upload/', '/upload/f_auto,q_auto/');
        } else {
          url = url.replace('/upload/', '/upload/fl_force_strip,f_auto,q_auto,fl_streaming_attachment/');
        }
        console.log(`Transformed Cloudinary URL for ${audioMessage.title}:`, url);

        // If proxy is requested, route through our API
        if (useProxy) {
          url = `/api/media-proxy?url=${encodeURIComponent(url)}`;
          console.log(`Using proxy URL for ${audioMessage.title}:`, url);
        }
      }

      console.log(`Media URL for ${audioMessage.title}:`, url);
      return url;
    }

    // For testing purposes, provide sample media URLs for placeholder items
    if (audioMessage.id.startsWith('placeholder-')) {
      if (audioMessage.isVideo) {
        // Use a working test video with known duration
        return "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
      } else {
        // Use a working test audio file with known duration
        return "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
      }
    }

    console.log(`No media URL found for ${audioMessage.title} (ID: ${audioMessage.id})`);
    return null;
  };

  // Filter messages by search term only
  const filteredMessages = audioMessages.filter(message => {
    // Text search filter
    const matchesSearch = searchTerm === "" ||
        message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.preacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.series?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Convert AudioMessage to MediaItem for global player
  const convertToMediaItem = (message: AudioMessage): MediaItem => ({
    id: message.id,
    title: message.title,
    preacher: message.preacher,
    mediaUrl: getAudioUrl(message) || "",
    coverImage: message.imageUrl,
    duration: message.duration,
    series: message.series,
    date: message.date,
    description: message.description,
    isVideo: message.isVideo,
  });

  // Check bookmarks for all messages
  useEffect(() => {
    if (session?.user && audioMessages.length > 0) {
      const messageIds = audioMessages.map(m => m.id).join(',');
      fetch(`/api/bookmarks/check?resourceIds=${messageIds}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBookmarkedMessages(data.bookmarked);
          }
        })
        .catch(error => console.error('Error checking bookmarks:', error));
    }
  }, [session, audioMessages.length]);

  // Toggle bookmark
  const handleBookmark = async (message: AudioMessage) => {
    if (!session?.user) {
      toast("Please login to save audio messages");
      return;
    }

    const isBookmarked = bookmarkedMessages[message.id];

    if (isBookmarked) {
      // Remove bookmark
      try {
        const response = await fetch(
          `/api/bookmarks?resourceId=${message.id}&resourceType=audio_message`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          setBookmarkedMessages(prev => ({ ...prev, [message.id]: false }));
          toast("Audio message removed from saved");
        } else {
          toast("Failed to remove bookmark");
        }
      } catch (error) {
        console.error('Error removing bookmark:', error);
        toast("Failed to remove bookmark");
      }
    } else {
      // Add bookmark
      try {
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceType: 'audio_message',
            resourceId: message.id,
            resourceTitle: message.title,
            resourceUrl: message.audioUrl || message.youtubeUrl,
            resourceThumbnail: message.imageUrl,
            resourceMetadata: {
              speaker: message.preacher,
              date: message.date,
              duration: message.duration,
              description: message.description,
              tags: message.tags,
              series: message.series
            }
          })
        });

        const data = await response.json();

        if (response.ok || response.status === 409) {
          setBookmarkedMessages(prev => ({ ...prev, [message.id]: true }));
          toast("Audio message saved successfully");
        } else {
          toast(data.error || "Failed to save audio message");
        }
      } catch (error) {
        console.error('Error saving bookmark:', error);
        toast("Failed to save audio message");
      }
    }
  };

  const handlePlay = (message: AudioMessage) => {
    // For YouTube videos, always open in full player modal
    if (message.id.startsWith('youtube-') || message.isVideo) {
      setSelectedMedia(message);
      setShowFullPlayer(true);
      return;
    }

    // Check if this media previously failed and use proxy if needed
    const shouldUseProxy = failedMedia.has(message.id) || useProxy;
    const audioUrl = getAudioUrl(message, shouldUseProxy);

    if (!audioUrl) {
      // No audio file available, show placeholder behavior
      return;
    }

    // For audio files, check if this is already playing
    const mediaItem = convertToMediaItem(message);

    if (currentMedia?.id === message.id) {
      // Same audio - toggle play/pause
      if (isPlaying) {
        pauseMedia();
      } else {
        resumeMedia();
      }
    } else {
      // New audio - start playing in mini player
      playMedia(mediaItem);
    }
  };

  const openFullPlayer = (message: AudioMessage) => {
    setSelectedMedia(message);
    setShowFullPlayer(true);
  };

  const handleMediaError = (messageId: string) => {
    console.log('Media playback failed for:', messageId, 'Adding to failed list');
    setFailedMedia(prev => new Set([...prev, messageId]));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading audio messages...</span>
          </div>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-12">
        {/* Full Media Player Modal */}
        {selectedMedia && (
            <EnhancedMediaPlayer
                isOpen={showFullPlayer}
                onClose={() => {
                  setShowFullPlayer(false);
                  setSelectedMedia(null);
                }}
                mediaUrl={selectedMedia.youtubeUrl || getAudioUrl(selectedMedia) || ""}
                title={selectedMedia.title}
                preacher={selectedMedia.preacher}
                coverImage={selectedMedia.imageUrl}
                isVideo={selectedMedia.isVideo || false}
                series={selectedMedia.series}
                date={selectedMedia.date}
                description={selectedMedia.description}
                youtubeUrl={selectedMedia.youtubeUrl}
                embedUrl={selectedMedia.embedUrl}
            />
        )}

        {/* Search Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
                type="text"
                placeholder="Search messages, tags, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing {filteredMessages.length} of {audioMessages.length} messages
          </p>
        </div>

        {/* Audio Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((message) => {
            const audioUrl = getAudioUrl(message);
            const isCurrentlyPlaying = currentMedia?.id === message.id && isPlaying && !message.isVideo;

            return (
                <Card key={message.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                        src={message.imageUrl}
                        alt={message.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <Button
                            onClick={() => handlePlay(message)}
                            variant="secondary"
                            size="lg"
                            className="rounded-full bg-white/90 hover:bg-white text-blue-600"
                            disabled={!audioUrl}
                        >
                          {isCurrentlyPlaying ? (
                              <Pause className="h-6 w-6" />
                          ) : (
                              <Play className="h-6 w-6 ml-1" />
                          )}
                        </Button>
                        {audioUrl && (
                            <Button
                                onClick={() => openFullPlayer(message)}
                                variant="secondary"
                                size="lg"
                                className="rounded-full bg-white/90 hover:bg-white text-blue-600"
                            >
                              <Maximize className="h-6 w-6" />
                            </Button>
                        )}
                      </div>
                    </div>

                    {!audioUrl && (
                        <div className="absolute top-3 right-3 bg-[hsl(45_56%_55%)] hover:bg-[hsl(45_56%_48%)] text-white text-xs px-2 py-1 rounded">
                          Preview
                        </div>
                    )}
                    {message.isVideo && (
                        <div className="absolute top-3 right-3 bg-[hsl(218_31%_18%)] hover:bg-[hsl(218_28%_25%)] text-white text-xs px-2 py-1 rounded">
                          Video
                        </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{message.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {message.preacher}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {message.duration}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(message.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {message.description}
                    </p>

                    <div className="flex space-x-2 pt-2">
                      <Button
                          onClick={() => handlePlay(message)}
                          variant={isCurrentlyPlaying ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          disabled={!audioUrl}
                      >
                        {isCurrentlyPlaying ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                        ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              {audioUrl ? (message.isVideo ? 'Watch' : 'Play') : 'Preview'}
                            </>
                        )}
                      </Button>

                      {audioUrl && (
                          <Button
                              onClick={() => openFullPlayer(message)}
                              variant="outline"
                              size="sm"
                          >
                            <Maximize className="h-4 w-4" />
                          </Button>
                      )}

                      <Button
                          variant="outline"
                          size="sm"
                          className={bookmarkedMessages[message.id] ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' : ''}
                          onClick={() => handleBookmark(message)}
                      >
                        {bookmarkedMessages[message.id] ? (
                          <BookmarkCheck className="h-4 w-4 fill-current" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>

        {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No audio messages found matching your search.</p>
              {searchTerm && (
                  <Button
                      onClick={() => setSearchTerm("")}
                      variant="outline"
                      className="mt-4"
                  >
                    Clear search
                  </Button>
              )}
            </div>
        )}
      </div>
  );
}
