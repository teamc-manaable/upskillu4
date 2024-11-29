-- Add video-related fields to lessons table
ALTER TABLE public.lessons
ADD COLUMN video_url TEXT,
ADD COLUMN video_provider TEXT CHECK (video_provider IN ('youtube', 'vimeo')),
ADD COLUMN video_title TEXT;

-- Create function to extract video ID
CREATE OR REPLACE FUNCTION public.extract_video_id(url TEXT, provider TEXT)
RETURNS TEXT AS $$
BEGIN
  CASE provider
    WHEN 'youtube' THEN
      -- Extract YouTube video ID from various URL formats
      RETURN (regexp_matches(url, '(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})'))[1];
    WHEN 'vimeo' THEN
      -- Extract Vimeo video ID
      RETURN (regexp_matches(url, 'vimeo\.com\/(?:.*\/)?([0-9]+)'))[1];
    ELSE
      RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;