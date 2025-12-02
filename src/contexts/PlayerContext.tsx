import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  type: 'song' | 'podcast';
  duration: number; // in seconds
  audioUrl?: string; // URL to the actual audio file
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    // Update currentTime when audio plays
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    // Handle when audio ends
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

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
      if (audioRef.current) {
        audioRef.current.play();
      }
      setIsPlaying(true);
    } else {
      // Save current track progress before switching
      if (currentTrack) {
        trackProgress[currentTrack.id] = currentTime;
      }
      
      // Load new track
      setCurrentTrack(track);
      const savedProgress = trackProgress[track.id] || 0;
      setCurrentTime(savedProgress);
      
      if (audioRef.current && track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = savedProgress;
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        // Fallback for tracks without audio URL (simulated playback)
        setIsPlaying(true);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      play(currentTrack);
    }
  };

  const seek = (time: number) => {
    if (currentTrack) {
      const clampedTime = Math.max(0, Math.min(time, currentTrack.duration));
      setCurrentTime(clampedTime);
      if (audioRef.current) {
        audioRef.current.currentTime = clampedTime;
      }
    }
  };

  const skipForward = () => {
    if (currentTrack && audioRef.current) {
      const newTime = Math.min(currentTime + 10, currentTrack.duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
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
