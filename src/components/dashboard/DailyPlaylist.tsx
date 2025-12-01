import { Play, Clock, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DailyContent, formatDuration } from '@/data/learningData';
import { usePlayer } from '@/contexts/PlayerContext';

interface DailyPlaylistProps {
  content: DailyContent;
}

export function DailyPlaylist({ content }: DailyPlaylistProps) {
  const { play, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const totalDuration = content.songs.reduce((acc, song) => acc + song.duration, 0);

  const handlePlayAll = () => {
    if (content.songs.length > 0) {
      const firstSong = content.songs[0];
      play({ id: firstSong.id, title: firstSong.title, artist: firstSong.artist, type: 'song' });
    }
  };

  const handlePlaySong = (song: typeof content.songs[0]) => {
    if (currentTrack?.id === song.id && isPlaying) {
      togglePlayPause();
    } else {
      play({ id: song.id, title: song.title, artist: song.artist, type: 'song' });
    }
  };

  const isCurrentlyPlaying = (songId: string) => currentTrack?.id === songId && isPlaying;

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Day {content.day} Playlist</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {content.songs.length} songs • {formatDuration(totalDuration)}
            </p>
          </div>
          <Button variant="spotify" size="icon" className="w-12 h-12" onClick={handlePlayAll}>
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {content.songs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center gap-4 px-5 py-3 hover:bg-surface-elevated transition-colors group cursor-pointer"
            onClick={() => handlePlaySong(song)}
          >
            <span className={`w-6 text-center text-sm ${isCurrentlyPlaying(song.id) ? 'text-primary' : 'text-muted-foreground'} group-hover:hidden`}>
              {isCurrentlyPlaying(song.id) ? (
                <div className="flex justify-center gap-0.5">
                  <span className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-primary rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-3 bg-primary rounded-full animate-pulse delay-150" />
                </div>
              ) : (
                index + 1
              )}
            </span>
            {isCurrentlyPlaying(song.id) ? (
              <Pause className="w-4 h-4 text-primary hidden group-hover:block" />
            ) : (
              <Play className="w-4 h-4 text-foreground hidden group-hover:block" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{song.title}</p>
              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${
                      i < Math.ceil(song.energyLevel / 2) 
                        ? 'bg-primary h-3' 
                        : 'bg-muted h-2'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {formatDuration(song.duration)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
