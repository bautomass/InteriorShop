// lib/constants/loyalty.ts
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type RewardType = 'discount' | 'shipping' | 'access' | 'service';

export interface LoyaltyReward {
  id: string;
  points: number;
  value: number;
  description: string;
  type?: RewardType;
}

export const LOYALTY_CONFIG = {
  points: {
    perDollar: 1, // 1 point per $1 spent
    minimumPurchase: 10 // Minimum $10 purchase to earn points
  },
  
  bonuses: {
    signup: 100,           // Points for signing up
    firstPurchase: 100,    // Additional bonus for first purchase
    birthday: 200,         // Birthday bonus
    reviewSubmission: 50,  // Points for product review
    referral: 150,         // Points for referring a friend
    socialShare: 25        // Points for social media share
  },
  
  tiers: {
    bronze: {
      required: 0,
      multiplier: 1,
      color: '#CD7F32',
      benefits: [
        'Earn 1 point per $1 spent',
        'Birthday bonus points',
        'Access to member-only sales',
        'Special seasonal offers'
      ]
    },
    silver: {
      required: 1000,
      multiplier: 1.25,
      color: '#C0C0C0',
      benefits: [
        'Earn 1.25 points per $1 spent',
        'Free shipping on orders over $50',
        'Early access to sales',
        'Exclusive seasonal gifts',
        'All Bronze benefits'
      ]
    },
    gold: {
      required: 5000,
      multiplier: 1.5,
      color: '#FFD700',
      benefits: [
        'Earn 1.5 points per $1 spent',
        'Free shipping on all orders',
        'Priority customer service',
        'Double points days',
        'Birthday double points',
        'All Silver benefits'
      ]
    },
    platinum: {
      required: 10000,
      multiplier: 2,
      color: '#E5E4E2',
      benefits: [
        'Earn 2 points per $1 spent',
        'VIP customer service',
        'Exclusive early access to new collections',
        'Annual loyalty gift',
        'Private shopping events',
        'Custom interior design consultation',
        'All Gold benefits'
      ]
    }
  },
  
  rewards: [
    {
      id: 'discount-5',
      points: 500,
      value: 5,
      description: '$5 off your next purchase',
      type: 'discount'
    },
    {
      id: 'discount-10',
      points: 1000,
      value: 10,
      description: '$10 off your next purchase',
      type: 'discount'
    },
    {
      id: 'discount-25',
      points: 2000,
      value: 25,
      description: '$25 off your next purchase',
      type: 'discount'
    },
    {
      id: 'discount-50',
      points: 3000,
      value: 50,
      description: '$50 off your next purchase',
      type: 'discount'
    },
    {
      id: 'discount-100',
      points: 5000,
      value: 100,
      description: '$100 off your next purchase',
      type: 'discount'
    },
    {
      id: 'free-shipping',
      points: 1500,
      value: 0,
      description: 'Free shipping on your next order',
      type: 'shipping'
    },
    {
      id: 'early-access',
      points: 2500,
      value: 0,
      description: 'Early access to next sale',
      type: 'access'
    },
    {
      id: 'design-consultation',
      points: 7500,
      value: 0,
      description: 'Free interior design consultation',
      type: 'service'
    }
  ],

  events: {
    blackFriday: 2,      // Double points during Black Friday
    holidays: 1.5,       // 1.5x points during holiday season
    memberDay: 3         // Triple points on member days
  },

  expiration: {
    days: 365,           // Points expire after 1 year
    minimumPoints: 100   // Minimum points before expiration applies
  },

  referral: {
    pointsForReferrer: 150,     // Points earned by the referrer
    pointsForReferred: 100,     // Points earned by the referred friend
    minimumPurchaseAmount: 50   // Minimum purchase amount for referral points
  }
} as const;

// Helper functions
export const calculatePointsForPurchase = (
  amount: number,
  tier: LoyaltyTier,
  isSpecialEvent?: boolean
): number => {
  if (amount < LOYALTY_CONFIG.points.minimumPurchase) return 0;
  
  const basePoints = Math.floor(amount) * LOYALTY_CONFIG.points.perDollar;
  const tierMultiplier = LOYALTY_CONFIG.tiers[tier].multiplier;
  const eventMultiplier = isSpecialEvent ? LOYALTY_CONFIG.events.memberDay : 1;
  
  return Math.floor(basePoints * tierMultiplier * eventMultiplier);
};

export const getNextTier = (currentTier: LoyaltyTier): LoyaltyTier | null => {
  const tiers: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex === tiers.length - 1) return null;
  return tiers[currentIndex + 1] as LoyaltyTier;
};

export const getPointsToNextTier = (
  currentPoints: number,
  currentTier: LoyaltyTier
): number => {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 0;
  
  return Math.max(0, LOYALTY_CONFIG.tiers[nextTier].required - currentPoints);
};

export const getTierProgress = (
  points: number,
  currentTier: LoyaltyTier
): number => {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 100;

  const currentTierPoints = LOYALTY_CONFIG.tiers[currentTier].required;
  const nextTierPoints = LOYALTY_CONFIG.tiers[nextTier].required;
  const progress = ((points - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
};