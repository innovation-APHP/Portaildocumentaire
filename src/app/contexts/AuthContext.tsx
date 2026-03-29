import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wikijsService } from '../services/wikijsService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Essayer d'abord avec Wiki.js
    try {
      const result = await wikijsService.login(email, password);
      
      if (result.success && result.jwt) {
        // Stocker le token Wiki.js
        localStorage.setItem('wikijs_token', result.jwt);
        
        const mockUser: User = {
          id: '1',
          email: email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          role: 'user',
        };

        setUser(mockUser);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        return;
      }
    } catch (error) {
      console.log('Wiki.js non disponible, utilisation de l\'authentification locale');
    }

    // Fallback vers authentification locale
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password.length < 6) {
      throw new Error('Mot de passe invalide');
    }

    const mockUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      role: email.includes('admin') ? 'admin' : 'user',
    };

    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('wikijs_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
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