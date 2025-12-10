import { MainLayout } from '@/components/layout/MainLayout';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Flame, BarChart3, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { format, isSameDay, parseISO } from 'date-fns';

const Goals = () => {
  const { 
    preferences, 
    weeklyProgress, 
    monthlyActivity, 
    todayMinutes, 
    monthlyCoursesCompleted,
    currentStreak,
    loading 
  } = useUserPreferences();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const dailyGoal = preferences?.dailyMinutesGoal || 15;
  const monthlyGoal = preferences?.monthlyCoursesGoal || 1;
  const dailyProgress = Math.min((todayMinutes / dailyGoal) * 100, 100);
  const monthlyProgress = Math.min((monthlyCoursesCompleted / monthlyGoal) * 100, 100);

  // Get active dates for calendar
  const activeDates = monthlyActivity
    .filter(a => a.minutesLearned > 0)
    .map(a => parseISO(a.date));

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Your Goals</h1>
          <p className="text-sm md:text-base text-muted-foreground">Track your learning progress and stay motivated</p>
        </div>

        {/* Goal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Daily Learning Card */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Daily Learning</CardTitle>
                    <p className="text-sm text-muted-foreground">Target: {dailyGoal} mins/day</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-primary">{todayMinutes}</span>
                  <p className="text-sm text-muted-foreground">minutes</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={dailyProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {dailyProgress >= 100 
                  ? "🎉 Goal completed!" 
                  : `${dailyGoal - todayMinutes} minutes to go`}
              </p>
            </CardContent>
          </Card>

          {/* Monthly Target Card */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Monthly Target</CardTitle>
                    <p className="text-sm text-muted-foreground">Target: {monthlyGoal} {monthlyGoal === 1 ? 'course' : 'courses'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-primary">{monthlyCoursesCompleted}</span>
                  <p className="text-sm text-muted-foreground">{monthlyCoursesCompleted === 1 ? 'course' : 'courses'}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={monthlyProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {monthlyProgress >= 100 
                  ? "🎉 Monthly goal achieved!" 
                  : `${monthlyGoal - monthlyCoursesCompleted} more to go`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Streak Calendar */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>Streak Calendar</CardTitle>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{currentStreak} Day Streak</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="multiple"
                selected={activeDates}
                className="rounded-md"
                modifiers={{
                  active: activeDates,
                }}
                modifiersStyles={{
                  active: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: 'bold',
                  },
                }}
                disabled
              />
            </CardContent>
          </Card>

          {/* Weekly Progress Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Weekly Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `${value}m`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number) => [`${value} mins`, 'Learning Time']}
                    />
                    <Bar 
                      dataKey="minutes" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Total this week: {' '}
                  <span className="font-semibold text-foreground">
                    {weeklyProgress.reduce((sum, day) => sum + day.minutes, 0)} minutes
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Goals;
