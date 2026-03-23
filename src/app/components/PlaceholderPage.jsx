import React from 'react';
import { useLocation } from 'react-router';

export function PlaceholderPage({ title, role } = {}) {
  const location = useLocation();
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'purple';
      case 'teacher': return 'blue';
      case 'student': return 'green';
      case 'parent': return 'orange';
      default: return 'gray';
    }
  };
  
  const color = getRoleColor(role);
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      {title && (
        <h1 className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400 mb-4`}>{title}</h1>
      )}
      <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
      <p className="text-muted-foreground max-w-sm">
        This page is currently under construction. Check back soon!
      </p>
    </div>
  );
}