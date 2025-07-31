import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, AuthUser } from '@/lib/supabaseClient';

interface AuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = session.user;
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        });
        
        // Check if user is admin
        const adminEmails = [
          'admin@celestiallights.com',
          'info.celestiallight@gmail.com',
          'shrimhatre00@gmail.com' // Added user's admin email
        ];
        setIsAdmin(adminEmails.includes(user.email || ''));
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = session.user;
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          
          // Check if user is admin
          const adminEmails = [
            'admin@celestiallights.com',
            'info.celestiallight@gmail.com',
            'shrimhatre00@gmail.com' // Added user's admin email
          ];
          setIsAdmin(adminEmails.includes(user.email || ''));
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const user = data.user;
      setUser({
        id: data.user.id,
        email: data.user.email || '',
      });

      // Check if user is admin
      const adminEmails = [
        'admin@celestiallights.com',
        'info.celestiallight@gmail.com',
        'shrimhatre00@gmail.com' // Added user's admin email
      ];
      setIsAdmin(adminEmails.includes(user.email || ''));

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || 'Invalid credentials',
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      setIsAdmin(false);
      toast({
        title: "Goodbye!",
        description: "You have successfully signed out.",
      });
    }
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