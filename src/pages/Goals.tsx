import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GoalCard } from '@/components/goals/GoalCard';
import { Button } from '@/components/ui/button';
import { learningGoals } from '@/data/learningData';
import { Search, Filter } from 'lucide-react';

const categories = [
  'All',
  'Communication',
  'Language Learning',
  'Wellness',
  'Creative Arts',
  'Finance',
  'Fitness',
  'Business',
  'Technology',
  'Personal Development',
];

const Goals = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGoals = learningGoals.filter((goal) => {
    const matchesCategory = selectedCategory === 'All' || goal.category === selectedCategory;
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Goals</h1>
          <p className="text-muted-foreground">
            Choose a goal and start your personalized learning journey
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="h-12">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'pill'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredGoals.length} goal{filteredGoals.length !== 1 ? 's' : ''} found
        </p>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No goals found matching your criteria.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Goals;
