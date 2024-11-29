import { Training } from '../types/training';
import { calculateAttendancePercentage, determineAttendanceStatus } from './attendance';

export function transformTrainingData(training: any): Training {
  return {
    id: training.id,
    title: training.title,
    description: training.description,
    startDate: training.start_date,
    duration: training.duration,
    maxStudents: training.max_students,
    enrolledStudents: training.enrollments?.map((enrollment: any) => ({
      id: enrollment.profiles.id,
      email: enrollment.profiles.email,
      name: enrollment.profiles.full_name,
      department: enrollment.profiles.department,
      avatar: enrollment.profiles.avatar_url,
      enrollmentDate: enrollment.enrollment_date,
      attendance: 0
    })) || [],
    lessons: training.lessons?.map((lesson: any) => {
      const attendanceRecords = lesson.attendance || [];
      const transformedAttendance = attendanceRecords.length > 0 ? {
        lessonId: lesson.id,
        completionThreshold: lesson.completion_threshold,
        studentAttendance: attendanceRecords.map((record: any) => {
          const entries = [{
            joinTime: new Date(record.join_time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            }),
            leaveTime: record.leave_time ? new Date(record.leave_time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            }) : ''
          }];
          
          const attendancePercentage = calculateAttendancePercentage(entries, lesson.duration);
          const status = determineAttendanceStatus(attendancePercentage, lesson.completion_threshold);
          
          return {
            studentId: record.student_id,
            entries,
            attendancePercentage,
            status
          };
        })
      } : undefined;

      return {
        id: lesson.id,
        title: lesson.title,
        date: lesson.date,
        startTime: lesson.start_time,
        duration: lesson.duration,
        zoomLink: lesson.zoom_link,
        videoUrl: lesson.video_url,
        videoProvider: lesson.video_provider,
        videoTitle: lesson.video_title,
        completionThreshold: lesson.completion_threshold,
        attendance: transformedAttendance
      };
    }) || []
  };
}