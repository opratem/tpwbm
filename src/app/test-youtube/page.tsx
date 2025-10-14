"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Youtube,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  PlayCircle,
  Users,
  Video,
  List
} from 'lucide-react';

interface TestResult {
  success: boolean;
  error?: string;
  details?: string;
  channel?: {
    id: string;
    title: string;
    description: string;
    subscriberCount: string;
    videoCount: string;
  };
  playlists?: {
    total: number;
    all: Array<{
      id: string;
      title: string;
      itemCount: number;
    }>;
    sermonsPlaylist: {
      id: string;
      title: string;
      itemCount: number;
    } | null;
    audioPlaylist: {
      id: string;
      title: string;
      itemCount: number;
    } | null;
  };
  recentVideos?: {
    count: number;
    videos: Array<{
      id: string;
      title: string;
      publishedAt: string;
      viewCount: string;
    }>;
  };
  message?: string;
  apiKeySet?: boolean;
}

export default function TestYouTubePage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/youtube/test-connection');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Failed to connect to test endpoint',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const isYouTubeAPIDisabled = testResult?.error?.includes('YouTube Data API v3 has not been used') ||
                               testResult?.error?.includes('SERVICE_DISABLED') ||
                               testResult?.error?.includes('accessNotConfigured');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Youtube className="h-8 w-8 mr-3 text-red-600" />
            YouTube Integration Test
          </h1>
          <p className="mt-2 text-gray-600">
            Testing connection to @PrevailingWord-d7h4o YouTube channel
          </p>
        </div>

        <div className="mb-6">
          <Button
            onClick={runTest}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Testing...' : 'Run Test Again'}
          </Button>
        </div>

        {testResult && (
          <div className="space-y-6">
            {/* Status Alert */}
            <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {testResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                {testResult.success ? (
                  testResult.message || 'YouTube API connection successful!'
                ) : (
                  <>
                    <strong>Error:</strong> {testResult.error}
                    {!testResult.apiKeySet && (
                      <div className="mt-2">
                        <strong>Note:</strong> API key might not be set properly. Check your .env.local file.
                      </div>
                    )}
                  </>
                )}
              </AlertDescription>
            </Alert>

            {/* YouTube API Setup Instructions */}
            {isYouTubeAPIDisabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    YouTube Data API v3 Not Enabled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-2">
                        🔧 Fix Required: Enable YouTube Data API v3
                      </h3>
                      <p className="text-orange-700 text-sm mb-3">
                        Your API key is valid, but the YouTube Data API v3 service is not enabled in your Google Cloud project.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Steps to Fix:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>
                          Go to{' '}
                          <a
                            href="https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=287025668095"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-medium"
                          >
                            Google Cloud Console - YouTube Data API v3
                          </a>
                        </li>
                        <li>Click the <strong>"Enable"</strong> button</li>
                        <li>Wait 2-3 minutes for the API to be activated</li>
                        <li>Come back here and click "Run Test Again"</li>
                      </ol>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-700 text-sm">
                        <strong>💡 Good News:</strong> Your API key is working correctly and our code can reach Google's servers.
                        You just need to enable the YouTube Data API v3 service.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Key Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {testResult.apiKeySet ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  )}
                  API Configuration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>API Key Set:</span>
                    <Badge className={testResult.apiKeySet ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {testResult.apiKeySet ? '✅ Yes' : '❌ No'}
                    </Badge>
                  </div>
                  {testResult.apiKeySet && (
                    <div className="flex items-center justify-between">
                      <span>API Key (masked):</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        AIzaSyB1lhrrzbd87SgDqi***
                      </code>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>YouTube Data API v3:</span>
                    <Badge className={!isYouTubeAPIDisabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {!isYouTubeAPIDisabled ? '✅ Enabled' : '❌ Disabled'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {testResult.success && testResult.channel && (
              <>
                {/* Channel Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Youtube className="h-5 w-5 mr-2 text-red-600" />
                      Channel Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{testResult.channel.title}</h3>
                        <p className="text-gray-600 mt-2">{testResult.channel.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">
                            {Number.parseInt(testResult.channel.subscriberCount || '0').toLocaleString()} subscribers
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Video className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">
                            {Number.parseInt(testResult.channel.videoCount || '0').toLocaleString()} videos
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Playlists Information */}
                {testResult.playlists && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <List className="h-5 w-5 mr-2" />
                        Playlists Found ({testResult.playlists.total})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Detected Sermon/Audio Playlists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Sermons Playlist</h4>
                            {testResult.playlists.sermonsPlaylist ? (
                              <div>
                                <Badge className="bg-green-100 text-green-800 mb-2">
                                  ✅ Found
                                </Badge>
                                <p className="text-sm font-medium">{testResult.playlists.sermonsPlaylist.title}</p>
                                <p className="text-xs text-gray-600">
                                  {testResult.playlists.sermonsPlaylist.itemCount} videos
                                </p>
                              </div>
                            ) : (
                              <div>
                                <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                                  ⚠️ Not Found
                                </Badge>
                                <p className="text-sm text-gray-600">
                                  Create a playlist with "Sermon" in the title
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Audio Messages Playlist</h4>
                            {testResult.playlists.audioPlaylist ? (
                              <div>
                                <Badge className="bg-blue-100 text-blue-800 mb-2">
                                  ✅ Found
                                </Badge>
                                <p className="text-sm font-medium">{testResult.playlists.audioPlaylist.title}</p>
                                <p className="text-xs text-gray-600">
                                  {testResult.playlists.audioPlaylist.itemCount} videos
                                </p>
                              </div>
                            ) : (
                              <div>
                                <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                                  ⚠️ Not Found
                                </Badge>
                                <p className="text-sm text-gray-600">
                                  Create a playlist with "Audio" or "Message" in the title
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* All Playlists */}
                        <div>
                          <h4 className="font-semibold mb-3">All Playlists</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {testResult.playlists.all.map((playlist) => (
                              <div key={playlist.id} className="p-3 border rounded bg-gray-50">
                                <p className="font-medium text-sm">{playlist.title}</p>
                                <p className="text-xs text-gray-600">{playlist.itemCount} videos</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Videos */}
                {testResult.recentVideos && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PlayCircle className="h-5 w-5 mr-2" />
                        Recent Videos ({testResult.recentVideos.count})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testResult.recentVideos.videos.map((video) => (
                          <div key={video.id} className="flex justify-between items-start p-3 border rounded">
                            <div className="flex-1">
                              <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {new Date(video.publishedAt).toLocaleDateString()} • {Number.parseInt(video.viewCount || '0').toLocaleString()} views
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-800">🎉 Integration Ready!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-green-700">
                        Your YouTube API is working perfectly! Here's what you can do next:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                        <li>Visit <a href="/admin/youtube" className="underline font-medium">Admin YouTube Management</a> to manage content</li>
                        <li>Check your <a href="/sermons" className="underline font-medium">Sermons page</a> to see YouTube integration</li>
                        <li>View <a href="/audio-messages" className="underline font-medium">Audio Messages page</a> for audio content</li>
                        <li>Organize videos in playlists for better categorization</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Error Details */}
            {!testResult.success && testResult.details && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-800">Error Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {testResult.details}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
