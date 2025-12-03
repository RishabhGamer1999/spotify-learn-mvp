-- Remove INSERT policy for authenticated users on audio_courses table
DROP POLICY IF EXISTS "Authenticated users can insert audio courses" ON public.audio_courses;

-- Remove storage policies that allow user modifications
DROP POLICY IF EXISTS "Authenticated users can upload audio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update audio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete audio files" ON storage.objects;