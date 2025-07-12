
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Item = Database['public']['Tables']['items']['Row'];
export type SwapRequest = Database['public']['Tables']['swap_requests']['Row'];
export type PointsLog = Database['public']['Tables']['points_log']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];

export type ItemCategory = Database['public']['Enums']['item_category'];
export type ClothingSize = Database['public']['Enums']['clothing_size'];
export type ItemCondition = Database['public']['Enums']['item_condition'];
export type ItemStatus = Database['public']['Enums']['item_status'];
export type SwapStatus = Database['public']['Enums']['swap_status'];

export interface ItemWithProfile extends Item {
  profiles: Profile;
  item_tags?: { tags: Tag }[];
}

export interface SwapRequestWithDetails extends SwapRequest {
  requester: Profile;
  owner: Profile;
  requested_item: ItemWithProfile;
  offered_item?: ItemWithProfile;
}
