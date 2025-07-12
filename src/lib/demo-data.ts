import { Tables } from '@/integrations/supabase/types';

type Item = Tables<'items'>;
type Profile = Tables<'profiles'>;
type SwapRequest = Tables<'swap_requests'>;

// Demo users
export const demoUsers: Profile[] = [
  {
    id: 'demo-user-1',
    username: 'fashionista_sarah',
    full_name: 'Sarah Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Sustainable fashion enthusiast | Vintage lover',
    points: 250,
    location: 'New York, NY',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-user-2',
    username: 'eco_style_mike',
    full_name: 'Mike Chen',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Minimalist wardrobe | Quality over quantity',
    points: 180,
    location: 'San Francisco, CA',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z'
  },
  {
    id: 'demo-user-3',
    username: 'vintage_vibes_emma',
    full_name: 'Emma Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Vintage collector | Thrift store hunter',
    points: 320,
    location: 'Austin, TX',
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-05T09:15:00Z'
  },
  {
    id: 'demo-user-4',
    username: 'sustainable_sam',
    full_name: 'Sam Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Environmental advocate | Slow fashion',
    points: 195,
    location: 'Portland, OR',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z'
  },
  {
    id: 'demo-user-5',
    username: 'style_savvy_lisa',
    full_name: 'Lisa Thompson',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Fashion blogger | Style consultant',
    points: 410,
    location: 'Los Angeles, CA',
    created_at: '2024-01-08T11:20:00Z',
    updated_at: '2024-01-08T11:20:00Z'
  }
];

// Demo items
export const demoItems: Item[] = [
  {
    id: 'demo-item-1',
    user_id: 'demo-user-1',
    title: 'Vintage Denim Jacket',
    description: 'Classic 90s denim jacket in excellent condition. Perfect for layering and adds instant cool factor to any outfit.',
    category: 'outerwear',
    size: 'm',
    condition: 'good',
    status: 'approved',
    point_value: 75,
    image_urls: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'demo-item-2',
    user_id: 'demo-user-2',
    title: 'Minimalist White Sneakers',
    description: 'Clean white sneakers, barely worn. Perfect for everyday style and goes with everything.',
    category: 'shoes',
    size: 'm',
    condition: 'like_new',
    status: 'approved',
    point_value: 60,
    image_urls: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-19T14:30:00Z',
    updated_at: '2024-01-19T14:30:00Z'
  },
  {
    id: 'demo-item-3',
    user_id: 'demo-user-3',
    title: 'Retro Floral Dress',
    description: 'Beautiful vintage floral dress from the 70s. Unique pattern and perfect for summer events.',
    category: 'dresses',
    size: 's',
    condition: 'good',
    status: 'approved',
    point_value: 85,
    image_urls: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-18T09:15:00Z'
  },
  {
    id: 'demo-item-4',
    user_id: 'demo-user-4',
    title: 'Organic Cotton T-Shirt',
    description: 'Soft organic cotton t-shirt in navy blue. Sustainable and comfortable for everyday wear.',
    category: 'tops',
    size: 'l',
    condition: 'new',
    status: 'approved',
    point_value: 45,
    image_urls: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-17T16:45:00Z',
    updated_at: '2024-01-17T16:45:00Z'
  },
  {
    id: 'demo-item-5',
    user_id: 'demo-user-5',
    title: 'Designer Handbag',
    description: 'High-quality leather handbag in excellent condition. Perfect for work or special occasions.',
    category: 'accessories',
    size: null,
    condition: 'like_new',
    status: 'approved',
    point_value: 120,
    image_urls: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-16T11:20:00Z',
    updated_at: '2024-01-16T11:20:00Z'
  },
  {
    id: 'demo-item-6',
    user_id: 'demo-user-1',
    title: 'High-Waisted Jeans',
    description: 'Classic high-waisted jeans in dark wash. Flattering fit and versatile for any occasion.',
    category: 'bottoms',
    size: 'm',
    condition: 'good',
    status: 'approved',
    point_value: 65,
    image_urls: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'demo-item-7',
    user_id: 'demo-user-2',
    title: 'Wool Sweater',
    description: 'Cozy wool sweater in forest green. Perfect for cold weather and adds warmth to any outfit.',
    category: 'tops',
    size: 'l',
    condition: 'good',
    status: 'approved',
    point_value: 55,
    image_urls: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z'
  },
  {
    id: 'demo-item-8',
    user_id: 'demo-user-3',
    title: 'Vintage Sunglasses',
    description: 'Classic aviator sunglasses in excellent condition. Timeless style that never goes out of fashion.',
    category: 'accessories',
    size: null,
    condition: 'like_new',
    status: 'approved',
    point_value: 40,
    image_urls: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  },
  {
    id: 'demo-item-9',
    user_id: 'demo-user-4',
    title: 'Leather Boots',
    description: 'Quality leather boots in brown. Durable and stylish for any season.',
    category: 'shoes',
    size: 'm',
    condition: 'good',
    status: 'approved',
    point_value: 90,
    image_urls: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z'
  },
  {
    id: 'demo-item-10',
    user_id: 'demo-user-5',
    title: 'Silk Blouse',
    description: 'Elegant silk blouse in cream color. Perfect for professional settings or special occasions.',
    category: 'tops',
    size: 's',
    condition: 'like_new',
    status: 'approved',
    point_value: 70,
    image_urls: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'
    ],
    is_available: true,
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z'
  }
];

