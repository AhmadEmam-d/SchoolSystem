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
        const userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('userId');

        if (token && userRole) {
          const normalizedRole = userRole.toLowerCase();
          const tId = localStorage.getItem('teacherId');

          setRole(normalizedRole);
          setUser({
            id: localStorage.getItem('userId'),
            teacherId: tId,
            name: localStorage.getItem('userName'),
            role: normalizedRole,
            email: localStorage.getItem('userEmail'),
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

    localStorage.setItem('token', userData.token); 
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userName', userData.name || userData.fullName);
    localStorage.setItem('userId', userData.id || userData.userId);
    localStorage.setItem('teacherId', userData.teacherId); 

    setRole(userRole);
    setUser({
      id: userData.id || userData.userId,
      teacherId: userData.teacherId, 
      name: userData.name || userData.fullName,
      role: userRole,
      email: userData.email,
    });
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