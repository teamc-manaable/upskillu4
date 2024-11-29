import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Training } from '../../types/training';

interface TrainingInfoProps {
  training: Training;
}

export function TrainingInfo({ training }: TrainingInfoProps) {
  return (
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
        <Users className="h-5 w-5 mr-2 text-indigo-500" />
        <span>{training.enrolledStudents.length} students enrolled</span>
      </div>
    </div>
  );
}