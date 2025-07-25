// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: decodedToken.id,
            username: decodedToken.username, // Assuming these exist in JWT payload
            email: decodedToken.email,
            role: decodedToken.role,
          });
        } catch (error) {
          console.error("Error decoding token or loading user:", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginUser(credentials);
      const { user: userData, token: newToken } = response;

      setUser(userData);
      setToken(newToken);
      localStorage.setItem('token', newToken);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData);
      const { user: newUser, token: newToken } = response;

      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('token', newToken);

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Registration failed:", error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const authContextValue = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};