
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface InternalAuthContextType {
  isInternallyAuthenticated: boolean;
  verifyInternalPassword: (password: string) => Promise<boolean>;
  logout: () => void;
}

const InternalAuthContext = createContext<InternalAuthContextType | undefined>(undefined);

export const InternalAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInternallyAuthenticated, setIsInternallyAuthenticated] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is internally authenticated on mount
    const internalAuth = localStorage.getItem('internal_auth');
    if (internalAuth === 'true' && user) {
      setIsInternallyAuthenticated(true);
    } else {
      setIsInternallyAuthenticated(false);
    }
  }, [user]);

  const verifyInternalPassword = async (password: string): Promise<boolean> => {
    try {
      // Para simplicidade, vamos usar uma verificação básica
      // Em produção, você deveria usar bcrypt ou similar
      if (password === 'agenda123') {
        setIsInternallyAuthenticated(true);
        localStorage.setItem('internal_auth', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying internal password:', error);
      return false;
    }
  };

  const logout = () => {
    setIsInternallyAuthenticated(false);
    localStorage.removeItem('internal_auth');
  };

  const value = {
    isInternallyAuthenticated,
    verifyInternalPassword,
    logout
  };

  return (
    <InternalAuthContext.Provider value={value}>
      {children}
    </InternalAuthContext.Provider>
  );
};

export const useInternalAuth = () => {
  const context = useContext(InternalAuthContext);
  if (context === undefined) {
    throw new Error('useInternalAuth must be used within an InternalAuthProvider');
  }
  return context;
};
