import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Training } from '../types/training';
import * as trainingService from '../services/trainingService';
import { useAuth } from './AuthContext';
import { useStudentAuth } from './StudentAuthContext';

interface TrainingContextType {
  trainings: Training[];
  loading: boolean;
  error: string | null;
  addTraining: (training: Omit<Training, 'id'>) => Promise<void>;
  updateTraining: (id: string, updatedTraining: Partial<Training>) => Promise<void>;
  getTraining: (id: string) => Promise<Training | null>;
  refreshTrainings: () => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated: isAdminAuthenticated, adminProfile } = useAuth();
  const { isAuthenticated: isStudentAuthenticated, student } = useStudentAuth();

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetch trainings - Auth state:', {
        isAdminAuthenticated,
        adminProfile,
        isStudentAuthenticated,
        student
      });
      
      let data: Training[] = [];
      
      if (isAdminAuthenticated && adminProfile) {
        console.log('Fetching trainings as admin');
        data = await trainingService.getTrainings();
        console.log('Admin trainings fetched:', data);
      } else if (isStudentAuthenticated && student) {
        console.log('Fetching trainings as student');
        data = await trainingService.getStudentTrainings(student.id);
        console.log('Student trainings fetched:', data);
      }
      
      setTrainings(data);
    } catch (err) {
      console.error('Error fetching trainings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trainings');
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('TrainingContext useEffect - Auth state changed:', {
      isAdminAuthenticated,
      adminProfile,
      isStudentAuthenticated,
      student
    });
    
    if (isAdminAuthenticated || (isStudentAuthenticated && student)) {
      fetchTrainings();
    } else {
      setTrainings([]);
      setLoading(false);
    }
  }, [isAdminAuthenticated, adminProfile, isStudentAuthenticated, student]);

  const addTraining = async (training: Omit<Training, 'id'>) => {
    try {
      await trainingService.createTraining(training);
      await fetchTrainings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add training');
      throw err;
    }
  };

  const updateTraining = async (id: string, updatedTraining: Partial<Training>) => {
    try {
      await trainingService.updateTraining(id, updatedTraining);
      await fetchTrainings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update training');
      throw err;
    }
  };

  const getTraining = async (id: string) => {
    try {
      const training = await trainingService.getTrainingById(id);
      return training;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch training');
      return null;
    }
  };

  return (
    <TrainingContext.Provider value={{
      trainings,
      loading,
      error,
      addTraining,
      updateTraining,
      getTraining,
      refreshTrainings: fetchTrainings
    }}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
}