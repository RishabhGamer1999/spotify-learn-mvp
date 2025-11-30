import { Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearningGoal, formatNumber, getCategoryColor, getDifficultyColor } from '@/data/learningData';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: LearningGoal;
  index: number;
}

export function GoalCard({ goal, index }: GoalCardProps) {
  return (
    <div
      className="group relative rounded-2xl bg-card border border-border p-5 hover:bg-surface-elevated hover:border-primary/30 transition-all duration-300 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getCategoryColor(goal.category))}>
          {goal.category}
        </span>
        <span className={cn("text-xs font-medium capitalize", getDifficultyColor(goal.difficulty))}>
          {goal.difficulty}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {goal.title}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {goal.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-muted-foreground">
            #{tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{goal.estimatedDays} days</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{formatNumber(goal.enrollmentCount)} enrolled</span>
        </div>
      </div>

      {/* Action */}
      <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        Start Learning
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
