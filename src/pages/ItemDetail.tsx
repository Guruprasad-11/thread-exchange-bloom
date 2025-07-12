
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Package, 
  Coins,
  Star,
  Shield,
  Truck,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch item details
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url,
            bio,
            points,
            location,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching item:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (item) {
      gsap.fromTo(
        '.item-detail-content',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [item]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-apple py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 skeleton rounded" />
            <div className="h-6 skeleton rounded w-32" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square skeleton rounded-3xl" />
            <div className="space-y-6">
              <div className="h-8 skeleton rounded w-3/4" />
              <div className="h-4 skeleton rounded w-1/2" />
              <div className="h-6 skeleton rounded w-1/4" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-4 skeleton rounded" />
                ))}
              </div>
              <div className="h-12 skeleton rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/browse">Browse Items</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === item.user_id;
  const images = item.image_urls || ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-background">
      <div className="container-apple py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-8 item-detail-content">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover-lift"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground capitalize">{item.category}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 item-detail-content">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="image-container aspect-square rounded-3xl overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass hover:bg-white/20"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass hover:bg-white/20"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <Badge className="absolute top-4 left-4 glass">
                {item.condition.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === selectedImage
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 line-clamp-2">{item.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.profiles?.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge className="badge-info text-lg px-4 py-2">
                  <Coins className="h-4 w-4 mr-2" />
                  {item.point_value} pts
                </Badge>
              </div>

              {/* Owner Info */}
              <Card className="card-apple">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={item.profiles?.avatar_url || ''} alt={item.profiles?.username || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {item.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.profiles?.full_name || item.profiles?.username}</h3>
                      <p className="text-sm text-muted-foreground">Member since {new Date(item.profiles?.created_at || '').getFullYear()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="card-apple">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card className="card-apple">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{item.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-medium">{item.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium capitalize">{item.condition.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <Card className="card-apple">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="badge-eco">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {!isOwner && item.is_available && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button className="btn-primary flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Request Swap
                  </Button>
                  <Button variant="outline" className="btn-secondary flex-1">
                    <Coins className="h-4 w-4 mr-2" />
                    Redeem with Points
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Secure Transaction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>24h Response</span>
                  </div>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button variant="outline" className="btn-secondary flex-1">
                    Edit Item
                  </Button>
                  <Button variant="outline" className="btn-secondary flex-1">
                    View Requests
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  This is your item. You can edit it or view swap requests.
                </p>
              </div>
            )}

            {!item.is_available && (
              <Card className="card-apple border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-medium text-yellow-800">This item is no longer available</p>
                  <p className="text-sm text-yellow-700">It may have been swapped or removed by the owner.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 item-detail-content">
          <Tabs defaultValue="similar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="similar">Similar Items</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="policy">Swap Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="similar" className="space-y-4">
              <p className="text-muted-foreground">Discover similar items from our community.</p>
              <div className="card-grid-4">
                {/* Similar items would be loaded here */}
                <Card className="card-apple hover-lift">
                  <div className="aspect-square skeleton rounded-xl" />
                  <CardContent className="p-4">
                    <div className="h-4 skeleton rounded w-3/4 mb-2" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <p className="text-muted-foreground">Reviews from other community members.</p>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews yet for this item.</p>
              </div>
            </TabsContent>

            <TabsContent value="policy" className="space-y-4">
              <Card className="card-apple">
                <CardHeader>
                  <CardTitle>Swap Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Secure Exchange</p>
                        <p className="text-sm text-muted-foreground">All swaps are verified and secure through our platform.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Quality Assurance</p>
                        <p className="text-sm text-muted-foreground">Items are reviewed to ensure they match the description.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Free Shipping</p>
                        <p className="text-sm text-muted-foreground">Shipping costs are covered for all successful swaps.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">24-Hour Response</p>
                        <p className="text-sm text-muted-foreground">Owners typically respond to swap requests within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
