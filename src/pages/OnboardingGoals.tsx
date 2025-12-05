import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { 
  Clock, 
  Target, 
  Briefcase, 
  User, 
  Lightbulb, 
  Palette, 
  Compass,
  BookOpen,
  Loader2,
  Check
} from 'lucide-react';

const purposes = [
  { id: 'career', label: 'Career Growth', icon: Briefcase },
  { id: 'personal', label: 'Personal Development', icon: User },
  { id: 'skill', label: 'New Skills', icon: Lightbulb },
  { id: 'hobby', label: 'Hobby & Fun', icon: Palette },
  { id: 'curiosity', label: 'Curiosity', icon: Compass },
];

const categories = [
  { id: 'communication', label: 'Communication', emoji: '💬' },
  { id: 'language', label: 'Language Learning', emoji: '🌍' },
  { id: 'wellness', label: 'Wellness & Mindfulness', emoji: '🧘' },
  { id: 'creative', label: 'Creative Arts', emoji: '🎨' },
  { id: 'finance', label: 'Finance & Investing', emoji: '💰' },
  { id: 'fitness', label: 'Fitness & Health', emoji: '💪' },
  { id: 'business', label: 'Business & Leadership', emoji: '📊' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'personal', label: 'Personal Development', emoji: '🌱' },
];

export default function OnboardingGoals() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [monthlyCourses, setMonthlyCourses] = useState(2);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Save preferences
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          daily_minutes_goal: dailyMinutes,
          monthly_courses_goal: monthlyCourses,
          goal_frequency: 'daily',
          learning_purpose: selectedPurpose,
          selected_categories: selectedCategories,
        }, { onConflict: 'user_id' });

      if (prefsError) throw prefsError;

      // Mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast.success('Welcome aboard! Your learning journey begins now.');
      navigate('/home');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                s === step ? "bg-primary w-8" : s < step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step 1: Learning Goals */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Set Your Learning Goals</h1>
              <p className="text-muted-foreground">How much time can you dedicate to learning?</p>
            </div>

            {/* Daily Minutes Goal */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Daily Learning Goal</h3>
                  <p className="text-sm text-muted-foreground">Minutes per day</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">15 min</span>
                  <span className="text-3xl font-bold text-primary">{dailyMinutes} min</span>
                  <span className="text-sm text-muted-foreground">120 min</span>
                </div>
                <Slider
                  value={[dailyMinutes]}
                  onValueChange={(value) => setDailyMinutes(value[0])}
                  min={15}
                  max={120}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Monthly Courses Goal */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Monthly Course Goal</h3>
                  <p className="text-sm text-muted-foreground">Courses to complete per month</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">1 course</span>
                  <span className="text-3xl font-bold text-primary">{monthlyCourses} {monthlyCourses === 1 ? 'course' : 'courses'}</span>
                  <span className="text-sm text-muted-foreground">10 courses</span>
                </div>
                <Slider
                  value={[monthlyCourses]}
                  onValueChange={(value) => setMonthlyCourses(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-semibold"
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Learning Purpose */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">What's Your Purpose?</h1>
              <p className="text-muted-foreground">Help us understand why you want to learn</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {purposes.map((purpose) => {
                const Icon = purpose.icon;
                const isSelected = selectedPurpose === purpose.id;
                return (
                  <button
                    key={purpose.id}
                    onClick={() => setSelectedPurpose(purpose.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200",
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={cn(
                      "font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {purpose.label}
                    </span>
                    {isSelected && <Check className="w-5 h-5 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline"
                className="flex-1 h-14"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                className="flex-1 h-14 text-lg font-semibold"
                onClick={() => setStep(3)}
                disabled={!selectedPurpose}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Categories */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Pick Your Interests</h1>
              <p className="text-muted-foreground">Select topics you'd like to explore</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl">{category.emoji}</span>
                    <span className={cn(
                      "text-sm font-medium text-center",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {category.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline"
                className="flex-1 h-14"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button 
                className="flex-1 h-14 text-lg font-semibold"
                onClick={handleComplete}
                disabled={selectedCategories.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Start Learning
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
