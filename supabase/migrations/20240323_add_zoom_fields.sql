-- Create a function to safely add columns if they don't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
    p_table_name text,
    p_column_name text,
    p_column_type text
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = p_table_name
          AND column_name = p_column_name
    ) THEN
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', 
                      p_table_name, p_column_name, p_column_type);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add Zoom-specific fields to lessons table
SELECT add_column_if_not_exists('lessons', 'zoom_meeting_id', 'TEXT');
SELECT add_column_if_not_exists('lessons', 'zoom_password', 'TEXT');
SELECT add_column_if_not_exists('lessons', 'zoom_host_email', 'TEXT');
SELECT add_column_if_not_exists('lessons', 'zoom_start_url', 'TEXT');

-- Create index for zoom fields if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
          AND tablename = 'lessons' 
          AND indexname = 'idx_lessons_zoom_meeting'
    ) THEN
        CREATE INDEX idx_lessons_zoom_meeting ON public.lessons(zoom_meeting_id);
    END IF;
END $$;

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can view lessons" ON public.lessons;
CREATE POLICY "Anyone can view lessons"
  ON public.lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure proper relationship between lessons and attendance
ALTER TABLE public.attendance
DROP CONSTRAINT IF EXISTS attendance_lesson_id_fkey;

ALTER TABLE public.attendance
ADD CONSTRAINT attendance_lesson_id_fkey 
    FOREIGN KEY (lesson_id) 
    REFERENCES public.lessons(id) 
    ON DELETE CASCADE;