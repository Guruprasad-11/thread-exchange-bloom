import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('URL:', supabase.supabaseUrl);
    console.log('Key length:', supabase.supabaseKey?.length || 0);
    
    // Test basic connection by trying to fetch a single row
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('✅ Supabase connection test successful');
    console.log('Response:', data);
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

export async function testAuthConnection() {
  try {
    console.log('🔍 Testing Supabase Auth connection...');
    
    // Test auth by getting the current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase Auth test failed:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('✅ Supabase Auth test successful');
    console.log('Session:', data.session ? 'Active' : 'None');
    
    return {
      success: true,
      session: data.session
    };
  } catch (error) {
    console.error('❌ Supabase Auth test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

export async function testUserExists(email: string) {
  try {
    console.log('🔍 Testing if user exists:', email);
    
    // Try to sign in with the email to see if it exists
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'test123' // We don't care about the password, just want to see if user exists
    });
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        console.log('✅ User exists but password is wrong (expected)');
        return {
          success: true,
          exists: true,
          message: 'User exists in database'
        };
      } else if (error.message.includes('Email not confirmed')) {
        console.log('✅ User exists but email not confirmed');
        return {
          success: true,
          exists: true,
          message: 'User exists but email not confirmed'
        };
      } else {
        console.log('❌ User might not exist or other error:', error.message);
        return {
          success: false,
          exists: false,
          error: error.message
        };
      }
    }
    
    console.log('✅ User exists and can sign in');
    return {
      success: true,
      exists: true,
      message: 'User exists and can sign in'
    };
  } catch (error) {
    console.error('❌ Error testing user existence:', error);
    return {
      success: false,
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 