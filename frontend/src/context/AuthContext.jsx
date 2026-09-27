import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:4000/api/v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('vanta_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('vanta_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('vanta_token', token);
    } else {
      localStorage.removeItem('vanta_token');
    }
  }, [token]);

  // Sync user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('vanta_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vanta_user');
    }
  }, [user]);

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to sign in. Please verify your credentials.');
      }

      setUser(data.data.user);
      setToken(data.data.token);
      return { success: true, data: data.data };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new customer account
   */
  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setUser(data.data.user);
      setToken(data.data.token);
      return { success: true, data: data.data };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google OAuth Login / Register
   */
  const googleLogin = async (googlePayload = {}) => {
    setLoading(true);
    setAuthError(null);
    try {
      // If mock/interactive without external popup:
      const payload = {
        email: googlePayload.email || 'alex.google@vanta.com',
        name: googlePayload.name || 'Alex Vanta User',
        avatar: googlePayload.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        googleId: googlePayload.googleId || `g_${Date.now()}`,
      };

      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Google authentication failed.');
      }

      setUser(data.data.user);
      setToken(data.data.token);
      return { success: true, data: data.data };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vanta_user');
    localStorage.removeItem('vanta_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        authError,
        setAuthError,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
