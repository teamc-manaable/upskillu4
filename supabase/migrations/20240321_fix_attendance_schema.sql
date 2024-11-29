-- Drop and recreate attendance table with correct schema
DROP TABLE IF EXISTS public.attendance CASCADE;

CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  join_time TIMESTAMPTZ NOT NULL,
  leave_time TIMESTAMPTZ,
  status TEXT CHECK (status IN ('joined', 'completed', 'not_completed')) DEFAULT 'joined',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view attendance"
  ON public.attendance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can manage their own attendance"
  ON public.attendance
  FOR ALL
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE admins.email = auth.jwt()->>'email'
    )
  );

-- Create indexes
CREATE INDEX idx_attendance_lesson_student ON public.attendance(lesson_id, student_id);
CREATE INDEX idx_attendance_status ON public.attendance(status);

-- Grant permissions
GRANT ALL ON public.attendance TO authenticated;