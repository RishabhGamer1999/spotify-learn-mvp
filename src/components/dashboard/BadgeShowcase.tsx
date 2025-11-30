import { Badge } from '@/data/learningData';
import { cn } from '@/lib/utils';
import { Lock, CheckCircle2 } from 'lucide-react';

interface BadgeShowcaseProps {
  badges: Badge[];
}

const tierColors = {
  bronze: 'from-badge-bronze to-amber-700',
  silver: 'from-badge-silver to-slate-400',
  gold: 'from-badge-gold to-amber-400',
  platinum: 'from-badge-platinum to-cyan-300',
};

const tierBorders = {
  bronze: 'border-badge-bronze/50',
  silver: 'border-badge-silver/50',
  gold: 'border-badge-gold/50',
  platinum: 'border-badge-platinum/50',
};

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  const earnedBadges = badges.filter(b => b.earned);

  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Achievements</h3>
        <span className="text-sm text-muted-foreground">
          {earnedBadges.length}/{badges.length} earned
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "relative flex flex-col items-center p-3 rounded-xl border transition-all duration-300",
              badge.earned
                ? `bg-surface-elevated ${tierBorders[badge.tier]} hover:scale-105 cursor-pointer`
                : "bg-muted/30 border-border opacity-50"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                badge.earned
                  ? `bg-gradient-to-br ${tierColors[badge.tier]}`
                  : "bg-muted"
              )}
            >
              {badge.earned ? (
                <span className="text-xl">
                  {badge.tier === 'bronze' && '🥉'}
                  {badge.tier === 'silver' && '🥈'}
                  {badge.tier === 'gold' && '🥇'}
                  {badge.tier === 'platinum' && '💎'}
                </span>
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <span className="text-xs font-medium text-foreground text-center line-clamp-1">
              {badge.name}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {badge.tier}
            </span>
            {badge.earned && (
              <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
