import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/contexts/PlayerContext';
import { Slider } from '@/components/ui/slider';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function BottomPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime,
    volume,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    setVolume
  } = usePlayer();

  // Empty state when no track is selected
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-card border-t border-border z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Play className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Select a lesson or podcast to start learning</span>
            <span className="text-sm sm:hidden">Select content to learn</span>
          </div>
        </div>
      </div>
    );
  }

  const progress = (currentTime / currentTrack.duration) * 100;

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * currentTrack.duration;
    seek(newTime);
  };

  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-card border-t border-border z-50">
      <div className="max-w-screen-xl mx-auto">
        {/* Progress bar with time */}
        <div className="px-3 md:px-4 pt-2">
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 gap-2">
          {/* Track info */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary/30 to-emerald-500/30 flex items-center justify-center shrink-0">
              {currentTrack.type === 'podcast' ? (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm md:text-base truncate">{currentTrack.title}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground relative w-8 h-8 md:w-10 md:h-10"
              onClick={skipBackward}
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute text-[8px] md:text-[10px] font-bold">10</span>
            </Button>
            
            <Button 
              variant="spotify" 
              size="icon" 
              className="w-10 h-10 md:w-12 md:h-12"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5" fill="currentColor" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground relative w-8 h-8 md:w-10 md:h-10"
              onClick={skipForward}
            >
              <RotateCw className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute text-[8px] md:text-[10px] font-bold">10</span>
            </Button>
          </div>

          {/* Volume control - hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setVolume(volume > 0 ? 0 : 70)}
            >
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
