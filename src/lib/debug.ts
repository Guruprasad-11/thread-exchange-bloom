import { supabase } from '@/integrations/supabase/client';
import { testSupabaseConnection as testConnection, testAuthConnection as testAuth } from './test-connection';

export async function testSupabaseConnection() {
  return await testConnection();
}

export async function testSupabaseAuth() {
  return await testAuth();
}

export function logAuthState(user: any, profile: any, session: any) {
  console.log('🔍 Auth State:', {
    user: user ? { 
      id: user.id, 
      email: user.email, 
      email_confirmed: user.email_confirmed_at ? 'Yes' : 'No',
      created_at: user.created_at
    } : null,
    profile: profile ? { 
      id: profile.id, 
      username: profile.username,
      points: profile.points,
      created_at: profile.created_at
    } : null,
    session: session ? { 
      access_token: session.access_token ? 'present' : 'missing',
      expires_at: session.expires_at
    } : null,
  });
}

export function logError(context: string, error: any) {
  console.error(`❌ Error in ${context}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    fullError: error
  });
}

export function logSuccess(context: string, data?: any) {
  console.log(`✅ Success in ${context}:`, data);
} 