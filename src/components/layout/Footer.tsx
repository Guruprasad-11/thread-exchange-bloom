import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { 
  Package, 
  Heart, 
  Leaf, 
  Mail, 
  Twitter, 
  Instagram, 
  Facebook,
  ArrowUp
} from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container-apple py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 hover-lift">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">
                <AnimatedGradientText>ReWear</AnimatedGradientText>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transforming fashion through sustainable exchange. Join thousands making clothing circular.
            </p>
            <div className="flex items-center gap-2">
              <Badge className="badge-success">
                <Leaf className="h-3 w-3 mr-1" />
                Eco-Friendly
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="space-y-2">
              <Link 
                to="/browse" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Items
              </Link>
              <Link 
                to="/add-item" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                List an Item
              </Link>
              <Link 
                to="/dashboard" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/about" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <nav className="space-y-2">
              <Link 
                to="/help" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Help Center
              </Link>
              <Link 
                to="/contact" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                to="/faq" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
              <Link 
                to="/safety" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Safety Guidelines
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on new features and sustainable fashion tips.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="focus-ring"
              />
              <Button className="w-full btn-primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 ReWear. All rights reserved.</span>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Links */}
          <div className="md:hidden flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-background transition-all duration-200 hover:scale-110"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
} 