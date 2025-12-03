import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Badge, UserProgress } from '@/data/learningData';

interface UserStats {
  progress: UserProgress | null;
  badges: Badge[];
  totalPoints: number;
  goalsCompleted: number;
  loading: boolean;
}

// Define all available badges that can be earned
export const availableBadges: Omit<Badge, 'earned' | 'earnedDate'>[] = [
  { id: 'B-001', name: 'First Step', tier: 'bronze', criteria: 'Complete Day 1' },
  { id: 'B-002', name: 'Week Warrior', tier: 'silver', criteria: '7-day streak' },
  { id: 'B-003', name: 'Consistency King', tier: 'gold', criteria: '21-day streak' },
  { id: 'B-004', name: 'Platinum Achiever', tier: 'platinum', criteria: 'Complete goal with 95%+ engagement' },
  { id: 'B-005', name: 'Speed Learner', tier: 'gold', criteria: 'Complete 30-day goal in 25 days' },
  { id: 'B-006', name: 'Multi-Goal Master', tier: 'platinum', criteria: 'Complete 3 goals' },
];

export function useUserStats(): UserStats {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set());
  const [earnedBadgesData, setEarnedBadgesData] = useState<Map<string, string>>(new Map());
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserStats = async () => {
      try {
        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (progressData) {
          setProgress({
            goalId: progressData.goal_id,
            currentDay: progressData.current_day,
            status: progressData.status as 'active' | 'paused' | 'completed',
            completionPercentage: progressData.completion_percentage,
            streakCount: progressData.streak_count,
            totalListeningMinutes: progressData.total_listening_minutes,
            lastActivity: progressData.last_activity,
          });
        }

        // Fetch completed goals count
        const { count: completedCount } = await supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed');

        setGoalsCompleted(completedCount || 0);

        // Fetch user badges
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);

        if (badgesData) {
          const badgeIds = new Set(badgesData.map(b => b.badge_id));
          const badgeDates = new Map(badgesData.map(b => [b.badge_id, b.earned_date]));
          setEarnedBadgeIds(badgeIds);
          setEarnedBadgesData(badgeDates);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();

    // Subscribe to real-time updates
    const progressChannel = supabase
      .channel('user-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchUserStats()
      )
      .subscribe();

    const badgesChannel = supabase
      .channel('user-badges-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_badges',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchUserStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(progressChannel);
      supabase.removeChannel(badgesChannel);
    };
  }, [user]);

  // Combine available badges with earned status
  const badges: Badge[] = availableBadges.map(badge => ({
    ...badge,
    earned: earnedBadgeIds.has(badge.id),
    earnedDate: earnedBadgesData.get(badge.id),
  }));

  // Calculate total points
  const earnedBadges = badges.filter(b => b.earned);
  const totalPoints = 
    (progress?.currentDay || 0) * 100 + // 100 points per day
    Math.floor((progress?.streakCount || 0) / 7) * 500 + // 500 points per week streak
    goalsCompleted * 5000 + // 5000 points per goal completed
    earnedBadges.length * 250; // 250 points per badge

  return {
    progress,
    badges,
    totalPoints,
    goalsCompleted,
    loading,
  };
}
