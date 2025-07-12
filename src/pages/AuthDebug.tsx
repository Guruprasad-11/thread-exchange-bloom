import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { testSupabaseConnection, testAuthConnection, testUserExists } from '@/lib/test-connection';
import { supabase } from '@/integrations/supabase/client';

export function AuthDebug() {
  const { user, profile, session, loading } = useAuth();
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [authTest, setAuthTest] = useState<any>(null);
  const [userTest, setUserTest] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('john123@gmail.com');
  const [testLoading, setTestLoading] = useState(false);

  const runConnectionTest = async () => {
    setTestLoading(true);
    const result = await testSupabaseConnection();
    setConnectionTest(result);
    setTestLoading(false);
  };

  const runAuthTest = async () => {
    setTestLoading(true);
    const result = await testAuthConnection();
    setAuthTest(result);
    setTestLoading(false);
  };

  const runUserTest = async () => {
    setTestLoading(true);
    const result = await testUserExists(testEmail);
    setUserTest(result);
    setTestLoading(false);
  };

  const clearSession = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug Panel</CardTitle>
            <CardDescription>
              Debug information for authentication and profile loading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connection Tests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connection Tests</h3>
              <div className="flex items-center space-x-4">
                <Button onClick={runConnectionTest} disabled={testLoading}>
                  {testLoading ? 'Testing...' : 'Test Database Connection'}
                </Button>
                <Button onClick={runAuthTest} disabled={testLoading}>
                  {testLoading ? 'Testing...' : 'Test Auth Connection'}
                </Button>
              </div>
              
              {/* User Existence Test */}
              <div className="space-y-2">
                <h4 className="font-semibold">Test User Existence:</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="testEmail">Email to test:</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter email to test"
                    />
                  </div>
                  <Button onClick={runUserTest} disabled={testLoading}>
                    {testLoading ? 'Testing...' : 'Test User'}
                  </Button>
                </div>
              </div>
              
              {/* Connection Test Results */}
              {connectionTest && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Database Connection Test:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span>Status:</span>
                      <Badge variant={connectionTest.success ? 'default' : 'destructive'}>
                        {connectionTest.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    {connectionTest.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {connectionTest.error}
                      </div>
                    )}
                    {connectionTest.data && (
                      <div className="text-green-600">
                        <strong>Data:</strong> {JSON.stringify(connectionTest.data)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Auth Test Results */}
              {authTest && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Auth Connection Test:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span>Status:</span>
                      <Badge variant={authTest.success ? 'default' : 'destructive'}>
                        {authTest.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    {authTest.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {authTest.error}
                      </div>
                    )}
                    {authTest.session && (
                      <div className="text-green-600">
                        <strong>Session:</strong> Active
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Test Results */}
              {userTest && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">User Existence Test:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span>Status:</span>
                      <Badge variant={userTest.success ? 'default' : 'destructive'}>
                        {userTest.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>User Exists:</span>
                      <Badge variant={userTest.exists ? 'default' : 'secondary'}>
                        {userTest.exists ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    {userTest.message && (
                      <div className="text-green-600">
                        <strong>Message:</strong> {userTest.message}
                      </div>
                    )}
                    {userTest.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {userTest.error}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth State */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Authentication State</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Loading:</span>
                    <Badge variant={loading ? 'default' : 'secondary'}>
                      {loading ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">User:</span>
                    <Badge variant={user ? 'default' : 'secondary'}>
                      {user ? 'Authenticated' : 'Not Authenticated'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Profile:</span>
                    <Badge variant={profile ? 'default' : 'secondary'}>
                      {profile ? 'Loaded' : 'Not Loaded'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Session:</span>
                    <Badge variant={session ? 'default' : 'secondary'}>
                      {session ? 'Active' : 'None'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details */}
            {user && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">User Details</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                  <div><strong>Created At:</strong> {user.created_at}</div>
                  <div><strong>Last Sign In:</strong> {user.last_sign_in_at}</div>
                </div>
              </div>
            )}

            {/* Profile Details */}
            {profile && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Profile Details</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div><strong>ID:</strong> {profile.id}</div>
                  <div><strong>Username:</strong> {profile.username}</div>
                  <div><strong>Full Name:</strong> {profile.full_name || 'Not set'}</div>
                  <div><strong>Points:</strong> {profile.points}</div>
                  <div><strong>Location:</strong> {profile.location || 'Not set'}</div>
                  <div><strong>Created At:</strong> {profile.created_at}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex space-x-4">
                <Button onClick={clearSession} variant="outline">
                  Clear Session
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>

            {/* Console Instructions */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Debug Instructions</h3>
              <div className="bg-muted p-4 rounded-lg text-sm">
                <p>Open your browser's developer console to see detailed authentication logs.</p>
                <p>Look for messages starting with:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>"🔍 Testing Supabase connection..."</li>
                  <li>"✅ Supabase connection test successful"</li>
                  <li>"❌ Supabase connection test failed"</li>
                  <li>"Auth state changed:"</li>
                  <li>"Starting signup/signin process..."</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 