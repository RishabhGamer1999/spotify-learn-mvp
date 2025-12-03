import { MainLayout } from '@/components/layout/MainLayout';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { DailyPlaylist } from '@/components/dashboard/DailyPlaylist';
import { PodcastCard } from '@/components/dashboard/PodcastCard';
import { Progress } from '@/components/ui/progress';
import { dailyContentDay1, learningGoals } from '@/data/learningData';
import { useUserStats } from '@/hooks/useUserStats';
import { CheckCircle2, Lock, Calendar, TrendingUp } from 'lucide-react';

const Learning = () => {
  const { progress, badges, loading } = useUserStats();
  
  const currentGoal = progress ? learningGoals.find(g => g.id === progress.goalId) : null;
  const completedDays = progress ? progress.currentDay - 1 : 0;
  
  // Generate milestone days
  const milestones = [7, 14, 21, 30];

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
          <h1 className="text-3xl font-bold text-foreground mb-2">My Learning</h1>
          <p className="text-muted-foreground">
            Track your progress and continue learning
          </p>
        </div>

        {/* Current Progress */}
        <div className="mb-8">
          <ProgressCard progress={progress} badges={badges} />
        </div>

        {progress && currentGoal && (
          <>
            {/* Daily Content */}
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Day {progress.currentDay} Content
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <DailyPlaylist content={dailyContentDay1} />
              <PodcastCard podcast={dailyContentDay1.podcast} />
            </div>

            {/* Learning Timeline */}
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Learning Timeline
            </h2>
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">
                  Day 1
                </span>
                <span className="text-sm text-muted-foreground">
                  Day {currentGoal.estimatedDays}
                </span>
              </div>

              {/* Progress track */}
              <div className="relative mb-8">
                <Progress value={progress.completionPercentage} className="h-2" />
                
                {/* Milestone markers */}
                <div className="absolute top-0 left-0 right-0 flex justify-between" style={{ transform: 'translateY(-50%)' }}>
                  {milestones.map((day) => {
                    const position = (day / currentGoal.estimatedDays) * 100;
                    const isCompleted = day <= completedDays;
                    const isCurrent = day === progress.currentDay;
                    
                    return (
                      <div
                        key={day}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${Math.min(position, 100)}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          isCompleted 
                            ? 'bg-primary border-primary' 
                            : isCurrent 
                              ? 'bg-primary/20 border-primary animate-pulse'
                              : 'bg-muted border-border'
                        }`} />
                        <span className="text-xs text-muted-foreground mt-2">Day {day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day list */}
              <div className="grid grid-cols-7 gap-2 mt-12">
                {Array.from({ length: currentGoal.estimatedDays }).map((_, index) => {
                  const day = index + 1;
                  const isCompleted = day < progress.currentDay;
                  const isCurrent = day === progress.currentDay;
                  const isLocked = day > progress.currentDay;

                  return (
                    <button
                      key={day}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        isCompleted
                          ? 'bg-primary/20 text-primary hover:bg-primary/30'
                          : isCurrent
                            ? 'bg-primary text-primary-foreground glow-primary'
                            : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      }`}
                      disabled={isLocked}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        day
                      ) : isLocked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        day
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Learning;
