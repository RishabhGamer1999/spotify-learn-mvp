import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: 'song' | 'podcast';
  duration: number; // in seconds
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  play: (track: Track) => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Store progress for each track
const trackProgress: Record<string, number> = {};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save progress when track changes or pauses
  useEffect(() => {
    if (currentTrack && !isPlaying) {
      trackProgress[currentTrack.id] = currentTime;
    }
  }, [isPlaying, currentTrack, currentTime]);

  // Timer for real-time progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            setIsPlaying(false);
            return currentTrack.duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTrack]);

  const play = (track: Track) => {
    if (currentTrack?.id === track.id) {
      // Resume same track
      setIsPlaying(true);
    } else {
      // Save current track progress before switching
      if (currentTrack) {
        trackProgress[currentTrack.id] = currentTime;
      }
      // Load saved progress or start from 0
      const savedProgress = trackProgress[track.id] || 0;
      setCurrentTrack(track);
      setCurrentTime(savedProgress);
      setIsPlaying(true);
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    if (currentTrack) {
      const clampedTime = Math.max(0, Math.min(time, currentTrack.duration));
      setCurrentTime(clampedTime);
    }
  };

  const skipForward = () => {
    if (currentTrack) {
      const newTime = Math.min(currentTime + 10, currentTrack.duration);
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    setCurrentTime(newTime);
  };

  const setVolume = (vol: number) => {
    setVolumeState(Math.max(0, Math.min(100, vol)));
  };

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      currentTime,
      volume,
      play, 
      pause, 
      togglePlayPause,
      seek,
      skipForward,
      skipBackward,
      setVolume
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
