import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { StudentLoginPage } from './pages/auth/StudentLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { TrainingDetails } from './pages/TrainingDetails';
import { StudentTrainingDetails } from './pages/StudentTrainingDetails';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { StudentAuthProvider } from './contexts/StudentAuthContext';
import { TrainingProvider } from './contexts/TrainingContext';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <StudentAuthProvider>
        <TrainingProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/student/login" element={<StudentLoginPage />} />
                  <Route 
                    path="/admin" 
                    element={
                      <PrivateRoute>
                        <AdminDashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/student/training/:id" element={<StudentTrainingDetails />} />
                  <Route 
                    path="/training/:id" 
                    element={
                      <PrivateRoute>
                        <TrainingDetails />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </TrainingProvider>
      </StudentAuthProvider>
    </AuthProvider>
  );
}