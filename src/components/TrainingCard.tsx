import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, BookOpen } from 'lucide-react';
import { Training } from '../types/training';
import { Badge } from './ui/Badge';

interface TrainingCardProps extends Training {
  onUpdateTraining: (trainingId: string, updatedTraining: Training) => void;
}

export function TrainingCard({
  id,
  title,
  description,
  startDate,
  duration,
  enrolledStudents,
  lessons,
  onUpdateTraining
}: TrainingCardProps) {
  const navigate = useNavigate();
  const startDateObj = new Date(startDate);
  const isUpcoming = startDateObj > new Date();
  const isInProgress = startDateObj <= new Date() && lessons.length > 0;

  const getStatusBadge = () => {
    if (isUpcoming) return <Badge variant="warning">Upcoming</Badge>;
    if (isInProgress) return <Badge variant="success">In Progress</Badge>;
    return <Badge variant="default">Completed</Badge>;
  };

  const handleClick = () => {
    navigate(`/training/${id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="text-sm">{new Date(startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="text-sm">{duration}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="text-sm">{lessons.length} lessons</span>
          </div>
        </div>

        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-500">
            <Users className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="text-sm">
              {enrolledStudents.length} students enrolled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}