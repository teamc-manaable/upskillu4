import { supabase } from '../lib/supabase';
import { Lesson } from '../types/training';

export async function createLesson(trainingId: string, lesson: Omit<Lesson, 'id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  console.log('Creating lesson:', { trainingId, lesson });

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      training_id: trainingId,
      title: lesson.title,
      date: lesson.date,
      start_time: lesson.startTime,
      duration: lesson.duration,
      zoom_link: lesson.zoomLink,
      video_url: lesson.videoUrl,
      video_provider: lesson.videoProvider,
      video_title: lesson.videoTitle,
      completion_threshold: lesson.completionThreshold,
      created_by: user.id
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }

  console.log('Lesson created:', data);

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    startTime: data.start_time,
    duration: data.duration,
    zoomLink: data.zoom_link,
    videoUrl: data.video_url,
    videoProvider: data.video_provider,
    videoTitle: data.video_title,
    completionThreshold: data.completion_threshold,
    attendance: undefined
  };
}

export async function getLessonsByTraining(trainingId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      attendance:attendance(*)
    `)
    .eq('training_id', trainingId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }

  console.log('Fetched lessons:', data);
  return data;
}

export async function updateLesson(id: string, lesson: Partial<Lesson>) {
  const { data, error } = await supabase
    .from('lessons')
    .update({
      title: lesson.title,
      date: lesson.date,
      start_time: lesson.startTime,
      duration: lesson.duration,
      zoom_link: lesson.zoomLink,
      video_url: lesson.videoUrl,
      video_provider: lesson.videoProvider,
      video_title: lesson.videoTitle,
      completion_threshold: lesson.completionThreshold
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}