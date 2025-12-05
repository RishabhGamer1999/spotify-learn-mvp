-- Add daily minutes goal and monthly courses goal to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS daily_minutes_goal integer NOT NULL DEFAULT 15,
ADD COLUMN IF NOT EXISTS monthly_courses_goal integer NOT NULL DEFAULT 1;

-- Create learning_activity table to track daily learning for streak calendar
CREATE TABLE IF NOT EXISTS public.learning_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  minutes_learned INTEGER NOT NULL DEFAULT 0,
  courses_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Enable RLS on learning_activity
ALTER TABLE public.learning_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for learning_activity
CREATE POLICY "Users can view their own activity" 
ON public.learning_activity 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" 
ON public.learning_activity 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" 
ON public.learning_activity 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_learning_activity_updated_at
BEFORE UPDATE ON public.learning_activity
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();