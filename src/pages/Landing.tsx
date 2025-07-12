
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { FloatingCard } from '@/components/ui/floating-card';
import { ArrowRight, Recycle, Users, Sparkles, Heart, Leaf, Star, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ItemDetailModal } from '@/components/ItemDetailModal';

// Hook to fetch featured items
function useFeaturedItems() {
  return useQuery({
    queryKey: ['featured-items'],
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
            location
          )
        `)
        .eq('status', 'approved')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching featured items:', error);
        throw error;
      }

      return data || [];
    },
  });
}

const features = [
  {
    icon: Recycle,
    title: "Upload Your Item",
    description: "Take photos and describe your unused clothing. Set your desired points value and let others discover your items."
  },
  {
    icon: Sparkles,
    title: "Swap or Redeem",
    description: "Browse items from the community and either swap directly or redeem using your earned points."
  },
  {
    icon: Users,
    title: "Receive at Your Doorstep",
    description: "Once a swap is agreed upon, items are shipped directly to your door. Simple, secure, and sustainable."
  }
];

export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const { data: featuredItems = [], isLoading: itemsLoading } = useFeaturedItems();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }

    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2, 
          delay: 0.3,
          ease: "power2.out" 
        }
      );
    }

    if (itemsRef.current) {
      gsap.fromTo(
        itemsRef.current.children,
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.15, 
          delay: 0.6,
          ease: "back.out(1.7)" 
        }
      );
    }
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredItems.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredItems.length / 3)) % Math.ceil(featuredItems.length / 3));
  };

  const visibleItems = featuredItems.slice(currentSlide * 3, (currentSlide + 1) * 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        
        <div className="container-apple text-center relative z-10" ref={heroRef}>
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="badge-success px-4 py-2 text-sm font-medium">
              <Leaf className="w-4 h-4 mr-2" />
              Sustainable Fashion Revolution
            </Badge>
            
            <h1 className="text-balance">
              Transform Your Wardrobe{' '}
              <AnimatedGradientText className="text-5xl md:text-6xl lg:text-7xl">
                Sustainably
              </AnimatedGradientText>
            </h1>
            
            <p className="text-responsive text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
              Join thousands of fashion enthusiasts who are making clothing circular. 
              Swap unused items, earn points, and discover unique pieces while reducing fashion waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button asChild className="btn-primary text-lg px-8 py-4">
                <Link to="/signup">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="btn-secondary text-lg px-8 py-4">
                <Link to="/add-item">
                  List an Item
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>10k+ Happy Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>50k+ Items Exchanged</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="section-padding bg-muted/30">
        <div className="container-apple">
          <div className="text-center mb-16">
            <h2 className="text-balance mb-4">
              Featured Items
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Discover amazing pieces from our community
            </p>
          </div>
          
          <div className="relative" ref={itemsRef}>
            {itemsLoading ? (
              <div className="card-grid-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="card-apple">
                    <div className="aspect-square skeleton" />
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 skeleton rounded" />
                      <div className="h-3 skeleton rounded w-1/2" />
                      <div className="h-10 skeleton rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredItems.length > 0 ? (
              <>
                <div className="card-grid-3">
                  {visibleItems.map((item) => (
                    <Card key={item.id} className="card-apple hover-lift group">
                      <div className="image-container aspect-square">
                        <img 
                          src={item.image_urls?.[0] || '/placeholder.svg'} 
                          alt={item.title}
                          className="group-hover:scale-105"
                        />
                        <Badge className="absolute top-3 left-3 glass">
                          {item.condition.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {item.title}
                          </h3>
                          <Badge className="badge-info">
                            {item.point_value} pts
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 capitalize">{item.category}</p>
                        <Button 
                          className="w-full btn-secondary" 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {featuredItems.length > 3 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevSlide}
                      className="rounded-full w-12 h-12"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex gap-2">
                      {Array.from({ length: Math.ceil(featuredItems.length / 3) }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextSlide}
                      className="rounded-full w-12 h-12"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No featured items available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding">
        <div className="container-apple">
          <div className="text-center mb-16">
            <h2 className="text-balance mb-4">
              How ReWear Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Simple, sustainable, and social. Three steps to transform your wardrobe.
            </p>
          </div>
          
          <div className="card-grid-3" ref={featuresRef}>
            {features.map((feature, index) => (
              <FloatingCard key={index} className="card-apple text-center group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-balance">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding animated-gradient text-primary-foreground">
        <div className="container-apple text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-balance">
              Ready to Transform Your Wardrobe?
            </h2>
            <p className="text-lg opacity-90 text-balance">
              Join the sustainable fashion movement and start swapping today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                <Link to="/browse">
                  Browse Items
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
