import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  RefreshCw, 
  CheckCircle, 
  Plus, 
  Coins, 
  Settings, 
  LogOut,
  TrendingUp,
  Activity,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Test Supabase connection
  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('❌ Supabase connection failed:', error);
        alert('Connection failed: ' + error.message);
      } else {
        console.log('✅ Supabase connection successful:', data);
        alert('Connection successful! Found ' + data.length + ' profiles');
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
      alert('Test failed: ' + error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Mock data for now
  const userItems: any[] = [];
  const pendingItems = userItems.filter(item => item.status === 'pending');
  const approvedItems = userItems.filter(item => item.status === 'approved');
  const totalPoints = profile?.points || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border/50 min-h-screen p-6">
          <div className="space-y-6">
            {/* User Profile */}
            <div className="text-center pb-6 border-b border-border/50">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{profile?.full_name || profile?.username}</h3>
              <p className="text-sm text-muted-foreground">@{profile?.username}</p>
              {profile?.location && (
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {profile.location}
                </div>
              )}
            </div>

            {/* Points Balance */}
            <Card className="card-apple">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Points Balance</span>
                </div>
                <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                <p className="text-xs text-muted-foreground">Available for swaps</p>
              </CardContent>
            </Card>

            {/* Navigation */}
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground"
              >
                <Activity className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/add-item"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Plus className="h-4 w-4" />
                List an Item
              </Link>
              <Link
                to="/browse"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Package className="h-4 w-4" />
                Browse Items
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>

            {/* Sign Out */}
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening with your items.</p>
              
              {/* Test Connection Button */}
              <Button 
                onClick={testConnection} 
                variant="outline" 
                className="mt-4"
              >
                Test Supabase Connection
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="card-grid-4 mb-8">
              <Card className="card-apple">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold">{userItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-apple">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-yellow-100">
                      <RefreshCw className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                      <p className="text-2xl font-bold">{pendingItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-apple">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Live Items</p>
                      <p className="text-2xl font-bold">{approvedItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-apple">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-100">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Points Earned</p>
                      <p className="text-2xl font-bold">{totalPoints}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="items">My Items</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Actions */}
                <Card className="card-apple">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with these common tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Button asChild className="btn-primary">
                        <Link to="/add-item">
                          <Plus className="h-4 w-4 mr-2" />
                          List New Item
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="btn-secondary">
                        <Link to="/browse">
                          <Package className="h-4 w-4 mr-2" />
                          Browse Items
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="btn-secondary">
                        <Link to="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Items */}
                <Card className="card-apple">
                  <CardHeader>
                    <CardTitle>Recent Items</CardTitle>
                    <CardDescription>Your latest listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No items listed yet</p>
                      <Button asChild className="btn-primary">
                        <Link to="/add-item">List Your First Item</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-6">
                <Card className="card-apple">
                  <CardHeader>
                    <CardTitle>My Items</CardTitle>
                    <CardDescription>Manage your listed items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No items listed yet</p>
                      <Button asChild className="btn-primary">
                        <Link to="/add-item">List Your First Item</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="card-apple">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                        <div className="p-2 rounded-xl bg-green-100">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Item approved</p>
                          <p className="text-sm text-muted-foreground">Your "Vintage Denim Jacket" is now live</p>
                        </div>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                        <div className="p-2 rounded-xl bg-blue-100">
                          <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Item listed</p>
                          <p className="text-sm text-muted-foreground">You listed "Designer Summer Dress"</p>
                        </div>
                        <span className="text-xs text-muted-foreground">1 day ago</span>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                        <div className="p-2 rounded-xl bg-purple-100">
                          <Coins className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Points earned</p>
                          <p className="text-sm text-muted-foreground">+75 points from successful swap</p>
                        </div>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
} 