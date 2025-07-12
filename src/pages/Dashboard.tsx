
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserItems } from '@/hooks/useItems';
import { useSwapRequests } from '@/hooks/useSwapRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Plus, Package, ArrowRightLeft, Coins, TrendingUp, Heart, Star } from 'lucide-react';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';

export function Dashboard() {
  const { user, profile } = useAuth();
  const { data: userItems = [], isLoading: itemsLoading } = useUserItems(user?.id);
  const { data: swapRequests = [], isLoading: swapsLoading } = useSwapRequests(user?.id);

  const completedSwaps = swapRequests.filter(swap => swap.status === 'completed').length;
  const pendingSwaps = swapRequests.filter(swap => swap.status === 'pending').length;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-primary-foreground/20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-primary-foreground/20 text-2xl font-bold">
                  {profile?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {profile?.username || 'Swapper'}! 👋
                </h1>
                <p className="text-primary-foreground/80 text-lg">
                  Level {userLevel} • {profile?.points || 0} points
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span>Progress to Level {userLevel + 1}</span>
                    <Badge variant="secondary" className="bg-primary-foreground/20">
                      {progressToNextLevel}/100
                    </Badge>
                  </div>
                  <Progress value={progressToNextLevel} className="w-64" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="secondary" size="lg" className="hover-lift">
                <Link to="/add-item">
                  <Plus className="mr-2 h-5 w-5" />
                  List Item
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-lift border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/browse">
                  Browse Items
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover-lift bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Points</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{profile?.points || 0}</p>
                </div>
                <Coins className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Items Listed</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{userItems.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed Swaps</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{completedSwaps}</p>
                </div>
                <ArrowRightLeft className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending Swaps</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{pendingSwaps}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Items
            </TabsTrigger>
            <TabsTrigger value="swaps" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Swap Requests
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Listed Items</h2>
              <Button asChild>
                <Link to="/add-item">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Link>
              </Button>
            </div>

            {itemsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userItems.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items listed yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first item to the community!</p>
                <Button asChild>
                  <Link to="/add-item">List Your First Item</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {userItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover-lift group">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {item.image_urls && item.image_urls[0] ? (
                        <img 
                          src={item.image_urls[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3">
                        {item.status}
                      </Badge>
                      {item.is_available && (
                        <Badge variant="secondary" className="absolute top-3 right-3">
                          Available
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant="secondary">{item.point_value} pts</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="swaps" className="space-y-6">
            <h2 className="text-2xl font-bold">Swap Requests</h2>
            
            {swapsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse p-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : swapRequests.length === 0 ? (
              <Card className="p-12 text-center">
                <ArrowRightLeft className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No swap requests yet</h3>
                <p className="text-muted-foreground mb-6">Browse items to start making swap requests!</p>
                <Button asChild>
                  <Link to="/browse">Browse Items</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {swapRequests.map((swap) => (
                  <Card key={swap.id} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            {swap.requested_item?.image_urls?.[0] ? (
                              <img 
                                src={swap.requested_item.image_urls[0]} 
                                alt={swap.requested_item.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{swap.requested_item?.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {swap.requester_id === user.id ? 'You requested' : 'Request from'} @{swap.requester?.username}
                            </p>
                          </div>
                        </div>
                        
                        <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                        
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            {swap.offered_item?.image_urls?.[0] ? (
                              <img 
                                src={swap.offered_item.image_urls[0]} 
                                alt={swap.offered_item.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : swap.points_offered ? (
                              <Coins className="h-8 w-8 text-muted-foreground" />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {swap.offered_item?.title || `${swap.points_offered} Points`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Offered by @{swap.requester?.username}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-auto">
                          <Badge variant={
                            swap.status === 'completed' ? 'default' :
                            swap.status === 'accepted' ? 'secondary' :
                            swap.status === 'rejected' ? 'destructive' :
                            'outline'
                          }>
                            {swap.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {swap.message && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground italic">"{swap.message}"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Manage your profile information and preferences
                </CardDescription>
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
