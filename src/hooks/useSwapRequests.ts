
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SwapRequestWithDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useSwapRequests(userId?: string) {
  return useQuery({
    queryKey: ['swap-requests', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:profiles!swap_requests_requester_id_fkey (
            id,
            username,
            avatar_url
          ),
          owner:profiles!swap_requests_owner_id_fkey (
            id,
            username,
            avatar_url
          ),
          requested_item:items!swap_requests_requested_item_id_fkey (
            *,
            profiles (
              id,
              username,
              avatar_url
            )
          ),
          offered_item:items!swap_requests_offered_item_id_fkey (
            *,
            profiles (
              id,
              username,
              avatar_url
            )
          )
        `)
        .or(`requester_id.eq.${userId},owner_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SwapRequestWithDetails[];
    },
    enabled: !!userId,
  });
}

export function useCreateSwapRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (swapData: any) => {
      const { data, error } = await supabase
        .from('swap_requests')
        .insert(swapData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swap-requests'] });
      toast({
        title: "Swap Request Sent!",
        description: "Your swap request has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send swap request. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating swap request:', error);
    },
  });
}

export function useUpdateSwapRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('swap_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swap-requests'] });
      toast({
        title: "Success!",
        description: "Swap request updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update swap request. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating swap request:', error);
    },
  });
}
