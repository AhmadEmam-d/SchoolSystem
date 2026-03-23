import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useTranslation } from 'react-i18next';

export function DashboardLayout() {
  const { user, isAuthenticated } = useAuth();
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Set document direction
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

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