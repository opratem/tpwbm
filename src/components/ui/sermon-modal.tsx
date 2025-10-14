"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Headphones,
  Heart,
  MessageSquare,
  Share2,
  User,
  Video,
} from "lucide-react";
import { useState } from "react";
import { EnhancedMediaPlayer } from "./enhanced-media-player";

interface Sermon {
  id: number | string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  series: string;
  description: string;
  videoUrl: string;
  audioUrl: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
  transcript?: string;
  notes?: string[];
  isYouTube?: boolean;
  youtubeUrl?: string;
  embedUrl?: string;
}

interface SermonModalProps {
  sermon: Sermon | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SermonModal({ sermon, isOpen, onClose }: SermonModalProps) {
  const [activeTab, setActiveTab] = useState<"video" | "audio" | "notes">(
      "video",
  );
  const [isLiked, setIsLiked] = useState(false);

  if (!sermon) return null;

  // Check if this is a YouTube video
  const isYouTubeVideo =
      sermon.isYouTube ||
      sermon.youtubeUrl ||
      sermon.embedUrl ||
      (sermon.videoUrl &&
          (sermon.videoUrl.includes("youtube.com") ||
              sermon.videoUrl.includes("youtu.be")));

  const handleShare = async () => {
    // Use YouTube URL if available, otherwise fallback to current page
    const shareUrl = sermon.youtubeUrl || sermon.embedUrl || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: sermon.description,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Sharing failed", error);
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <DialogHeader className="space-y-4 pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <Badge variant="secondary" className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {sermon.series}
                </Badge>
                <DialogTitle className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                  {sermon.title}
                </DialogTitle>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                    onClick={() => setIsLiked(!isLiked)}
                    variant="ghost"
                    size="sm"
                    className={`transition-colors ${isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"}`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button
                    onClick={handleShare}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {/* Modern close button */}
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    aria-label="Close"
                    className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors rounded-full"
                >
                  <svg
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{sermon.speaker}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(sermon.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{sermon.duration}</span>
              </div>
            </div>

            <DialogDescription className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {sermon.description}
            </DialogDescription>

            <div className="flex flex-wrap gap-2">
              {sermon.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600 hover:bg-gray-100">
                    {tag}
                  </Badge>
              ))}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Media Tabs - Simplified for YouTube videos */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {/* For YouTube videos, combine video and audio into one "Watch" tab */}
              {isYouTubeVideo ? (
                  <>
                    <button
                        onClick={() => setActiveTab("video")}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-md text-sm font-medium transition-all ${
                            activeTab === "video"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <Video className="h-4 w-4" />
                      <span>Watch</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-md text-sm font-medium transition-all ${
                            activeTab === "notes"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Notes</span>
                    </button>
                  </>
              ) : (
                  <>
                    <button
                        onClick={() => setActiveTab("video")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === "video"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("audio")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === "audio"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <Headphones className="h-4 w-4" />
                      <span>Audio</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === "notes"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Notes</span>
                    </button>
                  </>
              )}
            </div>

            {/* Media Player */}
            {activeTab === "video" && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                  <EnhancedMediaPlayer
                      isOpen={true}
                      onClose={onClose}
                      title={sermon.title}
                      mediaUrl={sermon.videoUrl}
                      preacher={sermon.speaker}
                      coverImage={sermon.thumbnail}
                      isVideo={true}
                      series={sermon.series}
                      date={sermon.date}
                      description={sermon.description}
                      youtubeUrl={sermon.youtubeUrl}
                      embedUrl={sermon.embedUrl}
                  />
                </div>
            )}

            {/* Audio tab only for non-YouTube content */}
            {!isYouTubeVideo && activeTab === "audio" && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                  <EnhancedMediaPlayer
                      isOpen={true}
                      onClose={onClose}
                      title={sermon.title}
                      mediaUrl={sermon.audioUrl || sermon.videoUrl}
                      preacher={sermon.speaker}
                      coverImage={sermon.thumbnail}
                      isVideo={false}
                      series={sermon.series}
                      date={sermon.date}
                      description={sermon.description}
                      youtubeUrl={sermon.youtubeUrl}
                      embedUrl={sermon.embedUrl}
                  />
                </div>
            )}

            {/* Sermon Notes */}
            {activeTab === "notes" && (
                <div className="space-y-6">
                  {sermon.notes && sermon.notes.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Sermon Notes</h3>
                        <div className="space-y-3">
                          {sermon.notes.map((note, index) => (
                              <div key={`note-${index}-${note.slice(0, 10)}`} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {note}
                                </p>
                              </div>
                          ))}
                        </div>
                      </div>
                  ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No Notes Available
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Sermon notes will be available here when provided.
                        </p>
                      </div>
                  )}

                  {sermon.transcript && (
                      <div className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-semibold">Transcript</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {sermon.transcript}
                          </p>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              {/* Hide download buttons for YouTube videos */}
              {!isYouTubeVideo && (
                  <>
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Audio
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Video
                    </Button>
                  </>
              )}

              {/* YouTube-specific actions */}
              {isYouTubeVideo && (
                  <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(sermon.youtubeUrl || sermon.embedUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
              )}

              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}
