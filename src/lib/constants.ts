
export const ITEM_CATEGORIES = [
  'tops',
  'bottoms', 
  'dresses',
  'outerwear',
  'shoes',
  'accessories'
] as const;

export const CLOTHING_SIZES = [
  'xs',
  's', 
  'm',
  'l',
  'xl',
  'xxl',
  'xxxl'
] as const;

export const ITEM_CONDITIONS = [
  'new',
  'like_new',
  'good', 
  'fair',
  'worn'
] as const;

export const ITEM_STATUS = [
  'pending',
  'approved',
  'rejected',
  'swapped'
] as const;

export const SWAP_STATUS = [
  'pending',
  'accepted',
  'rejected', 
  'completed',
  'cancelled'
] as const;

export const POINTS_CONFIG = {
  DEFAULT_ITEM_VALUE: 50,
  STARTING_POINTS: 100,
  SWAP_COMPLETION_BONUS: 10,
} as const;
