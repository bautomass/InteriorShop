// lib/shopify/loyalty/calculatePoints.ts

import { LOYALTY_CONFIG } from '@/lib/constants/loyalty';
import { getCurrentTier, getLoyaltyInfo, updateLoyaltyMetafields } from './loyaltyUtils';

interface CalculatePointsParams {
  orderAmount: number;
  customerAccessToken: string;
  isSpecialEvent?: boolean;
  eventMultiplier?: number;
}

export async function calculateAndAwardPoints({
  orderAmount,
  customerAccessToken,
  isSpecialEvent = false,
  eventMultiplier = 1
}: CalculatePointsParams) {
  try {
    // Get current loyalty info
    const loyaltyInfo = await getLoyaltyInfo(customerAccessToken);
    
    // Calculate base points (1 point per dollar spent)
    const basePoints = Math.floor(orderAmount * LOYALTY_CONFIG.points.perDollar);
    
    // Apply tier multiplier
    const tierMultiplier = LOYALTY_CONFIG.tiers[loyaltyInfo.tier].multiplier;
    
    // Apply event multiplier if applicable
    const finalMultiplier = isSpecialEvent ? eventMultiplier : 1;
    
    // Calculate final points
    const pointsEarned = Math.floor(basePoints * tierMultiplier * finalMultiplier);
    
    // Update total points and spending
    const newPoints = loyaltyInfo.points + pointsEarned;
    const newTotalSpent = loyaltyInfo.totalSpent + orderAmount;
    
    // Check if tier needs updating
    const newTier = getCurrentTier(newPoints);
    
    // Add to history
    const history = [
      {
        id: Date.now().toString(),
        type: 'earned',
        points: pointsEarned,
        description: `Points earned from purchase${isSpecialEvent ? ' (Special Event)' : ''}`,
        date: new Date().toISOString()
      },
      ...loyaltyInfo.history
    ];

    // Update all values
    await updateLoyaltyMetafields(customerAccessToken, {
      points: newPoints,
      tier: newTier,
      totalSpent: newTotalSpent,
      history
    });

    return {
      pointsEarned,
      newTotalPoints: newPoints,
      newTier,
      previousTier: loyaltyInfo.tier
    };
  } catch (error) {
    console.error('Error calculating and awarding points:', error);
    throw error;
  }
}