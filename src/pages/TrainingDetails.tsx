import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus, Video } from 'lucide-react';
import { Training } from '../types/training';
import { TrainingInfo } from '../components/training/TrainingInfo';
import { TrainingLessons } from '../components/training/TrainingLessons';
import { TrainingStudents } from '../components/training/TrainingStudents';
import { useAuth } from '../contexts/AuthContext';
import { useTraining } from '../contexts/TrainingContext';
import { Modal } from '../components/ui/Modal';
import { CreateLessonForm } from '../components/forms/CreateLessonForm';
import { AddStudentForm } from '../components/AddStudentForm';
import { AddVideoForm } from '../components/forms/AddVideoForm';
import * as lessonService from '../services/lessonService';
import * as studentService from '../services/studentService';

export function TrainingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, adminProfile } = useAuth();
  const { getTraining, updateTraining } = useTraining();
  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);

  const isAdmin = isAuthenticated && adminProfile;

  useEffect(() => {
    async function loadTraining() {
      try {
        setIsLoading(true);
        setError(null);
        if (id) {
          const foundTraining = await getTraining(id);
          setTraining(foundTraining);
          const students = await studentService.getAvailableStudents(id);
          setAvailableStudents(students);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load training');
        console.error('Error loading training:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTraining();
  }, [id, getTraining]);

  const handleAddLesson = async (data: any) => {
    try {
      if (!id) return;
      
      const newLesson = await lessonService.createLesson(id, {
        ...data,
        completionThreshold: data.completionThreshold || 80
      });

      const updatedTraining = {
        ...training!,
        lessons: [...training!.lessons, newLesson]
      };

      setTraining(updatedTraining);
      setIsLessonModalOpen(false);
    } catch (err) {
      console.error('Error adding lesson:', err);
      setError('Failed to add lesson. Please try again.');
    }
  };

  const handleAddVideo = async (data: any) => {
    try {
      if (!id) return;

      const newLesson = await lessonService.createLesson(id, {
        title: data.videoTitle,
        date: new Date().toISOString().split('T')[0],
        startTime: '00:00',
        duration: '1 hour',
        completionThreshold: 80,
        videoUrl: data.videoUrl,
        videoProvider: data.videoProvider,
        videoTitle: data.videoTitle
      });

      const updatedTraining = {
        ...training!,
        lessons: [...training!.lessons, newLesson]
      };

      setTraining(updatedTraining);
      setIsVideoModalOpen(false);
    } catch (err) {
      console.error('Error adding video:', err);
      setError('Failed to add video. Please try again.');
    }
  };

  const handleAddStudent = async (studentId: string) => {
    try {
      if (!id || !training) return;

      const enrolledStudent = await studentService.enrollStudent(id, studentId);
      
      const updatedTraining = {
        ...training,
        enrolledStudents: [...training.enrolledStudents, enrolledStudent]
      };

      setTraining(updatedTraining);
      setIsStudentModalOpen(false);

      // Refresh available students list
      const students = await studentService.getAvailableStudents(id);
      setAvailableStudents(students);
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student. Please try again.');
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      if (!id || !training) return;

      await studentService.removeStudent(id, studentId);

      const updatedTraining = {
        ...training,
        enrolledStudents: training.enrolledStudents.filter(s => s.id !== studentId)
      };

      setTraining(updatedTraining);

      // Refresh available students list
      const students = await studentService.getAvailableStudents(id);
      setAvailableStudents(students);
    } catch (err) {
      console.error('Error removing student:', err);
      setError('Failed to remove student. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-gray-600">Loading training details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700">Training not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
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
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Video className="h-5 w-5 mr-2" />
                Add Video
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
      </div>

      <TrainingInfo training={training} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TrainingLessons
          lessons={training.lessons}
          enrolledStudents={training.enrolledStudents}
          onUpdateAttendance={() => {}}
          onAddLesson={handleAddLesson}
          isAdmin={isAdmin}
        />
        <TrainingStudents
          students={training.enrolledStudents}
          onRemoveStudent={handleRemoveStudent}
          isAdmin={isAdmin}
          availableStudents={availableStudents}
          onAddStudent={handleAddStudent}
        />
      </div>

      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title="Add New Lesson"
      >
        <CreateLessonForm
          lessonNumber={training.lessons.length + 1}
          onSubmit={handleAddLesson}
          onCancel={() => setIsLessonModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="Add Video Content"
      >
        <AddVideoForm
          onSubmit={handleAddVideo}
          onCancel={() => setIsVideoModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Add Student"
      >
        <AddStudentForm
          availableStudents={availableStudents}
          onAddStudent={handleAddStudent}
          onCancel={() => setIsStudentModalOpen(false)}
        />
      </Modal>
    </div>
  );
}