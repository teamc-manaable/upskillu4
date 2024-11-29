import axios from 'axios';
import { supabase } from '../lib/supabase';
import { getZoomAccessToken } from '../utils/zoom';

const ZOOM_API_BASE = 'https://api.zoom.us/v2';

async function createZoomMeeting(topic: string, startTime: string, duration: number) {
  try {
    const accessToken = await getZoomAccessToken();
    
    const response = await axios.post(`${ZOOM_API_BASE}/users/me/meetings`, {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration,
      settings: {
        join_before_host: true,
        waiting_room: false,
        auto_recording: 'none',
        registrants_email_notification: true,
        registrants_confirmation_email: true
      }
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw error;
  }
}

export async function createZoomMeetingForLesson(lessonId: string, details: {
  title: string;
  date: string;
  startTime: string;
  duration: string;
}) {
  try {
    // Convert duration string to minutes
    const durationMatch = details.duration.match(/(\d+(?:\.\d+)?)\s*(hour|hours)/);
    const durationMinutes = durationMatch ? parseFloat(durationMatch[1]) * 60 : 60;

    // Format start time
    const startDateTime = `${details.date}T${details.startTime}:00`;

    const meeting = await createZoomMeeting(
      details.title,
      startDateTime,
      durationMinutes
    );

    // Update lesson with Zoom details
    const { data, error } = await supabase
      .from('lessons')
      .update({
        zoom_link: meeting.join_url,
        zoom_meeting_id: meeting.id.toString(),
        zoom_password: meeting.password,
        zoom_host_email: meeting.host_email,
        zoom_start_url: meeting.start_url
      })
      .eq('id', lessonId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating Zoom meeting for lesson:', error);
    throw error;
  }
}

export async function joinZoomMeeting(lessonId: string, studentId: string) {
  try {
    // Record attendance start
    const { data: attendance, error } = await supabase
      .from('attendance')
      .insert({
        lesson_id: lessonId,
        student_id: studentId,
        join_time: new Date().toISOString(),
        status: 'joined'
      })
      .select()
      .single();

    if (error) throw error;
    return attendance;
  } catch (error) {
    console.error('Error recording Zoom attendance:', error);
    throw error;
  }
}

export async function leaveZoomMeeting(lessonId: string, studentId: string) {
  try {
    // Update attendance record with leave time
    const { data: attendance, error } = await supabase
      .from('attendance')
      .update({
        leave_time: new Date().toISOString(),
        status: 'completed'
      })
      .eq('lesson_id', lessonId)
      .eq('student_id', studentId)
      .eq('status', 'joined')
      .select()
      .single();

    if (error) throw error;
    return attendance;
  } catch (error) {
    console.error('Error updating Zoom attendance:', error);
    throw error;
  }
}

export async function getZoomMeetingUrl(lessonId: string, studentName: string, studentEmail: string) {
  try {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('zoom_link, zoom_meeting_id, zoom_password')
      .eq('id', lessonId)
      .single();

    if (error) throw error;
    if (!lesson.zoom_link) throw new Error('No Zoom meeting link available');

    // Construct Zoom URL with pre-filled user info
    const zoomUrl = new URL(lesson.zoom_link);
    zoomUrl.searchParams.set('uname', studentName);
    zoomUrl.searchParams.set('email', studentEmail);
    
    if (lesson.zoom_password) {
      zoomUrl.searchParams.set('pwd', lesson.zoom_password);
    }

    return zoomUrl.toString();
  } catch (error) {
    console.error('Error getting Zoom meeting URL:', error);
    throw error;
  }
}