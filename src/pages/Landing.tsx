
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { FloatingCard } from '@/components/ui/floating-card';
import { useItems } from '@/hooks/useItems';
import { Recycle, Users, Coins, ArrowRight, Star, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const { data: featuredItems = [] } = useItems();

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(heroRef.current.querySelector('.hero-title'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )
      .fromTo(heroRef.current.querySelector('.hero-subtitle'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5"
      )
      .fromTo(heroRef.current.querySelector('.hero-buttons'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3"
      );
    }

    // Features animation on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target.children,
              { opacity: 0, y: 30, stagger: 0.2 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Recycle className="h-8 w-8" />,
      title: "Sustainable Swapping",
      description: "Give your clothes a second life and reduce fashion waste through direct item exchanges."
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: "Points System",
      description: "Earn points for every swap and use them to get items you love without direct exchanges."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Connect with like-minded fashion lovers in your area and build lasting relationships."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/50">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="hero-title">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Transform Your Wardrobe with{' '}
                <AnimatedGradientText className="inline-block">
                  ReWear
                </AnimatedGradientText>
              </h1>
            </div>
            
            <div className="hero-subtitle">
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Join the sustainable fashion revolution. Swap, trade, and discover amazing 
                pre-loved clothing while earning points and building community connections.
              </p>
            </div>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full">
                <Link to="/browse" className="flex items-center gap-2">
                  Start Swapping
                  <Sparkles className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
                <Link to="/add-item" className="flex items-center gap-2">
                  List an Item
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <FloatingCard delay={0}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary" />
          </FloatingCard>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <FloatingCard delay={1}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary" />
          </FloatingCard>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose <AnimatedGradientText>ReWear</AnimatedGradientText>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience a new way to refresh your wardrobe while making a positive impact on the environment.
            </p>
          </div>

          <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <FloatingCard key={index} delay={index * 0.3}>
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-background to-muted/30">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      {featuredItems.length > 0 && (
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <AnimatedGradientText>Featured Items</AnimatedGradientText>
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover amazing pre-loved fashion from our community
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.slice(0, 4).map((item, index) => (
                <FloatingCard key={item.id} delay={index * 0.2}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                      {item.image_urls && item.image_urls[0] ? (
                        <img 
                          src={item.image_urls[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          {item.point_value} pts
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="capitalize">{item.category}</span>
                        <span className="capitalize">{item.condition?.replace('_', ' ')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </FloatingCard>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/browse" className="flex items-center gap-2">
                  Browse All Items
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <FloatingCard>
            <Card className="max-w-4xl mx-auto border-2 bg-gradient-to-br from-background to-muted/30">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Ready to Start Your <AnimatedGradientText>Sustainable Journey</AnimatedGradientText>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of fashion lovers who are already making a difference. 
                  Start swapping today and earn your first 100 points!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full">
                    <Link to="/signup" className="flex items-center gap-2">
                      Join ReWear Today
                      <Star className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
                    <Link to="/browse">
                      Explore Items
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </section>
    </div>
  );
}
