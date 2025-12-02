import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioCourse {
  id: string;
  title: string;
  artist: string;
  duration: number;
  type: 'podcast' | 'music' | 'lesson';
  storage_path: string;
  thumbnail_url?: string;
  description?: string;
  category?: string;
  audioUrl?: string;
}

export function useAudioCourses() {
  const [courses, setCourses] = useState<AudioCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('audio_courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Get public URLs for each audio file
      const coursesWithUrls = await Promise.all(
        (data || []).map(async (course) => {
          const { data: urlData } = supabase.storage
            .from('audio-courses')
            .getPublicUrl(course.storage_path);

          return {
            ...course,
            type: course.type as 'podcast' | 'music' | 'lesson',
            audioUrl: urlData.publicUrl,
          } as AudioCourse;
        })
      );

      setCourses(coursesWithUrls);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audio courses');
      console.error('Error fetching audio courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadAudio = async (
    file: File,
    metadata: Omit<AudioCourse, 'id' | 'storage_path' | 'audioUrl'>
  ) => {
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('audio-courses')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert metadata into database
      const { data, error: insertError } = await supabase
        .from('audio_courses')
        .insert({
          ...metadata,
          storage_path: filePath,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Refresh courses list
      await fetchCourses();

      return data;
    } catch (err) {
      console.error('Error uploading audio:', err);
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    uploadAudio,
    refreshCourses: fetchCourses,
  };
}