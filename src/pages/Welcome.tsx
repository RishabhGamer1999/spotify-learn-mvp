import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, Headphones, Sparkles, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!name.trim()) {
      toast({ title: 'Please enter your name', variant: 'destructive' });
      return;
    }
    if (!dateOfBirth) {
      toast({ title: 'Please select your date of birth', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError) throw authError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            name: name.trim(),
            date_of_birth: format(dateOfBirth, 'yyyy-MM-dd'),
            onboarding_completed: false
          }, { onConflict: 'user_id' });

        if (profileError) throw profileError;

        navigate('/onboarding/goals');
      }
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

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError) throw authError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            name: 'Guest',
            onboarding_completed: true
          }, { onConflict: 'user_id' });

        if (profileError) throw profileError;

        const { error: prefsError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: authData.user.id,
            daily_minutes_goal: 15,
            monthly_courses_goal: 1,
            goal_frequency: 'daily',
            learning_purpose: 'curiosity',
            selected_categories: ['personal']
          }, { onConflict: 'user_id' });

        if (prefsError) throw prefsError;

        navigate('/home');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({ 
        title: 'Something went wrong', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
            <Headphones className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to <span className="text-primary">AudioLearn</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personalized audio learning journey starts here
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">What's your name?</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">When were you born?</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal text-lg",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {dateOfBirth ? format(dateOfBirth, "PPP") : "Select your date of birth"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-card" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className="pointer-events-auto"
                  captionLayout="dropdown-buttons"
                  fromYear={1940}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={handleGetStarted} 
            disabled={isLoading || isGuestLoading}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button 
            onClick={handleGuestLogin} 
            disabled={isLoading || isGuestLoading}
            variant="outline"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isGuestLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <>
                <UserCircle className="mr-2 h-5 w-5" />
                Continue as Guest
              </>
            )}
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            { label: '500+', sub: 'Audio Courses' },
            { label: '50k+', sub: 'Learners' },
            { label: '4.9', sub: 'Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
