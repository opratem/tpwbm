"use client";

import { useMediaPlayer } from '@/contexts/MediaPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  User,
  Rewind,
  FastForward,
} from 'lucide-react';
import Image from 'next/image';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useState, useEffect } from 'react';

export function MiniPlayer() {
  const {
    currentMedia,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    showMiniPlayer,
    pauseMedia,
    resumeMedia,
    seekTo,
    setVolume,
    toggleMute,
    hideMiniPlayer,
    showFullPlayer,
  } = useMediaPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!showMiniPlayer || !currentMedia) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMedia();
    } else {
      resumeMedia();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!isDragging) return;
    const newTime = (value[0] / 100) * duration;
    seekTo(newTime);
  };

  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekEnd = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seekTo(newTime);
    setIsDragging(false);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const skip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seekTo(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
      <>
        {/* Backdrop overlay for mobile when expanded */}
        {isExpanded && (
            <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsExpanded(false)}
            />
        )}

        {/* Mini Player */}
        <div
            className={`
          fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${isExpanded ? 'h-80 md:h-24' : 'h-16 md:h-20'}
        `}
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 relative overflow-hidden">
            <div
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: `${progressPercentage}%` }}
            />
            {/* Interactive progress bar for desktop */}
            <div className="absolute inset-0 hidden md:block">
              <Slider
                  value={[isDragging ? (currentTime / duration) * 100 : progressPercentage]}
                  max={100}
                  step={0.1}
                  onValueChange={handleSeek}
                  onPointerDown={handleSeekStart}
                  onPointerUp={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    handleSeekEnd([percentage]);
                  }}
                  className="w-full h-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Main Player Content */}
          <div className="bg-white shadow-lg border-t border-gray-200 backdrop-blur-sm bg-white/95">
            {/* Mobile Expanded View */}
            <div className={`
            md:hidden transition-all duration-300 overflow-hidden
            ${isExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
          `}>
              <div className="p-6 space-y-4">
                {/* Cover Image and Info */}
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <ImageWithFallback
                        src={currentMedia.coverImage}
                        alt={currentMedia.title}
                        fill
                        className="object-cover rounded-lg"
                        fallbackSrc="/images/audio-default.jpg"
                        fallbackIcon={<User className="w-6 h-6 text-gray-400" />}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {currentMedia.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {currentMedia.preacher}
                    </div>
                  </div>
                </div>

                {/* Extended Controls */}
                <div className="space-y-4">
                  {/* Progress Bar for Mobile */}
                  <div className="space-y-2">
                    <Slider
                        value={[isDragging ? (currentTime / duration) * 100 : progressPercentage]}
                        max={100}
                        step={0.1}
                        onValueChange={handleSeek}
                        onPointerDown={handleSeekStart}
                        onPointerUp={(e) => {
                          const percentage = Number(e.currentTarget.getAttribute('aria-valuenow'));
                          handleSeekEnd([percentage]);
                        }}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center space-x-6">
                    <Button
                        onClick={() => skip(-30)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                    >
                      <Rewind className="h-5 w-5" />
                    </Button>

                    <Button
                        onClick={() => skip(-10)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>

                    <Button
                        onClick={handlePlayPause}
                        variant="default"
                        size="lg"
                        className="rounded-full w-12 h-12"
                    >
                      {isPlaying ? (
                          <Pause className="h-6 w-6" />
                      ) : (
                          <Play className="h-6 w-6 ml-0.5" />
                      )}
                    </Button>

                    <Button
                        onClick={() => skip(10)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>

                    <Button
                        onClick={() => skip(30)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                    >
                      <FastForward className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-3">
                    <Button
                        onClick={toggleMute}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                    >
                      {isMuted || volume === 0 ? (
                          <VolumeX className="h-4 w-4" />
                      ) : (
                          <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <Slider
                          value={[isMuted ? 0 : volume * 100]}
                          max={100}
                          step={1}
                          onValueChange={handleVolumeChange}
                          className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact View (always visible) */}
            <div className={`
            flex items-center px-4 py-2 md:py-3 transition-all duration-300
            ${isExpanded ? 'border-t border-gray-200 md:border-t-0' : ''}
          `}>
              {/* Cover Image and Info */}
              <div
                  className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer md:cursor-default"
                  onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <ImageWithFallback
                      src={currentMedia.coverImage}
                      alt={currentMedia.title}
                      fill
                      className="object-cover rounded-md"
                      fallbackSrc="/images/audio-default.jpg"
                      fallbackIcon={<User className="w-4 h-4 text-gray-400" />}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-1">
                    {currentMedia.title}
                  </h3>
                  <div className="flex items-center text-xs md:text-sm text-gray-600">
                    <User className="h-3 w-3 mr-1" />
                    {currentMedia.preacher}
                  </div>
                </div>
              </div>

              {/* Desktop Controls */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Playback Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                      onClick={() => skip(-10)}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                      onClick={handlePlayPause}
                      variant="default"
                      size="sm"
                      className="rounded-full w-8 h-8"
                  >
                    {isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </Button>

                  <Button
                      onClick={() => skip(10)}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Time Display */}
                <div className="text-xs text-gray-500 min-w-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Button
                      onClick={toggleMute}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                  >
                    {isMuted || volume === 0 ? (
                        <VolumeX className="h-4 w-4" />
                    ) : (
                        <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="w-20">
                    <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Play/Pause Button */}
              <div className="flex items-center space-x-2 md:hidden">
                <Button
                    onClick={handlePlayPause}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                >
                  {isPlaying ? (
                      <Pause className="h-5 w-5" />
                  ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 ml-2">
                <Button
                    onClick={showFullPlayer}
                    variant="ghost"
                    size="sm"
                    className="p-2 hidden md:block"
                    title="Open full player"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>

                <Button
                    onClick={hideMiniPlayer}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    title="Close player"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to prevent content from being hidden behind the mini player */}
        <div className={`
        ${isExpanded ? 'h-80 md:h-24' : 'h-16 md:h-20'}
        transition-all duration-300
      `} />
      </>
  );
}