// Demo swap requests
export const demoSwapRequests: SwapRequest[] = [
  {
    id: 'demo-swap-1',
    requester_id: 'demo-user-2',
    owner_id: 'demo-user-1',
    requested_item_id: 'demo-item-1',
    offered_item_id: 'demo-item-2',
    points_offered: 0,
    message: 'Love this vintage jacket! Would you be interested in swapping for my white sneakers?',
    status: 'pending',
    created_at: '2024-01-21T10:00:00Z',
    updated_at: '2024-01-21T10:00:00Z'
  },
  {
    id: 'demo-swap-2',
    requester_id: 'demo-user-3',
    owner_id: 'demo-user-4',
    requested_item_id: 'demo-item-4',
    offered_item_id: null,
    points_offered: 50,
    message: 'This organic cotton tee looks perfect! Would you accept 50 points for it?',
    status: 'accepted',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 'demo-swap-3',
    requester_id: 'demo-user-1',
    owner_id: 'demo-user-5',
    requested_item_id: 'demo-item-5',
    offered_item_id: 'demo-item-6',
    points_offered: 0,
    message: 'This handbag is exactly what I need! Would you swap for my high-waisted jeans?',
    status: 'pending',
    created_at: '2024-01-19T09:15:00Z',
    updated_at: '2024-01-19T09:15:00Z'
  },
  {
    id: 'demo-swap-4',
    requester_id: 'demo-user-4',
    owner_id: 'demo-user-2',
    requested_item_id: 'demo-item-2',
    offered_item_id: 'demo-item-9',
    points_offered: 0,
    message: 'Those sneakers are perfect! Would you trade for my leather boots?',
    status: 'completed',
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  },
  {
    id: 'demo-swap-5',
    requester_id: 'demo-user-5',
    owner_id: 'demo-user-3',
    requested_item_id: 'demo-item-3',
    offered_item_id: 'demo-item-10',
    points_offered: 0,
    message: 'This vintage dress is stunning! Would you swap for my silk blouse?',
    status: 'rejected',
    created_at: '2024-01-17T11:20:00Z',
    updated_at: '2024-01-17T11:20:00Z'
  }
];

// Helper function to get items with profiles
export const getItemsWithProfiles = () => {
  return demoItems.map(item => {
    const profile = demoUsers.find(user => user.id === item.user_id);
    return {
      ...item,
      profiles: profile
    };
  });
};

// Helper function to get swap requests with details
export const getSwapRequestsWithDetails = () => {
  return demoSwapRequests.map(swap => {
    const requester = demoUsers.find(user => user.id === swap.requester_id);
    const owner = demoUsers.find(user => user.id === swap.owner_id);
    const requestedItem = demoItems.find(item => item.id === swap.requested_item_id);
    const offeredItem = swap.offered_item_id ? demoItems.find(item => item.id === swap.offered_item_id) : null;
    
    return {
      ...swap,
      requester_profile: requester,
      owner_profile: owner,
      requested_item: requestedItem,
      offered_item: offeredItem
    };
  });
}; 