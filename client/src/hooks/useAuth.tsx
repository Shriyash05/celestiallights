import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For demo purposes, we'll simulate authentication
      // In a real app, you'd call your authentication API
      const adminEmails = ['admin@celestiallights.com', 'info.celestiallight@gmail.com'];
      const isAdminUser = adminEmails.includes(email);
      
      if (email && password) {
        // Check admin status via API
        const { isAdmin: apiIsAdmin } = await apiRequest('/api/auth/check-admin', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
        
        setUser({ id: '1', email });
        setIsAdmin(apiIsAdmin || isAdminUser);
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        return { error: null };
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || 'Authentication failed',
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setIsAdmin(false);
    toast({
      title: "Goodbye!",
      description: "You have successfully signed out.",
    });
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};