import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { StorageService } from '@/services/storage';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loginAsDemoAdmin: () => void;
  loginAsDemoCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial user session
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email || '');
        } else {
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setIsLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline / Demo mode
      const savedUser = StorageService.getCurrentUser();
      setUser(savedUser);
      setIsLoading(false);
    }
  }, []);

  const fetchSupabaseProfile = async (userId: string, email: string) => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setUser({
          id: data.id,
          email: data.email || email,
          fullName: data.full_name || 'Client',
          phone: data.phone,
          role: data.role as UserRole,
          createdAt: data.created_at,
        });
      } else {
        // Fallback profile
        setUser({
          id: userId,
          email: email,
          fullName: email.split('@')[0],
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('Error fetching Supabase profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'Password123!',
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } else {
        // Demo Mode login check
        const users = StorageService.getUsers();
        const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (matched) {
          setUser(matched);
          StorageService.setCurrentUser(matched);
          return { success: true };
        } else {
          // Allow automatic login for new demo emails
          const newUser: UserProfile = {
            id: `usr-${Date.now()}`,
            email,
            fullName: email.split('@')[0],
            role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUser(newUser);
          StorageService.setCurrentUser(newUser);
          return { success: true };
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion.';
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || 'Password123!',
          options: {
            data: { full_name: name, phone },
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              email,
              full_name: name,
              phone,
              role: 'customer',
            },
          ]);
        }
        return { success: true };
      } else {
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          fullName: name,
          phone,
          role: 'customer',
          createdAt: new Date().toISOString(),
        };
        setUser(newUser);
        StorageService.setCurrentUser(newUser);
        return { success: true };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création du compte.';
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    StorageService.setCurrentUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    if (!isSupabaseConfigured) {
      StorageService.setCurrentUser(updated);
    } else if (supabase) {
      await supabase.from('profiles').update({
        full_name: updated.fullName,
        phone: updated.phone,
      }).eq('id', user.id);
    }
  };

  const loginAsDemoAdmin = () => {
    const adminUser = StorageService.getUsers().find(u => u.role === 'admin') || {
      id: 'usr-admin-1',
      email: 'admin@glowbeauty.dz',
      fullName: 'Amira Benali (Gérante)',
      role: 'admin',
      createdAt: '2024-01-01T08:00:00Z',
    };
    setUser(adminUser);
    StorageService.setCurrentUser(adminUser);
  };

  const loginAsDemoCustomer = () => {
    const customerUser = StorageService.getUsers().find(u => u.role === 'customer') || {
      id: 'usr-customer-1',
      email: 'sophia.client@gmail.com',
      fullName: 'Sophia Meziane',
      phone: '0661987654',
      role: 'customer',
      createdAt: '2024-01-10T14:30:00Z',
    };
    setUser(customerUser);
    StorageService.setCurrentUser(customerUser);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
      }}
    >
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
