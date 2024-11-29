import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TrainingCard } from './TrainingCard';
import { Modal } from './ui/Modal';
import { CreateTrainingForm } from './forms/CreateTrainingForm';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from './forms/LoginForm';
import { useTraining } from '../contexts/TrainingContext';
import { Training } from '../types/training';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { trainings, addTraining, updateTraining } = useTraining();
  const { isAuthenticated, login } = useAuth();
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleCreateTraining = (data: any) => {
    const newTraining: Training = {
      id: String(trainings.length + 1),
      ...data,
      enrolledStudents: [],
      lessons: []
    };
    addTraining(newTraining);
    setIsModalOpen(false);
  };

  const handleUpdateTraining = (trainingId: string, updatedTraining: Training) => {
    updateTraining(trainingId, updatedTraining);
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleLogin = (data: { email: string; password: string }) => {
    const success = login(data.email, data.password);
    if (success) {
      setIsLoginModalOpen(false);
      setIsLoginPromptOpen(false);
      setIsModalOpen(true);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Training Sessions</h2>
        <button 
          onClick={handleCreateClick}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Training
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <TrainingCard
            key={training.id}
            {...training}
            onUpdateTraining={handleUpdateTraining}
          />
        ))}
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

      <Modal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
        title="Sign In Required"
      >
        <div className="p-4 text-center">
          <p className="text-gray-700 mb-4">Please sign in to create a new training session.</p>
          <button
            onClick={() => {
              setIsLoginPromptOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Sign In
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In"
      >
        <LoginForm
          onSubmit={handleLogin}
          onCancel={() => setIsLoginModalOpen(false)}
        />
      </Modal>
    </div>
  );
}