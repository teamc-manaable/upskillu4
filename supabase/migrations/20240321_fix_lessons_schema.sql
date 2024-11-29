-- Drop and recreate lessons table with correct schema
DROP TABLE IF EXISTS public.lessons CASCADE;

CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES public.trainings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration TEXT NOT NULL,
  zoom_link TEXT,
  video_url TEXT,
  video_provider TEXT CHECK (video_provider IN ('youtube', 'vimeo')),
  video_title TEXT,
  completion_threshold INTEGER NOT NULL DEFAULT 80,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view lessons"
  ON public.lessons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON public.lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.email = auth.jwt()->>'email'
    )
  );

-- Grant permissions
GRANT ALL ON public.lessons TO authenticated;