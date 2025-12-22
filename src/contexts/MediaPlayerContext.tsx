"use client";

import type React from 'react';
import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react'

export interface MediaItem {
  id: string;
  title: string;
  preacher: string;
  mediaUrl: string;
  coverImage: string;
  duration?: string;
  series?: string;
  date?: string;
  description?: string;
  isVideo?: boolean;
}

interface MediaPlayerContextType {
  // Current media state
  currentMedia: MediaItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;

  // Mini player state
  showMiniPlayer: boolean;
  isMinimized: boolean;

  // Audio reference
  audioRef: React.RefObject<HTMLAudioElement | null>;

  // Actions
  playMedia: (media: MediaItem) => void;
  pauseMedia: () => void;
  resumeMedia: () => void;
  stopMedia: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  hideMiniPlayer: () => void;
  showFullPlayer: () => void;
  minimizePlayer: () => void;
}

const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(undefined);

interface MediaPlayerProviderProps {
  children: ReactNode;
}

export function MediaPlayerProvider({ children }: MediaPlayerProviderProps) {
  // Media state
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Update audio properties when they change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate]);

  const playMedia = (media: MediaItem) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If it's a video file, don't play in mini player
    if (media.isVideo) {
      return;
    }

    setCurrentMedia(media);
    audio.src = media.mediaUrl;
    audio.play();
    setShowMiniPlayer(true);
    setIsMinimized(false);
  };

  const pauseMedia = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  };

  const resumeMedia = () => {
    const audio = audioRef.current;
    if (audio && currentMedia) {
      audio.play();
    }
  };

  const stopMedia = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentMedia(null);
    setIsPlaying(false);
    setShowMiniPlayer(false);
    setCurrentTime(0);
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
  };

  const hideMiniPlayer = () => {
    stopMedia();
  };

  const showFullPlayer = () => {
    setIsMinimized(false);
  };

  const minimizePlayer = () => {
    setIsMinimized(true);
  };

  const value: MediaPlayerContextType = {
    currentMedia,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    showMiniPlayer,
    isMinimized,
    audioRef,
    playMedia,
    pauseMedia,
    resumeMedia,
    stopMedia,
    seekTo,
    setVolume,
    toggleMute,
    setPlaybackRate,
    hideMiniPlayer,
    showFullPlayer,
    minimizePlayer,
  };

  return (
      <MediaPlayerContext.Provider value={value}>
        {children}
        {/* Global audio element with accessibility support */}
        <audio ref={audioRef} preload="metadata" aria-label="Media player">
          <track kind="captions" />
        </audio>
      </MediaPlayerContext.Provider>
  );
}

export function useMediaPlayer() {
  const context = useContext(MediaPlayerContext);
  if (context === undefined) {
    throw new Error('useMediaPlayer must be used within a MediaPlayerProvider');
  }
  return context;
}
