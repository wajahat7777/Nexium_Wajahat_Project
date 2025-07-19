import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signout } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await getCurrentUser();
      setUser(response.user);
      setProfile(response.profile);
      setError(null);
    } catch (error) {
      console.error('Auth check error:', error);
      setError('Authentication failed');
      localStorage.removeItem('authToken');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, profileData) => {
    setUser(userData);
    setProfile(profileData);
    setError(null);
  };

  const logout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
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