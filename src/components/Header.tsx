import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated: isAdminAuthenticated, adminProfile, logout: adminLogout } = useAuth();
  const { isAuthenticated: isStudentAuthenticated, student, logout: studentLogout } = useStudentAuth();

  const handleSignOut = async () => {
    try {
      if (isAdminAuthenticated) {
        await adminLogout();
      } else if (isStudentAuthenticated) {
        await studentLogout();
      }
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="h-8 w-8 text-white" />
            <span className="ml-2 text-white text-xl font-bold">UpSkillU</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {isAdminAuthenticated && adminProfile ? (
              <>
                <span className="text-white">{t('common.welcome', { name: adminProfile.name })}</span>
                <button 
                  className="text-white hover:text-indigo-100"
                  onClick={handleSignOut}
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : isStudentAuthenticated && student ? (
              <>
                <span className="text-white">
                  {t('common.welcome', { name: student.user_metadata?.full_name || student.email })}
                </span>
                <button 
                  className="text-white hover:text-indigo-100"
                  onClick={handleSignOut}
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}