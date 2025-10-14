"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Download,
  Maximize,
  Minimize,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  User,
  Calendar,
  Clock,
  FastForward,
  Rewind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Standard MediaPlayer props for card view
interface MediaPlayerProps {
  title: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnail?: string;
  type: "video" | "audio";
  className?: string;
}

// Modal MediaPlayer props for full-screen experience
interface ModalMediaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  title: string;
  preacher?: string;
  coverImage?: string;
  isVideo?: boolean;
  series?: string;
  date?: string;
  description?: string;
}

// Combined props type
type CombinedMediaPlayerProps = MediaPlayerProps | ModalMediaPlayerProps;

// Type guard to check if props are for modal
function isModalProps(props: CombinedMediaPlayerProps): props is ModalMediaPlayerProps {
  return 'isOpen' in props && 'onClose' in props;
}

export function MediaPlayer(props: CombinedMediaPlayerProps) {
  // Handle modal vs standard player
  if (isModalProps(props)) {
    return <ModalMediaPlayer {...props} />;
  } else {
    return <StandardMediaPlayer {...props} />;
  }
}

// Modal Media Player Component
function ModalMediaPlayer({
                            isOpen,
                            onClose,
                            mediaUrl,
                            title,
                            preacher,
                            coverImage,
                            isVideo = false,
                            series,
                            date,
                            description,
                          }: ModalMediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [forceShowControls, setForceShowControls] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => {
      if (media.duration && !Number.isNaN(media.duration) && Number.isFinite(media.duration)) {
        console.log('Duration updated to:', media.duration);
        setDuration(media.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => console.log('Media loading started:', mediaUrl);
    const handleCanPlay = () => {
      console.log('Media can play:', mediaUrl);
      setShowControls(true); // Ensure controls are visible when media is ready
      // Force duration update on canplay
      updateDuration();
    };
    const handleCanPlayThrough = () => {
      console.log('Media can play through');
      updateDuration();
    };
    const handleDurationChange = () => {
      console.log('Duration changed:', media.duration);
      updateDuration();
    };
    const handleLoadedMetadata = () => {
      console.log('Metadata loaded, duration:', media.duration);
      updateDuration();
    };
    const handleLoadedData = () => {
      console.log('Data loaded, duration:', media.duration);
      updateDuration();
    };
    const handleError = (e: Event) => {
      console.error('Media loading error:', (e.target as HTMLMediaElement).error, mediaUrl);
      const error = (e.target as HTMLMediaElement).error;
      if (error) {
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          MEDIA_ERR_ABORTED: error.MEDIA_ERR_ABORTED,
          MEDIA_ERR_NETWORK: error.MEDIA_ERR_NETWORK,
          MEDIA_ERR_DECODE: error.MEDIA_ERR_DECODE,
          MEDIA_ERR_SRC_NOT_SUPPORTED: error.MEDIA_ERR_SRC_NOT_SUPPORTED
        });

        // If it's a CORS/Network error and it's a Cloudinary URL, suggest fix
        if (error.code === error.MEDIA_ERR_NETWORK && mediaUrl.includes('cloudinary.com')) {
          console.error('🚫 CORS Error detected! Please configure Cloudinary CORS settings.');
          console.error('📋 Fix: Go to Cloudinary Dashboard → Settings → Security → Add your domain to "Allowed fetch domains"');
        }
      }
    };

    media.addEventListener("timeupdate", updateTime);
    media.addEventListener("loadedmetadata", updateDuration);
    media.addEventListener("loadeddata", handleLoadedData);
    media.addEventListener("durationchange", handleDurationChange);
    media.addEventListener("canplay", handleCanPlay);
    media.addEventListener("canplaythrough", handleCanPlayThrough);
    media.addEventListener("ended", handleEnded);
    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", handlePause);
    media.addEventListener("loadstart", handleLoadStart);
    media.addEventListener("error", handleError);

    // Set media source and load it
    if (mediaUrl && media.src !== mediaUrl) {
      media.src = mediaUrl;
      media.load();

      // For some browsers, we need to trigger loadedmetadata manually
      setTimeout(() => {
        if (media.duration && !isNaN(media.duration) && isFinite(media.duration)) {
          setDuration(media.duration);
        }
      }, 1000);

      // Additional fallback for duration detection
      const checkDuration = () => {
        if (media.duration && !isNaN(media.duration) && isFinite(media.duration)) {
          console.log('Fallback duration detected:', media.duration);
          setDuration(media.duration);
        } else if (media.readyState >= 1) {
          // If media has loaded metadata but no duration, try again in 500ms
          setTimeout(checkDuration, 500);
        }
      };

      // Start checking for duration after a brief delay
      setTimeout(checkDuration, 100);
    }

    return () => {
      media.removeEventListener("timeupdate", updateTime);
      media.removeEventListener("loadedmetadata", updateDuration);
      media.removeEventListener("loadeddata", handleLoadedData);
      media.removeEventListener("durationchange", handleDurationChange);
      media.removeEventListener("canplay", handleCanPlay);
      media.removeEventListener("canplaythrough", handleCanPlayThrough);
      media.removeEventListener("ended", handleEnded);
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", handlePause);
      media.removeEventListener("loadstart", handleLoadStart);
      media.removeEventListener("error", handleError);
    };
  }, [mediaUrl]);

  // Update media properties
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.volume = isMuted ? 0 : volume;
    media.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate]);

  // Auto-hide controls for video
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Only auto-hide for videos when playing, never for audio
    if (isVideo && isPlaying && !forceShowControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Ensure controls are always visible for audio files
  useEffect(() => {
    if (!isVideo) {
      setShowControls(true);
    }
  }, [isVideo]);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) {
      console.log('Play/Pause failed: No media element found');
      return;
    }

    console.log(`Toggle play: currently ${isPlaying ? 'playing' : 'paused'}`);

    if (isPlaying) {
      media.pause();
    } else {
      const playPromise = media.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Failed to play media:', error);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (newTime: number[]) => {
    const media = mediaRef.current;
    if (!media) return;

    media.currentTime = newTime[0];
    setCurrentTime(newTime[0]); // Update state immediately for UI responsiveness
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const media = mediaRef.current;
    if (!media) return;

    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    media.volume = volumeValue;
    setIsMuted(volumeValue === 0);
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isMuted) {
      media.volume = volume;
      setIsMuted(false);
    } else {
      media.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const media = mediaRef.current;
    if (!media) {
      console.log('Skip failed: No media element found');
      return;
    }

    // Check if media is loaded
    if (media.readyState < 2) {
      console.log('Skip failed: Media not loaded yet, readyState:', media.readyState);
      return;
    }

    // Use media.duration if available, otherwise use state duration
    const mediaDuration = media.duration || duration;

    // Allow skipping even without duration if media is loaded and playable
    if ((!mediaDuration || mediaDuration === 0 || !isFinite(mediaDuration)) && media.readyState < 2) {
      console.log('Skip failed: No valid duration available and media not ready. Media duration:', media.duration, 'State duration:', duration, 'ReadyState:', media.readyState);
      return;
    }

    // If we don't have duration but media is ready, estimate based on current time and assume reasonable duration
    const effectiveDuration = mediaDuration || Math.max(currentTime + Math.abs(seconds) + 60, 300); // At least 5 minutes

    const currentMediaTime = media.currentTime || currentTime;
    const newTime = Math.max(0, Math.min(effectiveDuration, currentMediaTime + seconds));

    console.log(`Skipping ${seconds}s: ${currentMediaTime.toFixed(2)}s -> ${newTime.toFixed(2)}s (effective duration: ${effectiveDuration.toFixed(2)}s)`);

    try {
      media.currentTime = newTime;
      setCurrentTime(newTime); // Update state immediately for UI responsiveness
      console.log('Skip successful! New time set to:', newTime);
    } catch (error) {
      console.error('Error setting currentTime:', error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    const media = mediaRef.current;
    if (media) {
      media.playbackRate = rate;
    }
  };

  const handleDownload = () => {
    if (mediaUrl) {
      const link = document.createElement('a');
      link.href = mediaUrl;
      link.download = title;
      link.click();
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <DialogTitle className="text-xl font-bold text-left">{title}</DialogTitle>
                  {preacher && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {preacher}
                      </div>
                  )}
                  {series && (
                      <div className="text-sm text-blue-600 font-medium">
                        {series}
                      </div>
                  )}
                  {date && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                  )}
                </div>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="ml-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Media Player */}
            <div className="flex-1 flex flex-col">
              <div
                  ref={containerRef}
                  className="relative flex-1 group bg-black"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => {
                    if (isPlaying && isVideo) {
                      setShowControls(false);
                    }
                  }}
              >
                {isVideo ? (
                    <video
                        ref={mediaRef as React.RefObject<HTMLVideoElement>}
                        src={mediaUrl}
                        poster={coverImage}
                        className="w-full h-full object-contain"
                        onClick={togglePlay}
                        crossOrigin="anonymous"
                        preload="metadata"
                        playsInline
                        controls={false}
                        onLoadStart={() => console.log('Video load started')}
                        onLoadedData={() => console.log('Video data loaded')}
                        onError={(e) => {
                          console.error('Video error:', e);
                          const target = e.target as HTMLVideoElement;
                          console.error('Error details:', {
                            error: target.error,
                            networkState: target.networkState,
                            readyState: target.readyState,
                            src: target.src
                          });
                        }}
                        onStalled={() => console.log('Video stalled')}
                        onSuspend={() => console.log('Video suspended')}
                        onAbort={() => console.log('Video aborted')}
                    >
                      <track kind="captions" srcLang="en" label="English" default />
                    </video>
                ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                      <audio
                          ref={mediaRef as React.RefObject<HTMLAudioElement>}
                          src={mediaUrl}
                          preload="metadata"
                          crossOrigin="anonymous"
                          controls={false}
                      >
                        <track kind="captions" srcLang="en" label="English" default />
                      </audio>

                      {/* Audio Visualization Background */}
                      {coverImage && (
                          <div
                              className="absolute inset-0 bg-cover bg-center opacity-20"
                              style={{ backgroundImage: `url(${coverImage})` }}
                          />
                      )}

                      {/* Center Play Button and Info */}
                      <div className="relative z-10 text-center text-white">
                        <div className="mb-6">
                          <Button
                              onClick={togglePlay}
                              size="lg"
                              className="rounded-full w-24 h-24 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30"
                          >
                            {isPlaying ? (
                                <Pause className="h-10 w-10" />
                            ) : (
                                <Play className="h-10 w-10 ml-1" />
                            )}
                          </Button>
                        </div>

                        {/* Audio Info Display */}
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">{title}</h3>
                          {preacher && (
                              <p className="text-lg text-blue-200">{preacher}</p>
                          )}
                          {duration > 0 && (
                              <div className="flex items-center justify-center text-sm text-blue-200">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatTime(duration)}
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                )}

                {/* Enhanced Controls Overlay */}
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 transition-all duration-300 ${
                        showControls || forceShowControls || !isVideo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    onMouseEnter={() => setForceShowControls(true)}
                    onMouseLeave={() => setForceShowControls(false)}
                    style={{

                      // Force visibility for audio files
                      opacity: !isVideo ? 1 : undefined,
                      transform: !isVideo ? 'translateY(0)' : undefined
                    }}
                >
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleTimeChange}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-white mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Debug Info - Remove this after testing */}
                      {process.env.NODE_ENV === 'development' && (
                          <div className="text-xs text-yellow-300 bg-black/50 px-2 py-1 rounded">
                            Duration: {duration?.toFixed(1) || 'N/A'}s | ReadyState: {mediaRef.current?.readyState || 'N/A'}
                          </div>
                      )}

                      {/* Playback Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                            onClick={() => {
                              console.log('Rewind button clicked');
                              skip(-30);
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 disabled:opacity-50"
                            disabled={(!duration || duration === 0) && (mediaRef.current?.readyState ?? 0) < 2}
                            title="Rewind 30 seconds"
                        >
                          <Rewind className="h-5 w-5" />
                        </Button>

                        <Button
                            onClick={() => {
                              console.log('Skip back button clicked');
                              skip(-10);
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 disabled:opacity-50"
                            disabled={(!duration || duration === 0) && (mediaRef.current?.readyState ?? 0) < 2}
                            title="Skip back 10 seconds"
                        >
                          <SkipBack className="h-5 w-5" />
                        </Button>

                        <Button
                            onClick={togglePlay}
                            size="lg"
                            variant="ghost"
                            className="text-white hover:bg-white/20 w-12 h-12"
                            title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? (
                              <Pause className="h-6 w-6" />
                          ) : (
                              <Play className="h-6 w-6" />
                          )}
                        </Button>

                        <Button
                            onClick={() => {
                              console.log('Skip forward button clicked');
                              skip(10);
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 disabled:opacity-50"
                            disabled={(!duration || duration === 0) && (mediaRef.current?.readyState ?? 0) < 2}
                            title="Skip forward 10 seconds"
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>

                        <Button
                            onClick={() => {
                              console.log('Fast forward button clicked');
                              skip(30);
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 disabled:opacity-50"
                            disabled={(!duration || duration === 0) && (mediaRef.current?.readyState ?? 0) < 2}
                            title="Fast forward 30 seconds"
                        >
                          <FastForward className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center space-x-3">
                        <Button
                            onClick={toggleMute}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                        >
                          {isMuted || volume === 0 ? (
                              <VolumeX className="h-5 w-5" />
                          ) : (
                              <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                        <div className="w-24">
                          <Slider
                              value={[isMuted ? 0 : volume * 100]}
                              max={100}
                              step={1}
                              onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                              className="w-full"
                          />
                        </div>
                      </div>

                      {/* Playback Speed */}
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">Speed:</span>
                        <select
                            value={playbackRate}
                            onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                            className="bg-white/20 text-white text-sm rounded px-2 py-1 border border-white/30"
                        >
                          <option value={0.5} className="text-black">0.5x</option>
                          <option value={0.75} className="text-black">0.75x</option>
                          <option value={1} className="text-black">1x</option>
                          <option value={1.25} className="text-black">1.25x</option>
                          <option value={1.5} className="text-black">1.5x</option>
                          <option value={2} className="text-black">2x</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                          onClick={handleDownload}
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                      >
                        <Download className="h-5 w-5" />
                      </Button>

                      <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => {
                            if (navigator.share && mediaUrl) {
                              navigator.share({
                                title: title,
                                url: mediaUrl,
                              });
                            }
                          }}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {description && (
                  <div className="p-6 border-t bg-gray-50">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
                  </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}

// Standard Media Player Component (for card view)
function StandardMediaPlayer({
                               title,
                               videoUrl,
                               audioUrl,
                               thumbnail,
                               type,
                               className = "",
                             }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => setDuration(media.duration);

    media.addEventListener("timeupdate", updateTime);
    media.addEventListener("loadedmetadata", updateDuration);
    media.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      media.removeEventListener("timeupdate", updateTime);
      media.removeEventListener("loadedmetadata", updateDuration);
      media.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) {
      console.log('Play/Pause failed: No media element found');
      return;
    }

    console.log(`Toggle play: currently ${isPlaying ? 'playing' : 'paused'}`);

    if (isPlaying) {
      media.pause();
    } else {
      const playPromise = media.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Failed to play media:', error);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (newTime: number[]) => {
    const media = mediaRef.current;
    if (!media) return;

    media.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const media = mediaRef.current;
    if (!media) return;

    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    media.volume = volumeValue;
    setIsMuted(volumeValue === 0);
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isMuted) {
      media.volume = volume;
      setIsMuted(false);
    } else {
      media.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const media = mediaRef.current;
    if (!media) {
      console.log('Skip failed: No media element found');
      return;
    }

    if (!duration || duration === 0) {
      console.log('Skip failed: No duration available');
      return;
    }

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    console.log(`Skipping ${seconds}s: ${currentTime}s -> ${newTime}s`);

    media.currentTime = newTime;
    setCurrentTime(newTime); // Update state immediately for UI responsiveness
  };

  const toggleFullscreen = () => {
    if (!containerRef.current || type !== "video") return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && type === "video") {
        setShowControls(false);
      }
    }, 3000);
  };

  const mediaUrl = type === "video" ? videoUrl : audioUrl;

  return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <div
              ref={containerRef}
              className="relative group"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                if (isPlaying && type === "video") {
                  setShowControls(false);
                }
              }}
          >
            {type === "video" ? (
                <video
                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                    src={videoUrl}
                    poster={thumbnail}
                    className="w-full aspect-video bg-black"
                    onClick={togglePlay}
                >
                  <track kind="captions" srcLang="en" label="English" default />
                </video>
            ) : (
                <div className="relative bg-gradient-to-br from-purple-900 to-blue-900 aspect-video flex items-center justify-center">
                  <audio
                      ref={mediaRef as React.RefObject<HTMLAudioElement>}
                      src={audioUrl}
                  >
                    <track kind="captions" srcLang="en" label="English" default />
                  </audio>
                  {thumbnail && (
                      <div
                          className="absolute inset-0 bg-cover bg-center opacity-30"
                          style={{ backgroundImage: `url(${thumbnail})` }}
                      />
                  )}
                  <div className="relative z-10 text-center text-white">
                    <div className="mb-4">
                      <Button
                          onClick={togglePlay}
                          size="lg"
                          className="rounded-full w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      >
                        {isPlaying ? (
                            <Pause className="h-8 w-8" />
                        ) : (
                            <Play className="h-8 w-8 ml-1" />
                        )}
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                  </div>
                </div>
            )}

            {/* Controls Overlay */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                }`}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleTimeChange}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-white mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                      onClick={() => skip(-10)}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                      onClick={togglePlay}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                        <Pause className="h-5 w-5" />
                    ) : (
                        <Play className="h-5 w-5" />
                    )}
                  </Button>

                  <Button
                      onClick={() => skip(10)}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Button
                        onClick={toggleMute}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                    >
                      {isMuted || volume === 0 ? (
                          <VolumeX className="h-4 w-4" />
                      ) : (
                          <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-20">
                      <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  {type === "video" && (
                      <Button
                          onClick={toggleFullscreen}
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                      >
                        {isFullscreen ? (
                            <Minimize className="h-4 w-4" />
                        ) : (
                            <Maximize className="h-4 w-4" />
                        )}
                      </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
