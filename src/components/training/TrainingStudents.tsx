import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { EnrolledStudent, Student } from '../../types/student';
import { StudentList } from '../StudentList';
import { Modal } from '../ui/Modal';
import { AddStudentForm } from '../AddStudentForm';

interface TrainingStudentsProps {
  students: EnrolledStudent[];
  onRemoveStudent: (studentId: string) => void;
  isAdmin: boolean;
  availableStudents: Student[];
  onAddStudent: (studentId: string) => void;
}

export function TrainingStudents({
  students,
  onRemoveStudent,
  isAdmin,
  availableStudents,
  onAddStudent
}: TrainingStudentsProps) {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  const handleAddStudent = async (studentId: string) => {
    try {
      await onAddStudent(studentId);
      setIsAddStudentModalOpen(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-500" />
            Enrolled Students
          </h2>
          {isAdmin && (
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 flex items-center text-sm"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add Student
            </button>
          )}
        </div>

        {students.length > 0 ? (
          <StudentList
            students={students}
            onRemoveStudent={isAdmin ? onRemoveStudent : undefined}
            isAdmin={isAdmin}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-md">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            {isAdmin ? (
              <>
                <p className="text-gray-500 text-sm mb-4">Ready to enroll students?</p>
                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enroll First Student
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No students enrolled yet</p>
            )}
          </div>
        )}

        <Modal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          title="Add Student"
        >
          <AddStudentForm
            availableStudents={availableStudents}
            onAddStudent={handleAddStudent}
            onCancel={() => setIsAddStudentModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
}