export interface LearningGoal {
  id: string;
  title: string;
  category: string;
  estimatedDays: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  enrollmentCount: number;
  imageUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  energyLevel: number;
  relevanceScore: number;
}

export interface PodcastClip {
  id: string;
  title: string;
  creator: string;
  series: string;
  duration: number;
  topics: string[];
  transcriptSnippet: string;
}

export interface DailyContent {
  day: number;
  songs: Song[];
  podcast: PodcastClip;
}

export interface UserProgress {
  goalId: string;
  currentDay: number;
  status: 'active' | 'paused' | 'completed';
  completionPercentage: number;
  streakCount: number;
  totalListeningMinutes: number;
  lastActivity: string;
}

export interface Badge {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: string;
  earned: boolean;
  earnedDate?: string;
}

export interface Course {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  category: string;
  price: number;
  durationDays: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrollmentCount: number;
  description: string;
}

// Learning Goals Data
export const learningGoals: LearningGoal[] = [
  {
    id: 'LG-001',
    title: 'Master Public Speaking',
    category: 'Communication',
    estimatedDays: 30,
    difficulty: 'intermediate',
    tags: ['communication', 'leadership', 'confidence'],
    enrollmentCount: 15420,
  },
  {
    id: 'LG-002',
    title: 'Learn Spanish Basics',
    category: 'Language Learning',
    estimatedDays: 45,
    difficulty: 'beginner',
    tags: ['spanish', 'language', 'vocabulary'],
    enrollmentCount: 28750,
  },
  {
    id: 'LG-003',
    title: 'Meditation & Mindfulness',
    category: 'Wellness',
    estimatedDays: 21,
    difficulty: 'beginner',
    tags: ['meditation', 'mindfulness', 'mental-health'],
    enrollmentCount: 42890,
  },
  {
    id: 'LG-004',
    title: 'Become a Better Writer',
    category: 'Creative Arts',
    estimatedDays: 30,
    difficulty: 'intermediate',
    tags: ['writing', 'creativity', 'storytelling'],
    enrollmentCount: 12340,
  },
  {
    id: 'LG-005',
    title: 'Financial Literacy 101',
    category: 'Finance',
    estimatedDays: 30,
    difficulty: 'beginner',
    tags: ['finance', 'investing', 'budgeting'],
    enrollmentCount: 31250,
  },
  {
    id: 'LG-006',
    title: 'Marathon Training Mindset',
    category: 'Fitness',
    estimatedDays: 90,
    difficulty: 'advanced',
    tags: ['running', 'marathon', 'fitness'],
    enrollmentCount: 8920,
  },
  {
    id: 'LG-007',
    title: 'Entrepreneurship Essentials',
    category: 'Business',
    estimatedDays: 45,
    difficulty: 'intermediate',
    tags: ['entrepreneurship', 'startup', 'business'],
    enrollmentCount: 19870,
  },
  {
    id: 'LG-008',
    title: 'Sleep Better Tonight',
    category: 'Wellness',
    estimatedDays: 14,
    difficulty: 'beginner',
    tags: ['sleep', 'wellness', 'relaxation'],
    enrollmentCount: 51200,
  },
  {
    id: 'LG-009',
    title: 'AI & Machine Learning Basics',
    category: 'Technology',
    estimatedDays: 30,
    difficulty: 'intermediate',
    tags: ['AI', 'machine-learning', 'technology'],
    enrollmentCount: 22450,
  },
  {
    id: 'LG-010',
    title: 'Confidence & Self-Esteem',
    category: 'Personal Development',
    estimatedDays: 21,
    difficulty: 'beginner',
    tags: ['confidence', 'self-esteem', 'personal-growth'],
    enrollmentCount: 38900,
  },
];

// Sample Daily Content for Day 1 of Public Speaking
export const dailyContentDay1: DailyContent = {
  day: 1,
  songs: [
    { id: 'S-001', title: 'Eye of the Tiger', artist: 'Survivor', duration: 246, energyLevel: 9, relevanceScore: 8 },
    { id: 'S-002', title: 'Lose Yourself', artist: 'Eminem', duration: 326, energyLevel: 10, relevanceScore: 9 },
    { id: 'S-003', title: 'Hall of Fame', artist: 'The Script', duration: 201, energyLevel: 8, relevanceScore: 8 },
    { id: 'S-004', title: 'Confident', artist: 'Demi Lovato', duration: 216, energyLevel: 9, relevanceScore: 9 },
    { id: 'S-005', title: 'Stronger', artist: 'Kanye West', duration: 312, energyLevel: 9, relevanceScore: 7 },
  ],
  podcast: {
    id: 'P-001',
    title: 'The Fear of Public Speaking - Origins & Solutions',
    creator: 'Dr. Sarah Chen',
    series: 'Communication Mastery',
    duration: 1218,
    topics: ['glossophobia', 'amygdala response', 'reframing'],
    transcriptSnippet: "The fear of public speaking affects 75% of people. Your brain can't distinguish between real and perceived threats...",
  },
};

