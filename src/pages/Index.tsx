import { MainLayout } from '@/components/layout/MainLayout';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { DailyPlaylist } from '@/components/dashboard/DailyPlaylist';
import { PodcastCard } from '@/components/dashboard/PodcastCard';
import { BadgeShowcase } from '@/components/dashboard/BadgeShowcase';
import { GoalCard } from '@/components/goals/GoalCard';
import { userProgress, dailyContentDay1, badges, learningGoals } from '@/data/learningData';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const recommendedGoals = learningGoals.slice(0, 3);

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Good evening, Sarah! 👋
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
