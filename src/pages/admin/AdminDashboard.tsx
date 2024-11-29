import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TrainingCard } from '../../components/TrainingCard';
import { Modal } from '../../components/ui/Modal';
import { CreateTrainingForm } from '../../components/forms/CreateTrainingForm';
import { useAuth } from '../../contexts/AuthContext';
import { useTraining } from '../../contexts/TrainingContext';

export function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { trainings, addTraining, updateTraining } = useTraining();
  const { isAuthenticated, adminProfile } = useAuth();
  const navigate = useNavigate();

  const handleCreateTraining = (data: any) => {
    addTraining(data);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training Sessions</h2>
          {adminProfile && (
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {adminProfile.name}
            </p>
          )}
        </div>
        {isAuthenticated && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Training
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <TrainingCard
            key={training.id}
            {...training}
            onUpdateTraining={updateTraining}
          />
        ))}
        {trainings.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No training sessions available.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Training"
      >
        <CreateTrainingForm
          onSubmit={handleCreateTraining}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}