import { supabase } from '../lib/supabase';
import { AttendanceEntry } from '../types/attendance';
import { calculateAttendancePercentage, determineAttendanceStatus } from '../utils/attendance';

export async function recordAttendance(
  lessonId: string,
  studentId: string,
  entry: AttendanceEntry
) {
  console.log('Recording attendance:', { lessonId, studentId, entry });
  
  const { data, error } = await supabase
    .from('attendance')
    .insert({
      lesson_id: lessonId,
      student_id: studentId,
      join_time: entry.joinTime,
      leave_time: entry.leaveTime || null,
      status: 'joined'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error recording attendance:', error);
    throw error;
  }

  return data;
}

export async function updateAttendance(
  lessonId: string,
  studentId: string,
  entry: Partial<AttendanceEntry>
) {
  console.log('Updating attendance:', { lessonId, studentId, entry });

  // First, get the lesson details to check completion threshold and duration
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (lessonError) throw lessonError;

  // Get all attendance entries for this student in this lesson
  const { data: attendanceEntries, error: entriesError } = await supabase
    .from('attendance')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('student_id', studentId);

  if (entriesError) throw entriesError;

  // Calculate attendance percentage
  const entries = attendanceEntries.map(entry => ({
    joinTime: new Date(entry.join_time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    leaveTime: entry.leave_time ? new Date(entry.leave_time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) : ''
  }));

  const attendancePercentage = calculateAttendancePercentage(entries, lesson.duration);
  const status = determineAttendanceStatus(attendancePercentage, lesson.completion_threshold);

  // Update the attendance record
  const { data, error } = await supabase
    .from('attendance')
    .update({
      leave_time: entry.leaveTime,
      status: status.toLowerCase()
    })
    .eq('lesson_id', lessonId)
    .eq('student_id', studentId)
    .eq('status', 'joined')
    .select('*')
    .single();

  if (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }

  return data;
}

export async function getAttendance(lessonId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      student:profiles(*)
    `)
    .eq('lesson_id', lessonId);

  if (error) throw error;
  return data;
}