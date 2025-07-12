
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { logAuthState, testSupabaseConnection } from '@/lib/debug';

type Profile = Tables<'profiles'>;

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const createMockUser = (email: string, username: string): User => ({
  id: `mock-${Date.now()}`,
  email: email,
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { username },
  aud: 'authenticated',
  role: 'authenticated',
} as User);

const createMockProfile = (userId: string, username: string): Profile => ({
  id: userId,
  username: username,
  full_name: username,
  avatar_url: null,
  bio: null,
  points: 100,
  location: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
} as Profile);

const createMockSession = (user: User): Session => ({
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600 * 1000,
  token_type: 'bearer',
  user: user,
} as Session);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test connection on mount
    testSupabaseConnection();
    
    // Check for existing mock session in localStorage
    const savedUser = localStorage.getItem('mockUser');
    const savedProfile = localStorage.getItem('mockProfile');
    
    if (savedUser && savedProfile) {
      try {
        const userData = JSON.parse(savedUser);
        const profileData = JSON.parse(savedProfile);
        const sessionData = createMockSession(userData);
        
        setUser(userData);
        setProfile(profileData);
        setSession(sessionData);
        console.log('✅ Mock session restored from localStorage');
      } catch (error) {
        console.error('❌ Error restoring mock session:', error);
        localStorage.removeItem('mockUser');
        localStorage.removeItem('mockProfile');
      }
    }
    
    setLoading(false);
  }, []);

  // Debug logging when auth state changes
  useEffect(() => {
    logAuthState(user, profile, session);
  }, [user, profile, session]);

  const signUp = async (email: string, password: string, username: string) => {
    console.log('🔍 Mock signup for:', email, username);
    
    // Create mock user and profile
    const mockUser = createMockUser(email, username);
    const mockProfile = createMockProfile(mockUser.id, username);
    const mockSession = createMockSession(mockUser);
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockProfile', JSON.stringify(mockProfile));
    
    // Set state
    setUser(mockUser);
    setProfile(mockProfile);
    setSession(mockSession);
    
    console.log('✅ Mock signup successful:', mockUser.id);
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔍 Mock signin for:', email);
    
    // Extract username from email or use a default
    const username = email.split('@')[0] || 'user';
    
    // Create mock user and profile
    const mockUser = createMockUser(email, username);
    const mockProfile = createMockProfile(mockUser.id, username);
    const mockSession = createMockSession(mockUser);
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockProfile', JSON.stringify(mockProfile));
    
    // Set state
    setUser(mockUser);
    setProfile(mockProfile);
    setSession(mockSession);
    
    console.log('✅ Mock signin successful:', mockUser.id);
  };

  const signOut = async () => {
    console.log('🔍 Mock signout');
    
    // Clear localStorage
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockProfile');
    
    // Clear state
    setUser(null);
    setProfile(null);
    setSession(null);
    
    console.log('✅ Mock signout successful');
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
