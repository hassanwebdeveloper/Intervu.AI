import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Mock DynamoDB interface
const mockDynamoDB = {
  users: JSON.parse(localStorage.getItem('users') || '[]'),
  saveUser: (user: User) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },
  getUser: (email: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((u: User) => u.email === email);
  }
};

type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, company?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would validate credentials against DynamoDB
      const user = mockDynamoDB.getUser(email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // In a real app, we would verify the password here
      // For demo, we're just checking if the user exists

      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, company?: string) => {
    try {
      setLoading(true);
      // Check if user already exists
      const existingUser = mockDynamoDB.getUser(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        company
      };

      // Save user to "DynamoDB" (localStorage in our case)
      mockDynamoDB.saveUser(newUser);
      
      // Log user in
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Signup failed: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
