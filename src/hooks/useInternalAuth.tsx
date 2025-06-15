import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface InternalAuthContextType {
  isInternallyAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const InternalAuthContext = createContext<InternalAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'isInternallyAuthenticated';
const AUTH_TIMESTAMP_KEY = 'internalAuthTimestamp';
const AUTH_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const checkStoredAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    
    if (stored === 'true' && timestamp) {
      const lastAuthTime = parseInt(timestamp, 10);
      const now = Date.now();
      
      if (now - lastAuthTime < AUTH_EXPIRATION_TIME) {
        return true;
      }
      
      // Clear expired auth
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    }
    return false;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return false;
  }
};

export function InternalAuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isInternallyAuthenticated, setIsInternallyAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    if (user) {
      const isValid = checkStoredAuth();
      setIsInternallyAuthenticated(isValid);
    }
    setIsInitialized(true);
  }, [user]);

  // Reset internal auth when user changes
  useEffect(() => {
    if (!user) {
      setIsInternallyAuthenticated(false);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    }
  }, [user]);

  // Persist internal auth state
  useEffect(() => {
    if (!isInitialized) return;

    try {
      if (isInternallyAuthenticated) {
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [isInternallyAuthenticated, isInitialized]);

  const login = () => {
    try {
      setIsInternallyAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error during internal auth login:', error);
    }
  };

  const logout = () => {
    try {
      setIsInternallyAuthenticated(false);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error during internal auth logout:', error);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <InternalAuthContext.Provider value={{ isInternallyAuthenticated, login, logout }}>
      {children}
    </InternalAuthContext.Provider>
  );
}

export function useInternalAuth() {
  const context = useContext(InternalAuthContext);
  if (context === undefined) {
    throw new Error('useInternalAuth must be used within an InternalAuthProvider');
  }
  return context;
}
