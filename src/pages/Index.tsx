import { MainLayout } from '@/components/layout/MainLayout';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { DailyPlaylist } from '@/components/dashboard/DailyPlaylist';
import { PodcastCard } from '@/components/dashboard/PodcastCard';
import { BadgeShowcase } from '@/components/dashboard/BadgeShowcase';
import { GoalCard } from '@/components/goals/GoalCard';
import { dailyContentDay1, learningGoals, UserProgress, Badge } from '@/data/learningData';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Index = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  
  const recommendedGoals = learningGoals.slice(0, 3);
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const greeting = getGreeting();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (progressData) {
          setUserProgress({
            goalId: progressData.goal_id,
            currentDay: progressData.current_day,
            status: progressData.status as 'active' | 'paused' | 'completed',
            completionPercentage: progressData.completion_percentage,
            streakCount: progressData.streak_count,
            totalListeningMinutes: progressData.total_listening_minutes,
            lastActivity: progressData.last_activity,
          });
        }

        // Fetch user badges
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_date', { ascending: false });

        if (badgesData) {
          setBadges(badgesData.map(b => ({
            id: b.badge_id,
            name: b.badge_name,
            tier: b.tier as 'bronze' | 'silver' | 'gold' | 'platinum',
            criteria: b.criteria,
            earned: true,
            earnedDate: b.earned_date,
          })));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            You're making great progress. Let's keep the momentum going!
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Card - spans 2 columns */}
          <div className="lg:col-span-2">
            <ProgressCard progress={userProgress} />
          </div>

          {/* Badge Showcase */}
          <div>
            <BadgeShowcase badges={badges} />
          </div>
        </div>

        {/* Daily Content Section */}
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Today's Learning Content
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <DailyPlaylist content={dailyContentDay1} />
          <PodcastCard podcast={dailyContentDay1.podcast} />
        </div>

        {/* Recommended Goals */}
        <h2 className="text-xl font-bold text-foreground mb-4">
          Explore More Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedGoals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
