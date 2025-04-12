import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '@/utils/api';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsResumeData: boolean;
  hasGeneratedContent: boolean;
  tailoredResumes: any[];
  logout: () => void;
  setUser: (user: User | null) => void;
  setNeedsResumeData: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  needsResumeData: false,
  hasGeneratedContent: false,
  tailoredResumes: [],
  logout: () => {},
  setUser: () => {},
  setNeedsResumeData: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsResumeData, setNeedsResumeData] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [tailoredResumes, setTailoredResumes] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setUser(data.user);
      setNeedsResumeData(data.needsResumeData);
      setHasGeneratedContent(data.hasGeneratedContent);
      setTailoredResumes(data.tailoredResumes || []);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      toast({
        title: 'Session expired',
        description: 'Please login again',
        variant: 'destructive',
      });
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for token changes (e.g., from Google login)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        fetchUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setNeedsResumeData(false);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    needsResumeData,
    hasGeneratedContent,
    tailoredResumes,
    logout: handleLogout,
    setUser,
    setNeedsResumeData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};