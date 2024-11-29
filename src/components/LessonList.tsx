import React from 'react';
import { Calendar, Clock, Video, Users } from 'lucide-react';
import { Lesson } from '../types/training';
import { EnrolledStudent } from '../types/student';
import { Badge } from './ui/Badge';
import { useAuth } from '../contexts/AuthContext';

interface LessonListProps {
  lessons: Lesson[];
  enrolledStudents: EnrolledStudent[];
  onUpdateAttendance: (lessonId: string, attendanceData: any) => void;
}

export function LessonList({ lessons, enrolledStudents }: LessonListProps) {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const formatTime = (time: string) => {
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => (
        <div
          key={lesson.id}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">
                Lesson #{index + 1}: {lesson.title}
              </h4>
              {lesson.attendance && (
                <p className="text-sm text-gray-600 mt-1">
                  Completion Threshold: {lesson.completionThreshold}%
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
              <span className="text-sm">{new Date(lesson.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-indigo-500" />
              <span className="text-sm">{lesson.startTime} ({lesson.duration})</span>
            </div>
          </div>

          {lesson.attendance && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="flex items-center text-gray-600 mb-2">
                <Users className="h-4 w-4 mr-2 text-indigo-500" />
                <span className="text-sm font-medium">Lesson Attendance</span>
              </div>
              <div className="space-y-3">
                {lesson.attendance.studentAttendance.map((record) => {
                  const student = enrolledStudents.find(s => s.id === record.studentId);
                  return (
                    <div key={record.studentId} className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{student?.name}</span>
                        <Badge
                          variant={record.status === 'Completed' ? 'success' : 'error'}
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {record.entries.map((entry, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-20">Session {index + 1}:</span>
                            <span>{formatTime(entry.joinTime)} - {formatTime(entry.leaveTime)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {lesson.zoomLink && (
            <div className="mt-3 flex items-center text-indigo-600">
              <Video className="h-4 w-4 mr-2" />
              <a
                href={lesson.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline transition-colors"
              >
                Join Zoom Meeting
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}