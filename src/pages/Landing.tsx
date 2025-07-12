
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { FloatingCard } from '@/components/ui/floating-card';
import { ArrowRight, Recycle, Users, Sparkles, Heart, Leaf, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const featuredItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    image: "/placeholder.svg",
    condition: "Good",
    points: 75,
    category: "Outerwear"
  },
  {
    id: 2,
    title: "Designer Summer Dress",
    image: "/placeholder.svg",
    condition: "Like New",
    points: 120,
    category: "Dresses"
  },
  {
    id: 3,
    title: "Sustainable Cotton Tee",
    image: "/placeholder.svg",
    condition: "New",
    points: 45,
    category: "Tops"
  }
];

const features = [
  {
    icon: Recycle,
    title: "Sustainable Exchange",
    description: "Give your clothes a second life while discovering unique pieces from others."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with like-minded fashion enthusiasts in your area."
  },
  {
    icon: Sparkles,
    title: "Points System",
    description: "Earn points for every item you share and use them to get new pieces."
  }
];

export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        
        <div className="container mx-auto text-center relative z-10" ref={heroRef}>
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-accent/20 text-accent-foreground border-accent/30">
              <Leaf className="w-4 h-4 mr-2" />
              Sustainable Fashion Revolution
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Welcome to{' '}
              <AnimatedGradientText className="text-6xl md:text-8xl">
                ReWear
              </AnimatedGradientText>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your wardrobe sustainably. Exchange unused clothing through 
              direct swaps or our innovative points system. Join thousands making 
              fashion circular.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button asChild size="lg" className="px-8 py-6 text-lg hover-lift focus-ring bg-primary hover:bg-primary/90">
                <Link to="/signup">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg hover-lift focus-ring border-primary/20 hover:border-primary/40">
                <Link to="/login">
                  Browse Items
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

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How ReWear Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, sustainable, and social. Three steps to transform your wardrobe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8" ref={featuresRef}>
            {features.map((feature, index) => (
              <FloatingCard key={index} className="hover-lift">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Featured Items
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing pieces from our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8" ref={itemsRef}>
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover-lift border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground border-border/50">
                    {item.condition}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">
                      {item.title}
                    </h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {item.points} pts
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{item.category}</p>
                  <Button className="w-full focus-ring hover-lift" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="px-8 py-6 hover-lift focus-ring">
              <Link to="/login">
                View All Items
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Wardrobe?
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Join thousands of fashion-forward individuals making sustainable choices. 
              Start your journey today with 100 free points!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="px-8 py-6 text-lg hover-lift focus-ring bg-background text-foreground hover:bg-background/90"
              >
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
