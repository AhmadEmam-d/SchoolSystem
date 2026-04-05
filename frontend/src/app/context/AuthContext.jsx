import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      
      if (token && userName) {
        setUser({
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole
        });
        setRole(userRole);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('AuthContext error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const role = 'teacher';

    localStorage.setItem('token', 'token');
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', 'Teacher');

    setUser({
      ...userData,
      role
    });

    setRole(role);
    setIsAuthenticated(true);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
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