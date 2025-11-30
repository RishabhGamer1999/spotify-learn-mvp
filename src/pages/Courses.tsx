import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import { courses } from '@/data/learningData';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

const categories = ['All', 'Communication', 'Language Learning', 'Wellness', 'Finance', 'Technology', 'Business'];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Course Marketplace
          </h1>
          <p className="text-muted-foreground">
            Premium courses from expert creators
          </p>
        </div>

        {/* Featured Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/30 via-emerald-500/20 to-primary/10 p-8 mb-8 border border-primary/20">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative z-10">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Featured</span>
            <h2 className="text-2xl font-bold text-foreground mt-2 mb-2">AI for Everyone</h2>
            <p className="text-muted-foreground mb-4 max-w-xl">
              Understand AI without coding. Join 22K+ learners on this beginner-friendly journey into artificial intelligence.
            </p>
            <Button variant="spotify">
              Explore Course
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="h-12">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Sort & Filter
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
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
        </p>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Courses;
