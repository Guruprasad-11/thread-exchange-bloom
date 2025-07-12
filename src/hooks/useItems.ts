
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ItemWithProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ItemCategory = Database['public']['Enums']['item_category'];
type ClothingSize = Database['public']['Enums']['clothing_size'];

export function useItems(filters?: {
  category?: ItemCategory;
  size?: ClothingSize;
  tags?: string[];
  search?: string;
}) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: async () => {
      // Get demo items
      const { demoItems, demoUsers } = await import('@/lib/demo-data');
      
      // Get mock items from localStorage
      const mockItems = JSON.parse(localStorage.getItem('mockItems') || '[]');
      
      // Combine demo items with mock items
      const allItems = [...demoItems, ...mockItems];
      
      // Create items with profiles
      const itemsWithProfiles = allItems.map(item => {
        const user = demoUsers.find(u => u.id === item.user_id) || {
          id: item.user_id,
          username: 'mock-user',
          full_name: 'Mock User',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Demo user',
          points: 100,
          location: 'Demo City',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return {
          ...item,
          profile: user,
          item_tags: []
        };
      });
      
      // Apply filters
      let filteredData = itemsWithProfiles.filter(item => 
        item.status === 'approved' && item.is_available
      );

      if (filters?.category) {
        filteredData = filteredData.filter(item => item.category === filters.category);
      }

      if (filters?.size) {
        filteredData = filteredData.filter(item => item.size === filters.size);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }

      // Sort by created_at descending
      filteredData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return filteredData;
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (itemData: any) => {
      // Mock implementation for demo purposes
      console.log('🔍 Creating mock item:', itemData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock item with demo data
      const mockItem = {
        id: `mock-item-${Date.now()}`,
        ...itemData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_available: true,
        status: 'approved', // Auto-approve for demo
      };
      
      // Store in localStorage for persistence
      const existingItems = JSON.parse(localStorage.getItem('mockItems') || '[]');
      existingItems.push(mockItem);
      localStorage.setItem('mockItems', JSON.stringify(existingItems));
      
      console.log('✅ Mock item created:', mockItem.id);
      return mockItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      toast({
        title: "Success!",
        description: "Item created successfully and is now live!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating item:', error);
    },
  });
}

export function useUserItems(userId?: string) {
  return useQuery({
    queryKey: ['user-items', userId],
    queryFn: async () => {
      if (!userId) return [];

      // Get demo items
      const { demoItems, demoUsers } = await import('@/lib/demo-data');
      
      // Get mock items from localStorage
      const mockItems = JSON.parse(localStorage.getItem('mockItems') || '[]');
      
      // Combine demo items with mock items
      const allItems = [...demoItems, ...mockItems];
      
      // Filter by user ID
      const userItems = allItems.filter(item => item.user_id === userId);
      
      // Create items with profiles
      const itemsWithProfiles = userItems.map(item => {
        const user = demoUsers.find(u => u.id === item.user_id) || {
          id: item.user_id,
          username: 'mock-user',
          full_name: 'Mock User',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Demo user',
          points: 100,
          location: 'Demo City',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return {
          ...item,
          profile: user,
          item_tags: []
        };
      });
      
      // Sort by created_at descending
      itemsWithProfiles.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return itemsWithProfiles;
    },
    enabled: !!userId,
  });
}
