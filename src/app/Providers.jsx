import React from 'react';
import { Outlet } from 'react-router';
import { MockDataProvider } from '../context/MockDataContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

function ToasterWrapper() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return <Toaster position={isRTL ? 'top-left' : 'top-right'} />;
}

export function Providers() {
  return (
    <MockDataProvider>
      <AttendanceProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SidebarProvider>
                <Outlet />
                <ToasterWrapper />
              </SidebarProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AttendanceProvider>
    </MockDataProvider>
  );
}
