"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Youtube,
  Plus,
  RefreshCw,
  ExternalLink,
  Play,
  Calendar,
  Eye,
  ThumbsUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import Image from 'next/image';

interface YouTubeContent {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  speaker: string;
  duration: string;
  viewCount: string;
  likeCount?: string;
  youtubeUrl: string;
  tags: string[];
}

export default function AdminYouTubePage() {
  const [sermonsContent, setSermonsContent] = useState<YouTubeContent[]>([]);
  const [audioContent, setAudioContent] = useState<YouTubeContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'sermons' | 'audio-messages'>('sermons');
  const [customSpeaker, setCustomSpeaker] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Load content on component mount
  useEffect(() => {
    loadYouTubeContent();
  }, []);

  const loadYouTubeContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/youtube/church-content');
      const data = await response.json();

      if (data.success) {
        setSermonsContent(data.sermons || []);
        setAudioContent(data.audioMessages || []);
        setMessage({ type: 'success', text: `Loaded ${(data.sermons?.length || 0) + (data.audioMessages?.length || 0)} videos from YouTube channel` });
      } else {
        setMessage({ type: 'error', text: 'Failed to load YouTube content' });
      }
    } catch (error) {
      console.error('Error loading YouTube content:', error);
      setMessage({ type: 'error', text: 'Error connecting to YouTube. Please check your internet connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const addVideoManually = async () => {
    if (!newVideoUrl.trim()) {
      setMessage({ type: 'error', text: 'Please enter a YouTube video URL or video ID' });
      return;
    }

    const videoId = extractVideoId(newVideoUrl.trim());
    if (!videoId) {
      setMessage({ type: 'error', text: 'Invalid YouTube URL. Please use a valid YouTube video URL.' });
      return;
    }

    setIsLoading(true);
    try {
      // Here you would implement the logic to add the video to the appropriate category
      // For now, we'll just show a success message and suggest refreshing content
      setMessage({
        type: 'success',
        text: `Video ID ${videoId} noted for ${selectedCategory}. Upload it to the "${selectedCategory}" playlist on YouTube, then refresh content.`
      });
      setNewVideoUrl('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process video. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const openYouTubeStudio = () => {
    window.open('https://studio.youtube.com', '_blank');
  };

  const openYouTubeChannel = () => {
    window.open('https://www.youtube.com/@PrevailingWord-d7h4o', '_blank');
  };

  const ContentGrid = ({ content, title }: { content: YouTubeContent[]; title: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title} ({content.length})</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadYouTubeContent}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {content.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Youtube className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No {title.toLowerCase()} found. Create playlists on YouTube and add videos to them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full"
                    onClick={() => window.open(video.youtubeUrl, '_blank')}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-sm line-clamp-2">{video.title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {video.viewCount}
                    </div>
                    {video.likeCount && (
                      <div className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {video.likeCount}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => window.open(video.youtubeUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Youtube className="h-8 w-8 mr-3 text-red-600" />
            YouTube Content Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage sermons and audio messages from your church YouTube channel
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
            {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> :
             message.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
             <Info className="h-4 w-4" />}
            <AlertDescription className={message.type === 'error' ? 'text-red-800' : message.type === 'success' ? 'text-green-800' : 'text-blue-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-url">Add Video by URL</Label>
                  <Input
                    id="video-url"
                    placeholder="Paste YouTube video URL or ID here"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedCategory === 'sermons' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('sermons')}
                    >
                      Sermons
                    </Button>
                    <Button
                      variant={selectedCategory === 'audio-messages' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('audio-messages')}
                    >
                      Audio Messages
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={addVideoManually}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Note Video for {selectedCategory}
                </Button>

                <hr />

                <div className="space-y-2">
                  <Button
                    onClick={openYouTubeStudio}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open YouTube Studio
                  </Button>

                  <Button
                    onClick={openYouTubeChannel}
                    variant="outline"
                    className="w-full"
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    View Church Channel
                  </Button>

                  <Button
                    onClick={loadYouTubeContent}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh All Content
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>How to Add Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold">Method 1: Use Playlists (Recommended)</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 mt-1">
                    <li>Create playlists named "Sermons" and "Audio Messages" on YouTube</li>
                    <li>Add videos to the appropriate playlist</li>
                    <li>Click "Refresh All Content" to update the website</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">Method 2: Note Individual Videos</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 mt-1">
                    <li>Copy the YouTube video URL</li>
                    <li>Paste it in the "Add Video by URL" field above</li>
                    <li>Select the appropriate category</li>
                    <li>Click "Note Video" and follow the instructions</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="sermons" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sermons">Sermons</TabsTrigger>
                <TabsTrigger value="audio-messages">Audio Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="sermons">
                <ContentGrid content={sermonsContent} title="Sermons" />
              </TabsContent>

              <TabsContent value="audio-messages">
                <ContentGrid content={audioContent} title="Audio Messages" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
