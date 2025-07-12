
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const createTestAccount = () => {
    setEmail('john123@gmail.com');
    setPassword('john123');
    setUsername('john');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation - just check if fields are not empty
    if (!email || !password || !username) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, username);
      toast({
        title: "Account created!",
        description: "Your account has been created successfully. Welcome to ReWear!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Sign up failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/5" />
      
      <Card className="w-full max-w-md relative border-border/50 bg-card/95 backdrop-blur shadow-lg hover:shadow-xl transition-shadow animate-scale-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <CardTitle className="text-2xl font-bold text-card-foreground">
            Join <AnimatedGradientText>ReWear</AnimatedGradientText>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account and start your sustainable fashion journey
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 focus-ring border-input bg-background text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 focus-ring border-input bg-background text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (any password works)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 focus-ring border-input bg-background text-foreground placeholder:text-muted-foreground"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full focus-ring hover-lift bg-primary text-primary-foreground hover:bg-primary/90" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full"
              onClick={createTestAccount}
              disabled={loading}
            >
              Fill Test Account (john/john123@gmail.com/john123)
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="link font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-muted-foreground text-center">
            By signing up, you agree to our terms of service and get 100 points to start swapping!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
