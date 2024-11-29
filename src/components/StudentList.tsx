import React from 'react';
import { EnrolledStudent } from '../types/student';

interface StudentListProps {
  students: EnrolledStudent[];
  onRemoveStudent?: (studentId: string) => void;
  isAdmin?: boolean;
}

export function StudentList({ students, onRemoveStudent, isAdmin }: StudentListProps) {
  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{student.name}</p>
              <p className="text-xs text-gray-500">{student.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-gray-500 block">
                Joined {new Date(student.enrollmentDate).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                {student.department}
              </span>
            </div>
            {isAdmin && onRemoveStudent && (
              <button
                onClick={() => onRemoveStudent(student.id)}
                className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors ml-4"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}