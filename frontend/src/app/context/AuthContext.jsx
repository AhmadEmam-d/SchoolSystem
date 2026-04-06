import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');

        if (token && userRole) {
          const normalizedRole = userRole.toLowerCase();

          setRole(normalizedRole);
          setUser({
            name: userName,
            role: normalizedRole,
            id: localStorage.getItem('userId')
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('AuthContext error:', error);
      } finally {
        setLoading(false);
      }
    };
    restoreAuth();
  }, []);

  const login = (userData) => {
    const userRole = (userData.role || 'teacher').toLowerCase();

    localStorage.setItem('token', userData.token || 'mock-token');
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userName', userData.fullName || 'User');
    localStorage.setItem('userId', userData.id || '1');

    setRole(userRole);
    setUser({ ...userData, role: userRole });
    setIsAuthenticated(true);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};