import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, UserCog, Users, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {location.pathname !== '/' && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </button>
        )}

        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('common.welcome', { name: 'UpSkillU' })}
          </h1>
          <p className="text-xl text-gray-600">
            {t('auth.chooseAccess')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            onClick={() => navigate('/admin/login')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500"
          >
            <div className="flex justify-center mb-4">
              <UserCog className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              {t('auth.adminAccess')}
            </h2>
            <p className="text-gray-600 text-center">
              {t('auth.manageTrainings')}
            </p>
            <div className="mt-6 flex justify-center">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                {t('auth.adminLogin')}
              </button>
            </div>
          </div>

          <div
            onClick={() => navigate('/student/login')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500"
          >
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              {t('auth.studentAccess')}
            </h2>
            <p className="text-gray-600 text-center">
              {t('auth.accessCourses')}
            </p>
            <div className="mt-6 flex justify-center">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                {t('auth.studentLogin')}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-600">
          <p>{t('auth.needHelp')}</p>
        </div>
      </div>
    </div>
  );
}