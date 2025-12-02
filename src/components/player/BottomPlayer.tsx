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

  if (!currentTrack) return null;

  const progress = (currentTime / currentTrack.duration) * 100;

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * currentTrack.duration;
    seek(newTime);
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-card border-t border-border z-50">
      <div className="max-w-screen-xl mx-auto">
        {/* Progress bar with time */}
        <div className="px-4 pt-2">
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

        <div className="flex items-center justify-between px-4 py-3">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-emerald-500/30 flex items-center justify-center shrink-0">
              {currentTrack.type === 'podcast' ? (
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground relative"
              onClick={skipBackward}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="absolute text-[10px] font-bold">10</span>
            </Button>
            
            <Button 
              variant="spotify" 
              size="icon" 
              className="w-12 h-12"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground relative"
              onClick={skipForward}
            >
              <RotateCw className="w-5 h-5" />
              <span className="absolute text-[10px] font-bold">10</span>
            </Button>
          </div>

          {/* Volume control */}
          <div className="flex-1 flex justify-end items-center gap-2">
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
