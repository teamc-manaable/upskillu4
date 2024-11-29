import { EnrolledStudent } from './student';

export interface AttendanceEntry {
  joinTime: string;
  leaveTime: string;
}

export interface AttendanceRecord {
  studentId: string;
  lessonId: string;
  entries: AttendanceEntry[];
  totalAttendancePercentage: number;
}

export interface LessonAttendance {
  lessonId: string;
  completionThreshold: number;
  studentAttendance: {
    studentId: string;
    entries: AttendanceEntry[];
    attendancePercentage: number;
    status: 'Completed' | 'Not Completed';
  }[];
}