-- Add Zoom-specific fields to lessons table
ALTER TABLE public.lessons
ADD COLUMN zoom_meeting_id TEXT,
ADD COLUMN zoom_password TEXT,
ADD COLUMN zoom_topic TEXT;

-- Add status field to attendance table
ALTER TABLE public.attendance
ADD COLUMN status TEXT CHECK (status IN ('joined', 'completed')) DEFAULT 'joined';

-- Create index for faster attendance queries
CREATE INDEX IF NOT EXISTS idx_attendance_lesson_student
ON public.attendance(lesson_id, student_id, status);

-- Update attendance policies
CREATE POLICY "Students can insert their own attendance"
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = student_id AND
  EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.training_id = (
      SELECT training_id FROM public.lessons WHERE id = lesson_id
    )
    AND e.student_id = auth.uid()
  )
);

CREATE POLICY "Students can update their own attendance"
ON public.attendance
FOR UPDATE
TO authenticated
USING (
  auth.uid() = student_id
)
WITH CHECK (
  auth.uid() = student_id
);