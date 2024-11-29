import { EnrolledStudent } from './student';
import { AttendanceRecord, LessonAttendance } from './attendance';

export interface Lesson {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: string;
  zoomLink?: string;
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo';
  videoTitle?: string;
  completionThreshold: number;
  attendance?: LessonAttendance;
  attendanceRecords?: AttendanceRecord[];
}

export interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  maxStudents: number;
  enrolledStudents: EnrolledStudent[];
  lessons: Lesson[];
}