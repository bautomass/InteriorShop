// lib/shopify/loyalty/loyaltyUtils.ts

import { LoyaltyInfo } from '@/types/account';
import { LOYALTY_CONFIG } from '@/lib/constants/loyalty';
import { shopifyFetch } from '../client/customerAuth';
import { getCustomerMetafieldsQuery, updateCustomerMetafieldsQuery } from './mutations';
import { TierConfig } from '../types/loyalty';

export async function getLoyaltyInfo(customerAccessToken: string): Promise<LoyaltyInfo> {
  try {
    const { body } = await shopifyFetch({
      query: getCustomerMetafieldsQuery,
      variables: { customerAccessToken }
    });

    const metafields = body.data.customer.metafields.edges.reduce(
      (acc: any, { node }: any) => {
        acc[node.key] = node.value;
        return acc;
      },
      {}
    );

    return {
      points: parseInt(metafields.loyalty_points || '0'),
      tier: metafields.loyalty_tier || 'bronze',
      pointsToNextTier: parseInt(metafields.points_to_next_tier || '1000'),
      totalSpent: parseFloat(metafields.total_spent || '0'),
      joinedAt: metafields.joined_at || new Date().toISOString(),
      history: JSON.parse(metafields.loyalty_history || '[]')
    };
  } catch (error) {
    console.error('Error fetching loyalty info:', error);
    throw error;
  }
}

export async function updateLoyaltyMetafields(
  customerAccessToken: string,
  updates: Partial<{
    points: number;
    tier: string;
    pointsToNextTier: number;
    totalSpent: number;
    history: any[];
  }>
) {
  try {
    const metafields = [];

    if ('points' in updates) {
      metafields.push({
        key: 'loyalty_points',
        value: updates.points!.toString(),
        type: 'number_integer'
      });
    }

    if ('tier' in updates) {
      metafields.push({
        key: 'loyalty_tier',
        value: updates.tier!,
        type: 'single_line_text_field'
      });
    }

    if ('pointsToNextTier' in updates) {
      metafields.push({
        key: 'points_to_next_tier',
        value: updates.pointsToNextTier!.toString(),
        type: 'number_integer'
      });
    }

    if ('totalSpent' in updates) {
      metafields.push({
        key: 'total_spent',
        value: updates.totalSpent!.toString(),
        type: 'number_decimal'
      });
    }

    if ('history' in updates) {
      metafields.push({
        key: 'loyalty_history',
        value: JSON.stringify(updates.history),
        type: 'json'
      });
    }

    const { body } = await shopifyFetch({
      query: updateCustomerMetafieldsQuery,
      variables: {
        customerAccessToken,
        input: { metafields }
      }
    });

    if (body.data.customerUpdate.customerUserErrors.length > 0) {
      throw new Error(body.data.customerUpdate.customerUserErrors[0].message);
    }

    return body.data.customerUpdate.customer;
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