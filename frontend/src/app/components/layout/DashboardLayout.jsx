import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useTranslation } from 'react-i18next';

export function DashboardLayout() {
  const { user, isAuthenticated, loading } = useAuth();
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  console.log('DashboardLayout - isAuthenticated:', isAuthenticated);
  console.log('DashboardLayout - loading:', loading);
  console.log('DashboardLayout - user:', user);

  useEffect(() => {
    // انتظري حتى ينتهي التحميل
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to /login');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex bg-background min-h-screen transition-colors" dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen 
            ? isRTL 
              ? 'lg:mr-64' 
              : 'lg:ml-64'
            : ''
        }`}
      >
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}