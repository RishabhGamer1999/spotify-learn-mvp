import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAudioCourses } from '@/hooks/useAudioCourses';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AudioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [type, setType] = useState<'podcast' | 'music' | 'lesson'>('podcast');
  const [uploading, setUploading] = useState(false);
  
  const { courses, loading, uploadAudio } = useAudioCourses();
  const { play } = usePlayer();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !artist) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      
      // Get audio duration
      const audio = new Audio();
      const duration = await new Promise<number>((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(Math.floor(audio.duration));
        });
        audio.src = URL.createObjectURL(file);
      });

      await uploadAudio(file, {
        title,
        artist,
        type,
        duration,
      });

      toast({
        title: 'Success!',
        description: 'Audio file uploaded successfully',
      });

      // Reset form
      setFile(null);
      setTitle('');
      setArtist('');
      setType('podcast');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload audio',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePlay = (course: typeof courses[0]) => {
    play({
      id: course.id,
      title: course.title,
      artist: course.artist,
      type: course.type === 'lesson' ? 'podcast' : (course.type as 'podcast' | 'song'),
      duration: course.duration,
      audioUrl: course.audioUrl,
    });
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Audio Course Manager</h1>

        {/* Upload Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Upload New Audio</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="file">Audio File</Label>
              <Input
                id="file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter audio title"
                  disabled={uploading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="artist">Artist/Creator *</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name"
                  disabled={uploading}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'podcast' | 'music' | 'lesson')}
                className="w-full px-3 py-2 bg-background border border-border rounded-md"
                disabled={uploading}
              >
                <option value="podcast">Podcast</option>
                <option value="music">Music</option>
                <option value="lesson">Lesson</option>
              </select>
            </div>

            <Button type="submit" disabled={!file || uploading} className="w-full">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Audio List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Uploaded Audio Files</h2>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : courses.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No audio files uploaded yet. Upload your first audio above!
            </Card>
          ) : (
            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.artist}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                          {course.type}
                        </span>
                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                          {Math.floor(course.duration / 60)}:{(course.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="spotify"
                      size="icon"
                      onClick={() => handlePlay(course)}
                    >
                      <Play className="w-5 h-5" fill="currentColor" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}