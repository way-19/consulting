// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = () => {
      const savedUser = localStorage.getItem('consulting19_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Demo login - in production use real authentication
      let role = 'client';
      if (email === 'admin@consulting19.com') role = 'admin';
      if (email === 'consultant@consulting19.com') role = 'consultant';
      
      const userData = {
        id: Date.now().toString(),
        email,
        role,
        first_name: role === 'admin' ? 'System' : role === 'consultant' ? 'Demo' : 'Demo',
        last_name: role === 'admin' ? 'Administrator' : 'User'
      };
      
      setUser(userData);
      localStorage.setItem('consulting19_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('consulting19_user');
    return { success: true };
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};