
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
      let query = supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url,
            location
          ),
          item_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq('status', 'approved')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.size) {
        query = query.eq('size', filters.size);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data as ItemWithProfile[];

      // Filter by tags if specified
      if (filters?.tags && filters.tags.length > 0) {
        filteredData = filteredData.filter(item =>
          item.item_tags?.some(itemTag =>
            filters.tags!.includes(itemTag.tags.name)
          )
        );
      }

      return filteredData;
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (itemData: any) => {
      const { data, error } = await supabase
        .from('items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      toast({
        title: "Success!",
        description: "Item created successfully. It will be reviewed before going live.",
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

      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url,
            location
          ),
          item_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ItemWithProfile[];
    },
    enabled: !!userId,
  });
}
