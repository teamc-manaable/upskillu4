import { supabase } from '../lib/supabase';
import { Student } from '../types/student';

export async function getAvailableStudents(trainingId: string): Promise<Student[]> {
  try {
    // Get currently enrolled student IDs
    const { data: enrolledStudents, error: enrolledError } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('training_id', trainingId);

    if (enrolledError) throw enrolledError;

    const enrolledIds = enrolledStudents?.map(e => e.student_id) || [];

    // Get all students
    let query = supabase.from('profiles').select('*');
    
    // Only apply the filter if there are enrolled students
    if (enrolledIds.length > 0) {
      query = query.not('id', 'in', `(${enrolledIds.join(',')})`);
    }

    const { data: students, error: studentsError } = await query;

    if (studentsError) throw studentsError;

    return (students || []).map(student => ({
      id: student.id,
      email: student.email,
      name: student.full_name,
      department: student.department,
      avatar: student.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name)}`
    }));
  } catch (error) {
    console.error('Error fetching available students:', error);
    throw error;
  }
}

export async function enrollStudent(trainingId: string, studentId: string) {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        training_id: trainingId,
        student_id: studentId,
        enrollment_date: new Date().toISOString()
      })
      .select(`
        *,
        profiles:student_id (
          id,
          email,
          full_name,
          department,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.profiles.id,
      email: data.profiles.email,
      name: data.profiles.full_name,
      department: data.profiles.department,
      avatar: data.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.profiles.full_name)}`,
      enrollmentDate: data.enrollment_date,
      attendance: 0
    };
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
}

export async function removeStudent(trainingId: string, studentId: string) {
  try {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('training_id', trainingId)
      .eq('student_id', studentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing student:', error);
    throw error;
  }
}