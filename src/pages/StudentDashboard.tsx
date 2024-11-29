import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { useTraining } from '../contexts/TrainingContext';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const { trainings } = useTraining();

  // Filter trainings where the student is enrolled
  const enrolledTrainings = trainings.filter(training =>
    training.enrolledStudents.some(enrolled => enrolled.id === student?.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Training Sessions</h2>
        <p className="mt-2 text-gray-600">Welcome back, {student?.name}</p>
      </div>

      {enrolledTrainings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledTrainings.map((training) => (
            <div
              key={training.id}
              onClick={() => navigate(`/student/training/${training.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer p-6"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {training.title}
                </h3>
                <p className="text-gray-600">{training.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Start Date:</span>
                  <br />
                  {new Date(training.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Duration:</span>
                  <br />
                  {training.duration}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-indigo-600">
                  {training.lessons.length} lessons
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You are not enrolled in any training sessions yet.</p>
        </div>
      )}
    </div>
  );
}