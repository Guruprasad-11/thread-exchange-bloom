
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateSwapRequest } from '@/hooks/useSwapRequests';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Package, ArrowRightLeft, Coins, Star, Shield } from 'lucide-react';
import { ItemWithProfile } from '@/lib/types';

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [swapMessage, setSwapMessage] = useState('');
  const [selectedOfferType, setSelectedOfferType] = useState<'item' | 'points'>('points');
  const createSwapRequest = useCreateSwapRequest();

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      if (!id) throw new Error('Item ID is required');
      
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url,
            location,
            full_name
          ),
          item_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) throw error;
      return data as ItemWithProfile;
    },
    enabled: !!id,
  });

  const { data: userItems = [] } = useQuery({
    queryKey: ['user-items-for-swap', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_available', true)
        .eq('status', 'approved');

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSwapRequest = async (offeredItemId?: string, pointsOffered?: number) => {
    if (!item || !user) return;

    try {
      await createSwapRequest.mutateAsync({
        requester_id: user.id,
        owner_id: item.user_id,
        requested_item_id: item.id,
        offered_item_id: offeredItemId || null,
        points_offered: pointsOffered || 0,
        message: swapMessage,
      });
      setSwapMessage('');
    } catch (error) {
      console.error('Error creating swap request:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Item not found</h2>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/browse">Browse Other Items</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const isOwnItem = user?.id === item.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/browse" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-xl">
              {item.image_urls && item.image_urls.length > 0 ? (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {item.image_urls.map((url, index) => (
                      <CarouselItem key={index}>
                        <img 
                          src={url} 
                          alt={`${item.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {item.image_urls.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {item.image_urls && item.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {item.image_urls.map((url, index) => (
                  <div key={index} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={url} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="capitalize">
                      {item.category}
                    </Badge>
                    {item.size && (
                      <Badge variant="outline" className="uppercase">
                        Size {item.size}
                      </Badge>
                    )}
                    <Badge className="capitalize">
                      {item.condition?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Point Value</span>
                </div>
                <Badge className="text-lg px-3 py-1 bg-primary text-primary-foreground">
                  {item.point_value} Points
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {item.description || 'No description provided.'}
              </p>
            </div>

            {/* Tags */}
            {item.item_tags && item.item_tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.item_tags.map((itemTag) => (
                    <Badge key={itemTag.tags.id} variant="secondary">
                      #{itemTag.tags.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Owner Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Item Owner</h3>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {item.profiles?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{item.profiles?.full_name || item.profiles?.username}</p>
                  <p className="text-sm text-muted-foreground">@{item.profiles?.username}</p>
                  {item.profiles?.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.profiles.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>4.8</span>
                </div>
              </div>
            </div>

            {/* Item Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Listed {new Date(item.created_at!).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Verified Item</span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwnItem && item.is_available && user && (
              <div className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full hover-lift">
                      <ArrowRightLeft className="mr-2 h-5 w-5" />
                      Request Swap
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Swap Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Choose your offer:</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant={selectedOfferType === 'points' ? 'default' : 'outline'}
                            onClick={() => setSelectedOfferType('points')}
                            className="h-auto p-3 flex-col gap-1"
                          >
                            <Coins className="h-5 w-5" />
                            <span className="text-xs">Points</span>
                          </Button>
                          <Button 
                            variant={selectedOfferType === 'item' ? 'default' : 'outline'}
                            onClick={() => setSelectedOfferType('item')}
                            className="h-auto p-3 flex-col gap-1"
                          >
                            <Package className="h-5 w-5" />
                            <span className="text-xs">Item</span>
                          </Button>
                        </div>
                      </div>

                      {selectedOfferType === 'points' && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            You have {profile?.points || 0} points available
                          </p>
                          <Button 
                            className="w-full"
                            onClick={() => handleSwapRequest(undefined, item.point_value)}
                            disabled={!profile?.points || profile.points < (item.point_value || 0)}
                          >
                            Offer {item.point_value} Points
                          </Button>
                        </div>
                      )}

                      {selectedOfferType === 'item' && (
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {userItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground p-4 text-center">
                              You don't have any items to offer. 
                              <Link to="/add-item" className="text-primary hover:underline ml-1">
                                List an item first
                              </Link>
                            </p>
                          ) : (
                            userItems.map((userItem) => (
                              <Button
                                key={userItem.id}
                                variant="outline"
                                className="w-full justify-start h-auto p-3"
                                onClick={() => handleSwapRequest(userItem.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-muted rounded">
                                    {userItem.image_urls?.[0] && (
                                      <img 
                                        src={userItem.image_urls[0]} 
                                        alt={userItem.title}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    )}
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium text-sm">{userItem.title}</p>
                                    <p className="text-xs text-muted-foreground">{userItem.point_value} pts</p>
                                  </div>
                                </div>
                              </Button>
                            ))
                          )}
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium mb-2 block">Message (optional)</label>
                        <Textarea 
                          placeholder="Add a personal message..."
                          value={swapMessage}
                          onChange={(e) => setSwapMessage(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="lg" className="w-full hover-lift">
                  <Coins className="mr-2 h-5 w-5" />
                  Redeem with Points ({item.point_value} pts)
                </Button>
              </div>
            )}

            {isOwnItem && (
              <div className="p-4 bg-muted/50 rounded-xl text-center">
                <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">This is your item</p>
              </div>
            )}

            {!user && (
              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link to="/login">Sign in to Request Swap</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Items */}
        <Card>
          <CardHeader>
            <CardTitle>Similar Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden hover-lift">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm mb-1">Similar Item {i + 1}</h4>
                    <p className="text-xs text-muted-foreground">50 pts</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
