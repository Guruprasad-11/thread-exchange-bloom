
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Users, 
  TrendingUp, 
  Award, 
  Plus, 
  Eye, 
  MessageSquare, 
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Coins
} from 'lucide-react';
import { getItemsWithProfiles, getSwapRequestsWithDetails } from '@/lib/demo-data';

export function Dashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Get demo data
  const allItems = getItemsWithProfiles();
  const allSwapRequests = getSwapRequestsWithDetails();
  
  // Filter items for current user (mock user)
  const userItems = allItems.filter(item => item.user_id === 'demo-user-1');
  
  // Filter swap requests for current user
  const userSwapRequests = allSwapRequests.filter(swap => 
    swap.requester_id === 'demo-user-1' || swap.owner_id === 'demo-user-1'
  );

  const completedSwaps = userSwapRequests.filter(swap => swap.status === 'completed').length;
  const pendingSwaps = userSwapRequests.filter(swap => swap.status === 'pending').length;
  const userLevel = Math.floor((profile?.points || 0) / 100) + 1;
  const progressToNextLevel = ((profile?.points || 0) % 100);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Please log in to access your dashboard</h2>
          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="text-2xl">
                {profile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.username}!</h1>
              <p className="text-muted-foreground">Here's what's happening with your sustainable fashion journey</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold">{profile?.points || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Package className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Items Listed</p>
                  <p className="text-2xl font-bold">{userItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Swaps</p>
                  <p className="text-2xl font-bold">{pendingSwaps}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Swaps</p>
                  <p className="text-2xl font-bold">{completedSwaps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Level {userLevel}</h3>
                <p className="text-sm text-muted-foreground">
                  {progressToNextLevel} points until Level {userLevel + 1}
                </p>
              </div>
              <Badge variant="secondary">Level {userLevel}</Badge>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">My Items</TabsTrigger>
            <TabsTrigger value="swaps">Swap Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest swaps and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSwapRequests.slice(0, 3).map((swap) => (
                    <div key={swap.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {swap.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {swap.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                        {swap.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {swap.requester_id === 'demo-user-1' ? 'You requested' : 'You received a request for'} {' '}
                          {swap.requested_item?.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {swap.status === 'completed' && 'Swap completed successfully'}
                          {swap.status === 'pending' && 'Waiting for response'}
                          {swap.status === 'rejected' && 'Request was declined'}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {swap.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-20 flex-col">
                    <Link to="/add-item">
                      <Plus className="h-6 w-6 mb-2" />
                      List New Item
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col">
                    <Link to="/browse">
                      <Eye className="h-6 w-6 mb-2" />
                      Browse Items
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Items</h2>
              <Button asChild>
                <Link to="/add-item">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted">
                    <img
                      src={item.image_urls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{item.point_value}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={`capitalize ${item.condition === 'new' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {item.condition.replace('_', ' ')}
                      </Badge>
                      <Button asChild size="sm">
                        <Link to={`/item/${item.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="swaps" className="space-y-6">
            <h2 className="text-2xl font-bold">Swap Requests</h2>
            
            <div className="space-y-4">
              {userSwapRequests.map((swap) => (
                <Card key={swap.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">
                            {swap.requester_id === 'demo-user-1' ? 'You requested' : 'You received a request for'} {' '}
                            {swap.requested_item?.title}
                          </h3>
                          <Badge variant="outline" className="capitalize">
                            {swap.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {swap.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-muted-foreground">
                            From: {swap.requester_id === 'demo-user-1' ? swap.owner_profile?.username : swap.requester_profile?.username}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(swap.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {swap.offered_item && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Offered in exchange:</p>
                            <p className="text-sm">{swap.offered_item.title}</p>
                          </div>
                        )}
                        
                        {swap.points_offered > 0 && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Points offered:</p>
                            <p className="text-sm flex items-center gap-1">
                              <Coins className="h-4 w-4 text-yellow-500" />
                              {swap.points_offered}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {swap.status === 'pending' && swap.owner_id === 'demo-user-1' && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="default">Accept</Button>
                          <Button size="sm" variant="outline">Decline</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <p className="text-lg">{profile?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-lg">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-lg">{profile?.location || 'Not set'}</p>
                  </div>
                </div>
                
                {profile?.bio && (
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <p className="text-lg">{profile.bio}</p>
                  </div>
                )}
                
                <Button variant="outline">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
