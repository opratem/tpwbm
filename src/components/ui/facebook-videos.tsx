"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Facebook, ExternalLink, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FacebookVideo {
  id: string;
  title: string;
  description: string;
  created_time: string;
  picture: string;
  permalink_url: string;
  embed_html?: string | null;
}

interface FacebookVideosProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export function FacebookVideos({ limit = 6, showHeader = true, className = "" }: FacebookVideosProps) {
  const [videos, setVideos] = useState<FacebookVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<FacebookVideo | null>(null);

  const fetchFacebookVideos = useCallback(async () => {
    try {
      const response = await fetch(`/api/facebook/videos?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        setVideos(data.videos);
        if (data.message) {
          console.log('Facebook API:', data.message);
        }
      } else {
        setError('Failed to fetch Facebook videos');
      }
    } catch (err) {
      setError('Error loading Facebook videos');
      console.error('Facebook videos error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFacebookVideos();
  }, [fetchFacebookVideos]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openFacebookVideo = (video: FacebookVideo) => {
    if (video.embed_html) {
      setSelectedVideo(video);
    } else {
      window.open(video.permalink_url, '_blank');
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
        <div className={`space-y-6 ${className}`}>
          {showHeader && (
              <div className="text-center mb-8">
                <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Facebook{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Live Videos
              </span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Watch our recent services and events from our Facebook community
                </p>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className={`text-center py-8 ${className}`}>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg max-w-md mx-auto">
            <Facebook className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Facebook Videos</h3>
            <p className="text-blue-700 mb-4">
              Unable to load videos from our Facebook group at the moment.
            </p>
            <Button
                onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Visit Facebook Group
            </Button>
          </div>
        </div>
    );
  }

  return (
      <div className={`space-y-6 ${className}`}>
        {showHeader && (
            <div className="text-center mb-8">
              <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                Facebook{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Live Videos
            </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch our recent services and events from our Facebook community
              </p>
            </div>
        )}

        {videos.length === 0 ? (
            <div className="text-center py-8">
              <Facebook className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Videos Available</h3>
              <p className="text-gray-600 mb-4">
                Check back later for new videos from our Facebook community.
              </p>
              <Button
                  onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                  variant="outline"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Visit Facebook Group
              </Button>
            </div>
        ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <Card
                        key={video.id}
                        className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        onClick={() => openFacebookVideo(video)}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <img
                            src={video.picture}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=450&fit=crop';
                            }}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-xl">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>

                        {/* Facebook Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-blue-600 text-white">
                            <Facebook className="h-3 w-3 mr-1" />
                            Facebook
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {video.title}
                        </h3>

                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(video.created_time)}
                        </div>

                        {video.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {video.description}
                            </p>
                        )}
                      </CardContent>
                    </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button
                    onClick={() => window.open('https://web.facebook.com/groups/1873785202754614', '_blank')}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  View More on Facebook
                </Button>
              </div>
            </>
        )}

        {/* Video Modal */}
        {selectedVideo && selectedVideo.embed_html && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
                  <Button variant="ghost" onClick={closeVideoModal}>
                    ×
                  </Button>
                </div>

                <div
                    className="aspect-video mb-4"
                    dangerouslySetInnerHTML={{ __html: selectedVideo.embed_html }}
                />

                <div className="flex gap-4">
                  <Button
                      onClick={() => window.open(selectedVideo.permalink_url, '_blank')}
                      variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Facebook
                  </Button>
                  <Button onClick={closeVideoModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
