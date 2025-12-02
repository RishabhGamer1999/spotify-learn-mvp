-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-courses', 'audio-courses', true)
ON CONFLICT (id) DO NOTHING;

-- Create table for audio course metadata
CREATE TABLE public.audio_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  type TEXT NOT NULL CHECK (type IN ('podcast', 'music', 'lesson')),
  storage_path TEXT NOT NULL, -- path to file in storage
  thumbnail_url TEXT,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.audio_courses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view/play audio courses)
CREATE POLICY "Audio courses are viewable by everyone"
ON public.audio_courses
FOR SELECT
USING (true);

-- Create policy for authenticated users to upload (optional - you can manage this)
CREATE POLICY "Authenticated users can insert audio courses"
ON public.audio_courses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create storage policies for public access to audio files
CREATE POLICY "Audio files are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'audio-courses');

-- Create policy for authenticated users to upload audio files
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-courses');

-- Create policy for authenticated users to update their audio files
CREATE POLICY "Authenticated users can update audio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'audio-courses');

-- Create policy for authenticated users to delete audio files
CREATE POLICY "Authenticated users can delete audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'audio-courses');

-- Create trigger for updating updated_at
CREATE TRIGGER update_audio_courses_updated_at
BEFORE UPDATE ON public.audio_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();