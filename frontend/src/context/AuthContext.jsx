import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://localhost:7179/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");
      const userRole = localStorage.getItem("userRole");

      if (token && userId) {
        // Set default axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
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

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
        email: email,
        password: password,
      });

      if (!response.data.success) {
        return {
          success: false,
          message: response.data.messages?.EN || "Login failed",
        };
      }

      const userData = response.data.data;

      // Store token and user data
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userId", userData.id || userData.oid);
      localStorage.setItem("userName", userData.fullName || userData.name);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userRole", userData.role || "admin");

      // Set default axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;

      setUser({
        id: userData.id || userData.oid,
        name: userData.fullName || userData.name,
        email: userData.email,
        role: userData.role || "admin",
      });

      setIsAuthenticated(true);

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      console.error("Login API error:", error);

      let errorMessage = "Server connection failed";
      if (error.response?.data?.messages?.EN) {
        errorMessage = error.response.data.messages.EN;
      } else if (error.response?.data?.errors?.length) {
        errorMessage = error.response.data.errors[0];
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    // Clear axios header
    delete axios.defaults.headers.common["Authorization"];
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