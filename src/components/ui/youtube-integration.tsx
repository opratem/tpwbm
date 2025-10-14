"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Youtube, ExternalLink } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string;
  pastor: string;
  description?: string;
}

interface YouTubeIntegrationProps {
  title?: string;
  subtitle?: string;
  videos?: YouTubeVideo[];
  channelUrl?: string;
  className?: string;
}

export function YouTubeIntegration({
                                     title = "Ignite Your Soul",
                                     subtitle = "Watch edifying clips from classic messages!",
                                     videos = [],
                                     channelUrl = "https://www.youtube.com/@tundeolufemi5339",
                                     className = ""
                                   }: YouTubeIntegrationProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Default videos with actual church video IDs
  const defaultVideos: YouTubeVideo[] = [
    {
      id: "1",
      title: "2 Things You Need To Overcome The Battles or Challenges of Life",
      videoId: "ibhn8Ges2tY",
      pastor: "Pastor 'Tunde Olufemi",
      description: "Discover the essential keys to overcoming life's battles and challenges through God's Word."
    },
    {
      id: "2",
      title: "The Mindset of a Good Steward",
      videoId: "ToglSiS9wZg",
      pastor: "Pastor 'Tunde Olufemi",
      description: "Learn what it means to be a faithful steward in God's kingdom and how to develop the right mindset."
    }
  ];

  const videosToShow = videos.length > 0 ? videos : defaultVideos;

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
    // Open YouTube video in new tab
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const getThumbnailUrl = (videoId: string) => {
    // For valid YouTube video IDs, this will show the actual thumbnail
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
      <AnimatedSection animation="fadeUp" className={className}>
        <section className="w-full mobile-section-spacing bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="container mobile-container">
            <div className="text-center mobile-content-spacing">
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-2 sm:mb-4">
                {title.split(' ').map((word, index) => {
                  if (index === title.split(' ').length - 1) {
                    return (
                        <span
                            key={`${word}-last`}
                            className="bg-gradient-to-r from-church-primary to-church-accent bg-clip-text text-transparent"
                        >
                      {word}
                    </span>
                    );
                  }
                  return `${word} `;
                })}
              </h2>
              <div className="w-20 sm:w-24 md:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-church-primary to-church-accent rounded-full mx-auto mb-4 sm:mb-6" />
              <p className="mobile-text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Larger video grid - 2 videos per row on larger screens, inspired by nlwc.church */}
            <div className="grid grid-cols-1 lg:grid-cols-2 mobile-grid-spacing max-w-7xl mx-auto mb-6 sm:mb-8">
              {videosToShow.slice(0, 2).map((video) => {
                const thumbnailUrl = getThumbnailUrl(video.videoId);

                return (
                    <div
                        key={video.id}
                        className="group cursor-pointer"
                        onClick={() => handleVideoClick(video.videoId)}
                    >
                      <div className="relative aspect-video mobile-card overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                        <img
                            src={thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              // Fallback to default thumbnail if maxres doesn't exist
                              e.currentTarget.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                            }}
                        />
                        {/* Enhanced gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Church-themed Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-church-primary/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-2xl ring-4 ring-white/20">
                            <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" />
                          </div>
                        </div>

                        {/* Enhanced video info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <p className="text-white mobile-text-sm font-semibold mb-2">
                            Click to watch on YouTube
                          </p>
                          <div className="flex items-center gap-2">
                            <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-church-accent" />
                            <span className="text-church-accent mobile-text-xs font-medium">Watch Now</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 md:mt-6 px-2">
                        <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white group-hover:text-church-primary transition-colors duration-300 line-clamp-2 mb-2 sm:mb-3">
                          {video.title}
                        </h3>
                        <p className="mobile-text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 font-medium">
                          {video.pastor}
                        </p>
                        {video.description && (
                            <p className="mobile-text-sm text-gray-500 dark:text-gray-500 leading-relaxed line-clamp-3">
                              {video.description}
                            </p>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>

            {/* Third video in full width if available */}
            {videosToShow.length > 2 && (
                <div className="max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-12">
                  {videosToShow.slice(2, 3).map((video) => {
                    const thumbnailUrl = getThumbnailUrl(video.videoId);

                    return (
                        <div
                            key={video.id}
                            className="group cursor-pointer"
                            onClick={() => handleVideoClick(video.videoId)}
                        >
                          <div className="relative aspect-video mobile-card overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                            <img
                                src={thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  e.currentTarget.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-church-primary/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-2xl ring-4 ring-white/20">
                                <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" />
                              </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <p className="text-white mobile-text-sm font-semibold mb-2">
                                Click to watch on YouTube
                              </p>
                              <div className="flex items-center gap-2">
                                <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-church-accent" />
                                <span className="text-church-accent mobile-text-xs font-medium">Watch Now</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 sm:mt-4 md:mt-6 text-center">
                            <h3 className="mobile-text-lg font-bold text-gray-900 dark:text-white group-hover:text-church-primary transition-colors duration-300 line-clamp-2 mb-2 sm:mb-3">
                              {video.title}
                            </h3>
                            <p className="mobile-text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 font-medium">
                              {video.pastor}
                            </p>
                            {video.description && (
                                <p className="mobile-text-sm text-gray-500 dark:text-gray-500 leading-relaxed line-clamp-3 max-w-2xl mx-auto">
                                  {video.description}
                                </p>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}

            <div className="text-center">
              <Button
                  size="lg"
                  variant="outline"
                  className="mobile-button rounded-full border-2 border-church-primary text-church-primary hover:bg-church-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  onClick={() => window.open(channelUrl, '_blank')}
              >
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                View More Videos
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
  );
}
