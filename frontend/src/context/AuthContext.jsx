import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      const userId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail");
      const userRole = localStorage.getItem("userRole");

      if (token && userName) {
        setUser({
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole || "admin",
        });

        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth restore error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ emailOrPhone, password }) => {
    try {
      const response = await fetch(
        "https://localhost:5001/api/Admin/login", // change if different
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailOrPhone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) return data;

      const userData = data.data;

      localStorage.setItem("token", userData.token);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userRole", "admin");

      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: "admin",
      });

      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error("Login API error:", error);

      return {
        success: false,
        messages: {
          EN: "Server connection failed",
        },
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};