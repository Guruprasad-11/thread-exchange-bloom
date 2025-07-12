
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  Package,
  MapPin,
  Calendar,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { gsap } from 'gsap';

const categories = [
  'all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'jewelry', 'bags'
];

const conditions = [
  'all', 'new', 'like_new', 'good', 'fair', 'worn'
];

const sizes = [
  'all', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'
];

export function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});

  // Fetch items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['browse-items'],
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
            location
          )
        `)
        .eq('status', 'approved')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
      const matchesSize = selectedSize === 'all' || item.size === selectedSize;
      
      return matchesSearch && matchesCategory && matchesCondition && matchesSize;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'points-low':
          return (a.point_value || 0) - (b.point_value || 0);
        case 'points-high':
          return (b.point_value || 0) - (a.point_value || 0);
        default:
          return 0;
      }
    });

  useEffect(() => {
    gsap.fromTo(
      '.browse-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const toggleLike = (itemId: string) => {
    setIsLiked(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-apple py-8">
        {/* Header */}
        <div className="mb-8 browse-content">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Browse Items</h1>
              <p className="text-muted-foreground">Discover amazing pieces from our community</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="card-apple mb-8 browse-content">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items, descriptions, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus-ring"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="focus-ring">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger className="focus-ring">
                    <Package className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition === 'all' ? 'All Conditions' : condition.replace('_', ' ').charAt(0).toUpperCase() + condition.replace('_', ' ').slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="focus-ring">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size === 'all' ? 'All Sizes' : size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="focus-ring">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="points-low">Points: Low to High</SelectItem>
                    <SelectItem value="points-high">Points: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="flex-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="flex-1"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                </p>
                {(searchTerm || selectedCategory !== 'all' || selectedCondition !== 'all' || selectedSize !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedCondition('all');
                      setSelectedSize('all');
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid/List */}
        <div className="browse-content">
          {isLoading ? (
            <div className={viewMode === 'grid' ? 'card-grid-4' : 'space-y-4'}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="card-apple">
                  <div className="aspect-square skeleton rounded-xl" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                    <div className="h-8 skeleton rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className={viewMode === 'grid' ? 'card-grid-4' : 'space-y-4'}>
              {filteredItems.map((item) => (
                <Card key={item.id} className="card-apple hover-lift group">
                  <div className="image-container aspect-square">
                    <img
                      src={item.image_urls?.[0] || '/placeholder.svg'}
                      alt={item.title}
                      className="group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="glass">
                        {item.condition.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className="badge-info">
                        {item.point_value} pts
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 glass hover:bg-white/20"
                      onClick={() => toggleLike(item.id)}
                    >
                      <Heart className={`h-4 w-4 ${isLiked[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.profiles?.location || 'Location not specified'}</span>
                        </div>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="badge-eco capitalize">
                            {item.category}
                          </Badge>
                          {item.size && (
                            <Badge variant="outline" className="badge-eco">
                              {item.size}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button asChild className="w-full btn-secondary">
                        <Link to={`/item/${item.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-apple">
              <CardContent className="p-12 text-center">
                <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedCondition('all');
                    setSelectedSize('all');
                  }}
                  className="btn-secondary"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
