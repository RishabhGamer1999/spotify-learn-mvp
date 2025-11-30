import { Play, Clock, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PodcastClip, formatDuration } from '@/data/learningData';

interface PodcastCardProps {
  podcast: PodcastClip;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-emerald-500/30 flex items-center justify-center shrink-0">
          <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"/>
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
            Today's Podcast
          </p>
          <h3 className="font-bold text-foreground leading-tight mb-1">{podcast.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {podcast.creator} • {podcast.series}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.round(podcast.duration / 60)} min</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-surface-elevated">
        <p className="text-sm text-muted-foreground italic line-clamp-2">
          "{podcast.transcriptSnippet}"
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {podcast.topics.map((topic) => (
          <span
            key={topic}
            className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-5">
        <Button variant="spotify" className="flex-1">
          <Play className="w-4 h-4 mr-1" fill="currentColor" />
          Play Episode
        </Button>
        <Button variant="outline" size="icon">
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
