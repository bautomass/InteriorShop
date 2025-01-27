// lib/types/loyalty.ts

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface TierConfig {
  required: number;
  multiplier: number;
  color: string;
  benefits: string[];
}

export interface PointsRule {
  pointsPerDollar: number;
  minimumPurchase: number;
}

export interface BonusPoints {
  firstPurchase: number;
  birthday: number;
  reviewSubmission: number;
  referral: number;
}

export interface PointsReward {
  points: number;
  value: number;
  description: string;
}

// lib/constants/loyalty.ts

export const LOYALTY_CONFIG = {
  points: {
    perDollar: 1,
    minimumPurchase: 10
  },
  
  bonuses: {
    firstPurchase: 100,
    birthday: 200,
    reviewSubmission: 50,
    referral: 150
  },
  
  tiers: {
    bronze: {
      required: 0,
      multiplier: 1,
      color: '#CD7F32',
      benefits: [
        'Earn 1 point per $1 spent',
        'Birthday bonus points',
        'Access to member-only sales'
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
        'Exclusive seasonal gifts',
        'All Silver benefits'
      ]
    },
    platinum: {
      required: 10000,
      multiplier: 2,
      color: '#E5E4E2',
      benefits: [
        'Earn 2 points per $1 spent',
        'Dedicated concierge service',
        'Annual anniversary gift',
        'Private shopping events',
        'All Gold benefits'
      ]
    }
  },
  
  rewards: [
    {
      points: 500,
      value: 5,
      description: '$5 off your next purchase'
    },
    {
      points: 1000,
      value: 10,
      description: '$10 off your next purchase'
    },
    {
      points: 2000,
      value: 25,
      description: '$25 off your next purchase'
    },
    {
      points: 5000,
      value: 75,
      description: '$75 off your next purchase'
    },
    {
      points: 1500,
      value: 0,
      description: 'Free shipping on your next order'
    },
    {
      points: 3000,
      value: 0,
      description: 'Early access to next sale'
    }
  ]
};