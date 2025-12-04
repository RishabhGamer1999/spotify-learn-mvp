import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Calendar, Clock, Briefcase, Heart, Lightbulb, Palette, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const frequencies = [
  { id: 'daily', label: 'Daily', description: 'Learn every day for consistent progress', icon: Calendar },
  { id: 'weekly', label: 'Weekly', description: 'Learn at your own pace each week', icon: Clock },
];

const purposes = [
  { id: 'career', label: 'Career Advancement', icon: Briefcase },
  { id: 'personal', label: 'Personal Growth', icon: Heart },
  { id: 'skill', label: 'Skill Development', icon: Target },
  { id: 'hobby', label: 'Hobby Exploration', icon: Palette },
  { id: 'curiosity', label: 'Just Curious', icon: Lightbulb },
];

const categories = [
  { id: 'communication', label: 'Communication', emoji: '🗣️' },
  { id: 'language', label: 'Language Learning', emoji: '🌍' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'creative', label: 'Creative Arts', emoji: '🎨' },
  { id: 'fitness', label: 'Fitness', emoji: '🏃' },
  { id: 'development', label: 'Personal Development', emoji: '🌱' },
];

export default function OnboardingGoals() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedFrequency, setSelectedFrequency] = useState('daily');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = async () => {
    if (!selectedPurpose) {
      toast({ title: 'Please select why you want to learn', variant: 'destructive' });
      return;
    }
    if (selectedCategories.length === 0) {
      toast({ title: 'Please select at least one category', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // Save user preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user!.id,
          goal_frequency: selectedFrequency,
          learning_purpose: selectedPurpose,
          selected_categories: selectedCategories
        }, { onConflict: 'user_id' });

      if (prefError) throw prefError;

      // Mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user!.id);

      if (profileError) throw profileError;

      toast({ title: 'Welcome aboard! 🎉', description: 'Your learning journey begins now.' });
      navigate('/home');
    } catch (error: any) {
      console.error('Error:', error);
      toast({ 
        title: 'Something went wrong', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full transition-all",
                s <= step ? "bg-primary w-12" : "bg-muted w-8"
              )}
            />
          ))}
        </div>

        {/* Step 1: Frequency */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">How often do you want to learn?</h1>
              <p className="text-muted-foreground">Choose a pace that fits your lifestyle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frequencies.map((freq) => (
                <button
                  key={freq.id}
                  onClick={() => setSelectedFrequency(freq.id)}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                    selectedFrequency === freq.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  )}
                >
                  <freq.icon className={cn(
                    "w-8 h-8 mb-3",
                    selectedFrequency === freq.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h3 className="text-xl font-semibold">{freq.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{freq.description}</p>
                </button>
              ))}
            </div>

            <Button onClick={() => setStep(2)} className="w-full h-12 text-lg" size="lg">
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Purpose */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Why do you want to learn?</h1>
              <p className="text-muted-foreground">This helps us personalize your experience</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {purposes.map((purpose) => (
                <button
                  key={purpose.id}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 flex items-center gap-3 transition-all hover:border-primary/50",
                    selectedPurpose === purpose.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  )}
                >
                  <purpose.icon className={cn(
                    "w-6 h-6",
                    selectedPurpose === purpose.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="font-medium">{purpose.label}</span>
                  {selectedPurpose === purpose.id && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!selectedPurpose}
                className="flex-1 h-12 text-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Categories */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">What do you want to learn?</h1>
              <p className="text-muted-foreground">Select one or more categories that interest you</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "px-5 py-3 rounded-full border-2 flex items-center gap-2 transition-all hover:border-primary/50",
                    selectedCategories.includes(category.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card"
                  )}
                >
                  <span className="text-xl">{category.emoji}</span>
                  <span className="font-medium">{category.label}</span>
                  {selectedCategories.includes(category.id) && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                Back
              </Button>
              <Button 
                onClick={handleComplete} 
                disabled={isLoading || selectedCategories.length === 0}
                className="flex-1 h-12 text-lg"
              >
                {isLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                ) : (
                  "Start Learning"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
