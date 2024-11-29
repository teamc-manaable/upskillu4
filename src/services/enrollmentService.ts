import { supabase } from '../lib/supabase';

export async function enrollStudent(trainingId: string, studentId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      training_id: trainingId,
      student_id: studentId,
      enrollment_date: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unenrollStudent(trainingId: string, studentId: string) {
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('training_id', trainingId)
    .eq('student_id', studentId);

  if (error) throw error;
}

export async function getEnrolledStudents(trainingId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      student:profiles(*)
    `)
    .eq('training_id', trainingId);

  if (error) throw error;
  return data;
}

export async function getAvailableStudents(trainingId: string) {
  const { data: enrolledStudents, error: enrolledError } = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('training_id', trainingId);

  if (enrolledError) throw enrolledError;

  const enrolledIds = enrolledStudents.map(e => e.student_id);

  const { data: allStudents, error: studentsError } = await supabase
    .from('profiles')
    .select('*')
    .not('id', 'in', `(${enrolledIds.join(',')})`);

  if (studentsError) throw studentsError;
  return allStudents;
}