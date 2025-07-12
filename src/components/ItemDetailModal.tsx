import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, MapPin, User, Calendar, Tag, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Item = Tables<'items'>;
type Profile = Tables<'profiles'>;

interface ItemDetailModalProps {
  item: Item & { profile: Profile };
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const conditionColors = {
    new: 'bg-green-100 text-green-800 border-green-200',
    like_new: 'bg-blue-100 text-blue-800 border-blue-200',
    good: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    fair: 'bg-orange-100 text-orange-800 border-orange-200',
    poor: 'bg-red-100 text-red-800 border-red-200'
  };

  const sizeLabels = {
    xs: 'Extra Small',
    s: 'Small',
    m: 'Medium',
    l: 'Large',
    xl: 'Extra Large',
    xxl: '2XL'
  };

  const categoryLabels = {
    tops: 'Tops',
    bottoms: 'Bottoms',
    dresses: 'Dresses',
    outerwear: 'Outerwear',
    shoes: 'Shoes',
    accessories: 'Accessories'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={item.image_urls[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {item.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {item.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Price/Points */}
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-2">
                {item.point_value} Points
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="w-4 h-4" />
                Save
              </Button>
            </div>

            {/* Condition and Size */}
            <div className="flex gap-4">
              <Badge className={conditionColors[item.condition as keyof typeof conditionColors]}>
                {item.condition.replace('_', ' ').toUpperCase()}
              </Badge>
              {item.size && (
                <Badge variant="outline">
                  Size: {sizeLabels[item.size as keyof typeof sizeLabels]}
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Category: {categoryLabels[item.category as keyof typeof categoryLabels]}
              </span>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={item.profile.avatar_url}
                    alt={item.profile.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{item.profile.full_name}</h4>
                    <p className="text-sm text-muted-foreground">@{item.profile.username}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{item.profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span>{item.profile.points} points earned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Member since {new Date(item.profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg">
                Request Swap
              </Button>
              <Button variant="outline" size="lg">
                Message Seller
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 