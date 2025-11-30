import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DailyContent, formatDuration } from '@/data/learningData';

interface DailyPlaylistProps {
  content: DailyContent;
}

export function DailyPlaylist({ content }: DailyPlaylistProps) {
  const totalDuration = content.songs.reduce((acc, song) => acc + song.duration, 0);

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
          <Button variant="spotify" size="icon" className="w-12 h-12">
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {content.songs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center gap-4 px-5 py-3 hover:bg-surface-elevated transition-colors group cursor-pointer"
          >
            <span className="w-6 text-center text-sm text-muted-foreground group-hover:hidden">
              {index + 1}
            </span>
            <Play className="w-4 h-4 text-foreground hidden group-hover:block" />
            
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
