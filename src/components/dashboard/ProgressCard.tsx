import { Flame, Clock, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { UserProgress, learningGoals } from '@/data/learningData';

interface ProgressCardProps {
  progress: UserProgress | null;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  if (!progress) return null;
  
  const goal = learningGoals.find(g => g.id === progress.goalId);
  if (!goal) return null;

  const daysRemaining = goal.estimatedDays - progress.currentDay;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-6 border border-border">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Learning Goal</p>
            <h2 className="text-2xl font-bold text-foreground">{goal.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{goal.category}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">{progress.streakCount} day streak</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Day {progress.currentDay} of {goal.estimatedDays}</span>
            <span className="text-sm font-semibold text-primary">{progress.completionPercentage}%</span>
          </div>
          <Progress value={progress.completionPercentage} className="h-3" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{Math.round(progress.totalListeningMinutes / 60)}h</p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{daysRemaining}</p>
              <p className="text-xs text-muted-foreground">Days Left</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
              <span className="text-lg">🏆</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">2</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>

        <Button variant="spotify" size="lg" className="w-full">
          Continue Day {progress.currentDay}
        </Button>
      </div>
    </div>
  );
}
