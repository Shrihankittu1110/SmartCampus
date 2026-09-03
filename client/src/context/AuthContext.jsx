import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('cf_access_token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('cf_user', JSON.stringify(res.data));
          }
        } catch (err) {
          // Handled by Axios interceptor if 401
          console.warn('Session verification failed:', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      const { user: userData, accessToken, refreshToken } = res.data;
      setUser(userData);
      localStorage.setItem('cf_user', JSON.stringify(userData));
      localStorage.setItem('cf_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('cf_refresh_token', refreshToken);
      }
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res.success) {
      const { user: userData, accessToken, refreshToken } = res.data;
      setUser(userData);
      localStorage.setItem('cf_user', JSON.stringify(userData));
      localStorage.setItem('cf_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('cf_refresh_token', refreshToken);
      }
      return userData;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local cleanup
    } finally {
      setUser(null);
      localStorage.removeItem('cf_user');
      localStorage.removeItem('cf_access_token');
      localStorage.removeItem('cf_refresh_token');
      window.location.href = '/login';
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('cf_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
