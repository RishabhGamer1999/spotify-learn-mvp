import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, eachDayOfInterval, parseISO } from 'date-fns';

interface UserPreferences {
  dailyMinutesGoal: number;
  monthlyCoursesGoal: number;
  learningPurpose: string | null;
  selectedCategories: string[];
}

interface LearningActivity {
  date: string;
  minutesLearned: number;
  coursesCompleted: number;
}

interface WeeklyProgress {
  day: string;
  minutes: number;
}

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [monthlyActivity, setMonthlyActivity] = useState<LearningActivity[]>([]);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [monthlyCoursesCompleted, setMonthlyCoursesCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user preferences
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('daily_minutes_goal, monthly_courses_goal, learning_purpose, selected_categories')
          .eq('user_id', user.id)
          .maybeSingle();

        if (prefsError) {
          console.error('Error fetching preferences:', prefsError);
        }

        if (prefsData) {
          setPreferences({
            dailyMinutesGoal: prefsData.daily_minutes_goal || 15,
            monthlyCoursesGoal: prefsData.monthly_courses_goal || 1,
            learningPurpose: prefsData.learning_purpose,
            selectedCategories: prefsData.selected_categories || [],
          });
        } else {
          setPreferences({
            dailyMinutesGoal: 15,
            monthlyCoursesGoal: 1,
            learningPurpose: null,
            selectedCategories: [],
          });
        }

        // Fetch this week's activity
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);

        const { data: activityData, error: activityError } = await supabase
          .from('learning_activity')
          .select('activity_date, minutes_learned, courses_completed')
          .eq('user_id', user.id)
          .gte('activity_date', format(monthStart, 'yyyy-MM-dd'))
          .lte('activity_date', format(monthEnd, 'yyyy-MM-dd'));

        if (activityError) {
          console.error('Error fetching activity:', activityError);
        }

        const activityMap = new Map<string, LearningActivity>();
        if (activityData) {
          activityData.forEach((item) => {
            activityMap.set(item.activity_date, {
              date: item.activity_date,
              minutesLearned: item.minutes_learned,
              coursesCompleted: item.courses_completed,
            });
          });
        }

        // Set monthly activity
        setMonthlyActivity(activityData?.map(item => ({
          date: item.activity_date,
          minutesLearned: item.minutes_learned,
          coursesCompleted: item.courses_completed,
        })) || []);

        // Calculate weekly progress
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const weekly = weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const activity = activityMap.get(dateStr);
          return {
            day: format(day, 'EEE'),
            minutes: activity?.minutesLearned || 0,
          };
        });
        setWeeklyProgress(weekly);

        // Today's minutes
        const todayStr = format(today, 'yyyy-MM-dd');
        const todayActivity = activityMap.get(todayStr);
        setTodayMinutes(todayActivity?.minutesLearned || 0);

        // Monthly courses completed
        const totalCourses = activityData?.reduce((sum, item) => sum + item.courses_completed, 0) || 0;
        setMonthlyCoursesCompleted(totalCourses);

        // Calculate streak
        let streak = 0;
        const sortedDates = Array.from(activityMap.keys())
          .filter(date => activityMap.get(date)!.minutesLearned > 0)
          .sort()
          .reverse();

        if (sortedDates.length > 0) {
          const currentDate = new Date();
          let checkDate = new Date(currentDate);
          
          for (const dateStr of sortedDates) {
            const activityDate = parseISO(dateStr);
            const checkDateStr = format(checkDate, 'yyyy-MM-dd');
            
            if (dateStr === checkDateStr || dateStr === format(new Date(checkDate.getTime() - 86400000), 'yyyy-MM-dd')) {
              streak++;
              checkDate = activityDate;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
        setCurrentStreak(streak);

      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return {
    preferences,
    weeklyProgress,
    monthlyActivity,
    todayMinutes,
    monthlyCoursesCompleted,
    currentStreak,
    loading,
  };
}
