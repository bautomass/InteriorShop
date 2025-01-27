// lib/shopify/loyalty/handleRedemption.ts

import { LOYALTY_CONFIG } from '@/lib/constants/loyalty';
import { getLoyaltyInfo, updateLoyaltyMetafields } from './loyaltyUtils';

export interface RedeemPointsParams {
  customerAccessToken: string;
  rewardId: string;
  points: number;
  description: string;
}

export async function redeemPoints({
  customerAccessToken,
  rewardId,
  points,
  description
}: RedeemPointsParams) {
  try {
    // Get current loyalty info
    const loyaltyInfo = await getLoyaltyInfo(customerAccessToken);
    
    // Verify sufficient points
    if (loyaltyInfo.points < points) {
      throw new Error('Insufficient points for redemption');
    }
    
    // Find reward
    const reward = LOYALTY_CONFIG.rewards.find(r => r.id === rewardId);
    if (!reward) {
      throw new Error('Invalid reward selected');
    }
    
    // Calculate new points balance
    const newPoints = loyaltyInfo.points - points;
    
    // Add to history
    const history = [
      {
        id: Date.now().toString(),
        type: 'redeemed',
        points: points,
        description: description || `Redeemed ${reward.description}`,
        date: new Date().toISOString()
      },
      ...loyaltyInfo.history
    ];

    // Update points and history
    await updateLoyaltyMetafields(customerAccessToken, {
      points: newPoints,
      history
    });

    return {
      success: true,
      newPointsBalance: newPoints,
      reward
    };
  } catch (error) {
    console.error('Error redeeming points:', error);
    throw error;
  }
}

export async function createDiscountCode(
  customerAccessToken: string,
  rewardValue: number
): Promise<string> {
  // This would integrate with Shopify's discount code API
  // For now, return a mock discount code
  return `LOYALTY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}