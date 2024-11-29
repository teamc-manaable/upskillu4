import React from 'react';
import { ArrowLeft, Plus, UserPlus } from 'lucide-react';
import { Training } from '../../types/training';
import { Modal } from '../ui/Modal';
import { CreateLessonForm } from '../forms/CreateLessonForm';
import { AddStudentForm } from '../AddStudentForm';
import { Student } from '../../types/student';

interface TrainingHeaderProps {
  training: Training;
  isAdmin: boolean;
  onAddLesson: (data: any) => void;
  onAddStudent: (studentId: string) => void;
  availableStudents: Student[];
  onBack: () => void;
}

export function TrainingHeader({ 
  training, 
  isAdmin, 
  onAddLesson, 
  onAddStudent,
  availableStudents,
  onBack
}: TrainingHeaderProps) {
  const [isLessonModalOpen, setIsLessonModalOpen] = React.useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = React.useState(false);

  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Training List
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{training.title}</h1>
          <p className="mt-2 text-gray-600">{training.description}</p>
        </div>
        {isAdmin && (
          <div className="flex space-x-4">
            <button
              onClick={() => setIsLessonModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Lesson
            </button>
            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Student
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title="Add New Lesson"
      >
        <CreateLessonForm
          lessonNumber={training.lessons.length + 1}
          onSubmit={(data) => {
            onAddLesson(data);
            setIsLessonModalOpen(false);
          }}
          onCancel={() => setIsLessonModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Add Student"
      >
        <AddStudentForm
          availableStudents={availableStudents}
          onAddStudent={(studentId) => {
            onAddStudent(studentId);
            setIsStudentModalOpen(false);
          }}
          onCancel={() => setIsStudentModalOpen(false)}
        />
      </Modal>
    </div>
  );
}