import { MainLayout } from '@/components/layout/MainLayout';
import { useUserStats } from '@/hooks/useUserStats';
import { gamification } from '@/data/learningData';
import { cn } from '@/lib/utils';
import { Trophy, Lock, CheckCircle2, Zap, Target, Award } from 'lucide-react';

const tierColors = {
  bronze: 'from-badge-bronze to-amber-700',
  silver: 'from-badge-silver to-slate-400',
  gold: 'from-badge-gold to-amber-400',
  platinum: 'from-badge-platinum to-cyan-300',
};

const tierBorders = {
  bronze: 'border-badge-bronze',
  silver: 'border-badge-silver',
  gold: 'border-badge-gold',
  platinum: 'border-badge-platinum',
};

const tierGlow = {
  bronze: 'shadow-badge-bronze/30',
  silver: 'shadow-badge-silver/30',
  gold: 'shadow-badge-gold/30',
  platinum: 'shadow-badge-platinum/30',
};

const Achievements = () => {
  const { badges, totalPoints, goalsCompleted, loading } = useUserStats();
  const earnedBadges = badges.filter(b => b.earned);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-badge-gold" />
            Achievements
          </h1>
          <p className="text-muted-foreground">
            Track your badges, certificates, and learning milestones
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-badge-gold/20 flex items-center justify-center">
                <Award className="w-7 h-7 text-badge-gold" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{earnedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{goalsCompleted}</p>
                <p className="text-sm text-muted-foreground">Goals Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <h2 className="text-xl font-bold text-foreground mb-4">All Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {badges.map((badge, index) => (
            <div
              key={badge.id}
              className={cn(
                "relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-300 animate-fade-in",
                badge.earned
                  ? `bg-card ${tierBorders[badge.tier]} hover:scale-105 cursor-pointer shadow-lg ${tierGlow[badge.tier]}`
                  : "bg-muted/30 border-border opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                  badge.earned
                    ? `bg-gradient-to-br ${tierColors[badge.tier]}`
                    : "bg-muted"
                )}
              >
                {badge.earned ? (
                  <span className="text-3xl">
                    {badge.tier === 'bronze' && '🥉'}
                    {badge.tier === 'silver' && '🥈'}
                    {badge.tier === 'gold' && '🥇'}
                    {badge.tier === 'platinum' && '💎'}
                  </span>
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <span className="text-sm font-semibold text-foreground text-center mb-1">
                {badge.name}
              </span>
              <span className="text-xs text-muted-foreground capitalize mb-2">
                {badge.tier}
              </span>
              <span className="text-[10px] text-muted-foreground text-center">
                {badge.criteria}
              </span>
              {badge.earned && (
                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary" />
              )}
              {badge.earnedDate && (
                <span className="text-[10px] text-primary mt-2">
                  Earned {new Date(badge.earnedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Gamification Info */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">How to Earn Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                +{gamification.pointsPerDayCompleted}
              </div>
              <span className="text-sm text-muted-foreground">Per day completed</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated">
              <div className="w-10 h-10 rounded-full bg-badge-gold/20 flex items-center justify-center text-badge-gold font-bold">
                +{gamification.pointsPerWeekStreak}
              </div>
              <span className="text-sm text-muted-foreground">Per week streak</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated">
              <div className="w-10 h-10 rounded-full bg-badge-platinum/20 flex items-center justify-center text-badge-platinum font-bold text-xs">
                +{gamification.pointsPerGoalCompleted}
              </div>
              <span className="text-sm text-muted-foreground">Per goal completed</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;
