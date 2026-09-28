import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services';

const AuthContext = createContext(null);

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

  // Validate token and synchronize latest profile on startup
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    authApi.getMe()
      .then((res) => {
        if (isMounted && res?.data) {
          setUser(res.data);
        }
      })
      .catch((err) => {
        // If token is expired or invalid (401), clean up
        if (err.status === 401) {
          if (isMounted) {
            setUser(null);
            setToken(null);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.login({ email, password });
      if (!res.success) {
        throw new Error(res.message || 'Failed to sign in. Please verify your credentials.');
      }

      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true, data: res.data };
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
      const res = await authApi.register({ name, email, password });
      if (!res.success) {
        throw new Error(res.message || 'Registration failed. Please try again.');
      }

      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true, data: res.data };
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
      const payload = {
        email: googlePayload.email || 'alex.google@vanta.com',
        name: googlePayload.name || 'Alex Vanta User',
        avatar: googlePayload.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        googleId: googlePayload.googleId || `g_${Date.now()}`,
      };

      const res = await authApi.googleLogin(payload);
      if (!res.success) {
        throw new Error(res.message || 'Google authentication failed.');
      }

      setUser(res.data.user);
      setToken(res.data.token);
      return { success: true, data: res.data };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update Profile Details
   */
  const updateProfile = async (profileData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.updateProfile(profileData);
      if (!res.success) {
        throw new Error(res.message || 'Could not update profile details.');
      }

      setUser((prev) => ({ ...prev, ...res.data }));
      return { success: true, data: res.data };
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
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vanta_user');
    localStorage.removeItem('vanta_token');
  }, []);

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
        updateProfile,
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
