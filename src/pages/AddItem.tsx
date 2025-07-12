
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateItem } from '@/hooks/useItems';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus, Package, Camera, Sparkles } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { ITEM_CATEGORIES, CLOTHING_SIZES, ITEM_CONDITIONS } from '@/lib/constants';

type ItemCategory = Database['public']['Enums']['item_category'];
type ClothingSize = Database['public']['Enums']['clothing_size'];
type ItemCondition = Database['public']['Enums']['item_condition'];

export function AddItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createItem = useCreateItem();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ItemCategory,
    size: '' as ClothingSize,
    condition: '' as ItemCondition,
    point_value: 50,
  });

  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createItem.mutateAsync({
        ...formData,
        user_id: user.id,
        image_urls: images.length > 0 ? images : ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop'], // Default image if none uploaded
        status: 'approved' // Auto-approve for demo
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
          <p className="text-muted-foreground mb-6">You need to be signed in to list items.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">List Your Item</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Share Your Amazing <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Items</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Turn your unused clothing into points and help others discover great pieces!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Item Photos
                </CardTitle>
                <CardDescription>
                  Add up to 5 high-quality photos of your item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer group">
                      <label className="cursor-pointer flex flex-col items-center gap-2 p-4">
                        <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-xs text-muted-foreground">Add Photo</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Provide clear and accurate information about your item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Vintage Denim Jacket, Designer Summer Dress"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item's features, condition, and why you're parting with it..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEM_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLOTHING_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Condition *</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEM_CONDITIONS.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Point Value</Label>
                    <Input
                      id="points"
                      type="number"
                      min="10"
                      max="500"
                      value={formData.point_value}
                      onChange={(e) => handleInputChange('point_value', parseInt(e.target.value))}
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Suggested: 25-100 points based on item value and condition
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to help others find your item (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., vintage, boho, summer"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="bg-background"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        #{tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <Card className="shadow-lg bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Ready to list your item?</h3>
                    <p className="text-sm text-muted-foreground">
                      Your item will be created and immediately available for others to see and request swaps.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                      Save as Draft
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!formData.title || !formData.category || !formData.condition || isSubmitting}
                      className="hover-lift"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Item'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
