// lib/shopify/loyalty/loyaltyUtils.ts
import { LOYALTY_CONFIG } from '@/lib/constants/loyalty';
import { LoyaltyInfo } from '@/types/account';
import { shopifyFetch } from '../client/customerAuth';
import { LoyaltyTier, TierConfig } from '../types/loyalty';
import { getCustomerMetafieldsQuery, updateCustomerMetafieldsQuery } from './mutations';

export const getLoyaltyInfo = async (customerAccessToken: string): Promise<LoyaltyInfo> => {
  const { body } = await shopifyFetch({
    query: getCustomerMetafieldsQuery,
    variables: { customerAccessToken }
  });

  const metafields = body.data?.customer?.metafields || [];
  const defaultLoyaltyInfo: LoyaltyInfo = {
    points: 0,
    tier: 'bronze',
    pointsToNextTier: LOYALTY_CONFIG.tiers.silver.required,
    totalSpent: 0,
    joinedAt: new Date().toISOString(),
    history: []
  };

  const parsedInfo = metafields.reduce((acc: Partial<LoyaltyInfo>, field: any) => {
    switch (field.key) {
      case 'loyalty_points':
        acc.points = parseInt(field.value, 10);
        break;
      case 'loyalty_tier':
        acc.tier = field.value as LoyaltyTier;
        break;
      case 'points_to_next_tier':
        acc.pointsToNextTier = parseInt(field.value, 10);
        break;
      case 'total_spent':
        acc.totalSpent = parseFloat(field.value);
        break;
      case 'joined_at':
        acc.joinedAt = field.value;
        break;
      case 'loyalty_history':
        try {
          acc.history = JSON.parse(field.value);
        } catch {
          acc.history = [];
        }
        break;
      case 'signup_points':
        acc.signupPoints = parseInt(field.value, 10);
        break;
    }
    return acc;
  }, {});

  return { ...defaultLoyaltyInfo, ...parsedInfo };
};

export async function updateLoyaltyMetafields(
  customerAccessToken: string,
  updates: Partial<{
    points: number;
    tier: string;
    pointsToNextTier: number;
    totalSpent: number;
    history: any[];
    joinedAt: string;
    signupPoints: number;
  }>
) {
  try {
    const metafields = [];

    if ('points' in updates) {
      metafields.push({
        namespace: "custom",
        key: 'loyalty_points',
        value: updates.points!.toString(),
        type: 'number_integer'
      });
    }

    if ('tier' in updates) {
      metafields.push({
        namespace: "custom",
        key: 'loyalty_tier',
        value: updates.tier!,
        type: 'single_line_text_field'
      });
    }

    if ('pointsToNextTier' in updates) {
      metafields.push({
        namespace: "custom",
        key: 'points_to_next_tier',
        value: updates.pointsToNextTier!.toString(),
        type: 'number_integer'
      });
    }

    if ('totalSpent' in updates) {
      metafields.push({
        namespace: "custom",
        key: 'total_spent',
        value: updates.totalSpent!.toString(),
        type: 'number_decimal'
      });
    }

    if ('history' in updates) {
      metafields.push({
        namespace: "custom",
        key: 'loyalty_history',
        value: JSON.stringify(updates.history),
        type: 'json'
      });
    }

    if ('joinedAt' in updates) {
      metafields.push({
        namespace: "custom",
        key: 'joined_at',
        value: updates.joinedAt!,
        type: 'date_time'
      });
    }

    if ('signupPoints' in updates) {
      metafields.push({
        namespace: "custom",
        key: 'signup_points',
        value: updates.signupPoints!.toString(),
        type: 'number_integer'
      });
    }

    const { body } = await shopifyFetch({
      query: updateCustomerMetafieldsQuery,
      variables: {
        customerAccessToken,
        customer: { 
          metafields
        }
      }
    });

    if (body.data?.customerUpdate?.customerUserErrors?.length > 0) {
      throw new Error(body.data.customerUpdate.customerUserErrors[0].message);
    }

    return body.data?.customerUpdate?.customer;
  } catch (error) {
    console.error('Error updating loyalty metafields:', error);
    throw error;
  }
}

export function calculateNextTier(currentPoints: number): {
  nextTier: keyof typeof LOYALTY_CONFIG.tiers | null;
  pointsNeeded: number;
} {
  const tiers = Object.entries(LOYALTY_CONFIG.tiers)
    .sort(([, a], [, b]) => a.required - b.required);

  for (let i = 0; i < tiers.length; i++) {
    const [tierName, tierConfig] = tiers[i] as [string, TierConfig];
    if (currentPoints < tierConfig.required) {
      return {
        nextTier: tierName as keyof typeof LOYALTY_CONFIG.tiers,
        pointsNeeded: tierConfig.required - currentPoints
      };
    }
  }

  return { nextTier: null, pointsNeeded: 0 };
}

export function getCurrentTier(points: number): keyof typeof LOYALTY_CONFIG.tiers {
  const tiers = Object.entries(LOYALTY_CONFIG.tiers)
    .sort(([, a], [, b]) => b.required - a.required);

  for (const [tierName, tierConfig] of tiers) {
    if (points >= tierConfig.required) {
      return tierName as keyof typeof LOYALTY_CONFIG.tiers;
    }
  }

  return 'bronze';
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-US').format(points);
}