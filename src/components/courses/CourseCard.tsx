import { Star, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course, formatNumber, getCategoryColor, getDifficultyColor } from '@/data/learningData';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
  return (
    <div
      className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header gradient */}
      <div className="h-24 bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getCategoryColor(course.category))}>
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">by {course.creatorName}</p>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-badge-gold fill-badge-gold" />
            <span className="font-medium text-foreground">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatNumber(course.enrollmentCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{course.durationDays}d</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">${course.price}</span>
            <span className={cn("ml-2 text-xs capitalize", getDifficultyColor(course.difficulty))}>
              {course.difficulty}
            </span>
          </div>
          <Button variant="spotify" size="sm">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}
