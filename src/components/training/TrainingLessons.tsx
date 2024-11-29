import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Lesson } from '../../types/training';
import { EnrolledStudent } from '../../types/student';
import { LessonList } from '../LessonList';

interface TrainingLessonsProps {
  lessons: Lesson[];
  enrolledStudents: EnrolledStudent[];
  onUpdateAttendance: (lessonId: string, attendanceData: any) => void;
  onAddLesson: (data: any) => void;
  isAdmin: boolean;
}

export function TrainingLessons({
  lessons,
  enrolledStudents,
  onUpdateAttendance,
  onAddLesson,
  isAdmin
}: TrainingLessonsProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
            Lessons
          </h2>
        </div>

        {lessons.length > 0 ? (
          <LessonList
            lessons={lessons}
            enrolledStudents={enrolledStudents}
            onUpdateAttendance={onUpdateAttendance}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-md">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm">No lessons scheduled yet</p>
          </div>
        )}
      </div>
    </div>
  );
}