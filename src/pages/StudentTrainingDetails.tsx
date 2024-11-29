import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, BookOpen, Video } from 'lucide-react';
import { useTraining } from '../contexts/TrainingContext';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { Training } from '../types/training';
import { VideoPlayer } from '../components/VideoPlayer';
import { ZoomMeetingButton } from '../components/ZoomMeetingButton';

export function StudentTrainingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTraining } = useTraining();
  const { student } = useStudentAuth();
  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoLesson, setSelectedVideoLesson] = useState<string | null>(null);

  useEffect(() => {
    async function loadTraining() {
      try {
        setIsLoading(true);
        setError(null);
        if (id) {
          const foundTraining = await getTraining(id);
          setTraining(foundTraining);
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-gray-600">Loading training details...</p>
        </div>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error || 'Training not found'}</p>
        </div>
      </div>
    );
  }

  // Check if student is enrolled
  const isEnrolled = training.enrolledStudents?.some(
    enrolled => enrolled.id === student?.id
  );

  if (!isEnrolled) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-700">You are not enrolled in this training.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/student')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{training.title}</h1>
        <p className="mt-2 text-gray-600">{training.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
          <span>Starts {new Date(training.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-indigo-500" />
          <span>{training.duration}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
          <span>{training.lessons.length} lessons</span>
        </div>
      </div>

      {selectedVideoLesson && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Video</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            {training.lessons.map(lesson => {
              if (lesson.id === selectedVideoLesson && lesson.videoUrl && lesson.videoProvider) {
                return (
                  <VideoPlayer
                    key={lesson.id}
                    lessonId={lesson.id}
                    videoUrl={lesson.videoUrl}
                    videoProvider={lesson.videoProvider}
                    onComplete={() => setSelectedVideoLesson(null)}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lessons</h2>
        <div className="space-y-4">
          {training.lessons.map((lesson, index) => {
            const studentAttendance = lesson.attendance?.studentAttendance.find(
              record => record.studentId === student?.id
            );

            return (
              <div
                key={lesson.id}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Lesson #{index + 1}: {lesson.title}
                    </h4>
                  </div>
                  {studentAttendance && (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      studentAttendance.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {studentAttendance.status}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">
                      {new Date(lesson.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">
                      {lesson.startTime} ({lesson.duration})
                    </span>
                  </div>
                </div>

                {studentAttendance && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Your Attendance
                    </h5>
                    <div className="space-y-1">
                      {studentAttendance.entries.map((entry, entryIndex) => (
                        <div key={entryIndex} className="text-sm text-gray-600">
                          Session {entryIndex + 1}: {entry.joinTime} - {entry.leaveTime}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center space-x-4">
                  {lesson.zoomLink && (
                    <ZoomMeetingButton
                      lessonId={lesson.id}
                      isDisabled={studentAttendance?.status === 'Completed'}
                    />
                  )}
                  
                  {lesson.videoUrl && (
                    <button
                      onClick={() => setSelectedVideoLesson(lesson.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={studentAttendance?.status === 'Completed'}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      Watch Video
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}