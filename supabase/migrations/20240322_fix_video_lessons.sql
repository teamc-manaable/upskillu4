-- Add video-specific fields to lessons table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'lessons' AND column_name = 'video_url') THEN
        ALTER TABLE public.lessons
        ADD COLUMN video_url TEXT,
        ADD COLUMN video_provider TEXT CHECK (video_provider IN ('youtube', 'vimeo')),
        ADD COLUMN video_title TEXT;
    END IF;
END $$;

-- Create index for video fields
CREATE INDEX IF NOT EXISTS idx_lessons_video ON public.lessons(video_url, video_provider);

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;
CREATE POLICY "Anyone can view lessons"
  ON public.lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure proper relationship between lessons and attendance
ALTER TABLE public.attendance
DROP CONSTRAINT IF EXISTS attendance_lesson_id_fkey,
ADD CONSTRAINT attendance_lesson_id_fkey 
    FOREIGN KEY (lesson_id) 
    REFERENCES public.lessons(id) 
    ON DELETE CASCADE;