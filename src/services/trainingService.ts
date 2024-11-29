import { supabase } from '../lib/supabase';
import { Training } from '../types/training';
import { transformTrainingData } from '../utils/transformers';

export async function getTrainings() {
  try {
    console.log('Fetching trainings...');
    
    const { data: trainings, error } = await supabase
      .from('trainings')
      .select(`
        *,
        lessons (
          id,
          title,
          date,
          start_time,
          duration,
          zoom_link,
          completion_threshold,
          attendance (*)
        ),
        enrollments (
          enrollment_date,
          profiles:student_id (
            id,
            email,
            full_name,
            department,
            avatar_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }

    return trainings.map(transformTrainingData);
  } catch (error) {
    console.error('Error in getTrainings:', error);
    throw error;
  }
}

export async function getTrainingById(id: string) {
  const { data, error } = await supabase
    .from('trainings')
    .select(`
      *,
      lessons (
        id,
        title,
        date,
        start_time,
        duration,
        zoom_link,
        completion_threshold,
        attendance (*)
      ),
      enrollments (
        enrollment_date,
        profiles:student_id (
          id,
          email,
          full_name,
          department,
          avatar_url
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return transformTrainingData(data);
}

export async function createTraining(training: Omit<Training, 'id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: newTraining, error } = await supabase
    .from('trainings')
    .insert({
      title: training.title,
      description: training.description,
      start_date: training.startDate,
      duration: training.duration,
      max_students: training.maxStudents,
      created_by: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return getTrainingById(newTraining.id);
}

export async function updateTraining(id: string, training: Partial<Training>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('trainings')
    .update({
      title: training.title,
      description: training.description,
      start_date: training.startDate,
      duration: training.duration,
      max_students: training.maxStudents
    })
    .eq('id', id);

  if (error) throw error;
  return getTrainingById(id);
}

export async function deleteTraining(id: string) {
  const { error } = await supabase
    .from('trainings')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getStudentTrainings(studentId: string) {
  try {
    const { data: trainings, error } = await supabase
      .from('trainings')
      .select(`
        *,
        lessons (
          id,
          title,
          date,
          start_time,
          duration,
          zoom_link,
          completion_threshold,
          attendance (*)
        ),
        enrollments!inner (
          enrollment_date,
          profiles:student_id (
            id,
            email,
            full_name,
            department,
            avatar_url
          )
        )
      `)
      .eq('enrollments.student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return trainings.map(transformTrainingData);
  } catch (error) {
    console.error('Error fetching student trainings:', error);
    return [];
  }
}