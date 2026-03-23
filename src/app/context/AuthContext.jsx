import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CURRENT_USER } from '../lib/mockData';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = useCallback((selectedRole) => {
    const mockUser = { ...CURRENT_USER, role: selectedRole, name: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User` };
    setUser(mockUser);
    setRole(selectedRole);
    try {
      if (typeof window !== 'undefined') {
        // Force update localStorage
        localStorage.setItem('school_role', selectedRole);
      }
    } catch (error) {
      console.error('Error saving role:', error);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('school_role');
      }
    } catch (error) {
      console.error('Error removing role:', error);
    }
  }, []);

  useEffect(() => {
    // Check local storage or similar for persistence
    try {
      if (typeof window !== 'undefined') {
        const storedRole = localStorage.getItem('school_role');
        if (storedRole) {
          login(storedRole);
        }
      }
    } catch (error) {
      console.error('Error loading role:', error);
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