// User Progress
export const userProgress: UserProgress = {
  goalId: 'LG-001',
  currentDay: 18,
  status: 'active',
  completionPercentage: 60,
  streakCount: 18,
  totalListeningMinutes: 2587,
  lastActivity: '2025-11-02T19:30:00Z',
};

// Badges
export const badges: Badge[] = [
  { id: 'B-001', name: 'First Step', tier: 'bronze', criteria: 'Complete Day 1', earned: true, earnedDate: '2025-10-15' },
  { id: 'B-002', name: 'Week Warrior', tier: 'silver', criteria: '7-day streak', earned: true, earnedDate: '2025-10-22' },
  { id: 'B-003', name: 'Consistency King', tier: 'gold', criteria: '21-day streak', earned: false },
  { id: 'B-004', name: 'Platinum Achiever', tier: 'platinum', criteria: 'Complete goal with 95%+ engagement', earned: false },
  { id: 'B-005', name: 'Speed Learner', tier: 'gold', criteria: 'Complete 30-day goal in 25 days', earned: false },
  { id: 'B-006', name: 'Multi-Goal Master', tier: 'platinum', criteria: 'Complete 3 goals', earned: false },
];

// Courses
export const courses: Course[] = [
  {
    id: 'CRS-001',
    title: 'Advanced Negotiation Mastery',
    creatorId: 'CR-001',
    creatorName: 'Dr. Sarah Chen',
    category: 'Communication',
    price: 49.99,
    durationDays: 30,
    difficulty: 'advanced',
    rating: 4.8,
    enrollmentCount: 8450,
    description: 'Master negotiation psychology and tactics',
  },
  {
    id: 'CRS-002',
    title: 'Spanish Fluency Fast Track',
    creatorId: 'CR-003',
    creatorName: 'Prof. Elena Rodriguez',
    category: 'Language Learning',
    price: 59.99,
    durationDays: 60,
    difficulty: 'intermediate',
    rating: 4.9,
    enrollmentCount: 15230,
    description: 'Accelerated path to conversational Spanish',
  },
  {
    id: 'CRS-003',
    title: 'Deep Meditation Techniques',
    creatorId: 'CR-004',
    creatorName: 'David Kim',
    category: 'Wellness',
    price: 39.99,
    durationDays: 45,
    difficulty: 'intermediate',
    rating: 4.8,
    enrollmentCount: 12890,
    description: 'Advanced meditation for inner peace',
  },
  {
    id: 'CRS-004',
    title: 'Stock Market Investing 201',
    creatorId: 'CR-006',
    creatorName: 'James Mitchell',
    category: 'Finance',
    price: 99.99,
    durationDays: 45,
    difficulty: 'intermediate',
    rating: 4.9,
    enrollmentCount: 18790,
    description: 'Beyond basics: Building wealth through stocks',
  },
  {
    id: 'CRS-005',
    title: 'AI for Everyone',
    creatorId: 'CR-008',
    creatorName: 'Dr. Raj Patel',
    category: 'Technology',
    price: 69.99,
    durationDays: 30,
    difficulty: 'beginner',
    rating: 4.9,
    enrollmentCount: 22450,
    description: 'Understand AI without coding',
  },
];

// Gamification Points
export const gamification = {
  pointsPerDayCompleted: 100,
  pointsPerWeekStreak: 500,
  pointsPerGoalCompleted: 5000,
  leaderboardEnabled: true,
  socialSharingEnabled: true,
};

// Helper functions
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Communication': 'bg-blue-500/20 text-blue-400',
    'Language Learning': 'bg-purple-500/20 text-purple-400',
    'Wellness': 'bg-emerald-500/20 text-emerald-400',
    'Creative Arts': 'bg-pink-500/20 text-pink-400',
    'Finance': 'bg-yellow-500/20 text-yellow-400',
    'Fitness': 'bg-orange-500/20 text-orange-400',
    'Business': 'bg-cyan-500/20 text-cyan-400',
    'Technology': 'bg-indigo-500/20 text-indigo-400',
    'Personal Development': 'bg-rose-500/20 text-rose-400',
  };
  return colors[category] || 'bg-muted text-muted-foreground';
};

export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    'beginner': 'text-emerald-400',
    'intermediate': 'text-yellow-400',
    'advanced': 'text-red-400',
  };
  return colors[difficulty] || 'text-muted-foreground';
};
