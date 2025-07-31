import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'consultant' | 'client';
  first_name?: string;
  last_name?: string;
  country_id?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, role: 'admin' | 'consultant' | 'client', userData?: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isConsultant: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('consulting19-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('consulting19-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual Supabase auth later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual auth
      const mockUser: User = {
        id: '1',
        email,
        role: email.includes('admin') ? 'admin' : email.includes('consultant') ? 'consultant' : 'client',
        first_name: 'John',
        last_name: 'Doe'
      };

      setUser(mockUser);
      localStorage.setItem('consulting19-user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    role: 'admin' | 'consultant' | 'client',
    userData?: Partial<User>
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual Supabase auth later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        role,
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        country_id: userData?.country_id
      };

      setUser(newUser);
      localStorage.setItem('consulting19-user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('consulting19-user');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isConsultant: user?.role === 'consultant',
    isClient: user?.role === 'client'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};