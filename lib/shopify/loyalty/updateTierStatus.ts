// lib/shopify/loyalty/updateTierStatus.ts
import { LOYALTY_CONFIG, LoyaltyTier } from '@/lib/constants/loyalty';
import { getLoyaltyInfo, updateLoyaltyMetafields } from './loyaltyUtils';

interface TierUpdateResult {
  previousTier: LoyaltyTier;
  newTier: LoyaltyTier;
  pointsToNextTier: number;
  upgraded: boolean;
}

export async function updateTierStatus(
  customerAccessToken: string,
  currentPoints: number
): Promise<TierUpdateResult> {
  try {
    // Get current loyalty info
    const loyaltyInfo = await getLoyaltyInfo(customerAccessToken);
    const previousTier = loyaltyInfo.tier as LoyaltyTier;

    // Determine new tier based on points
    const tiers = Object.entries(LOYALTY_CONFIG.tiers)
      .sort(([, a], [, b]) => b.required - a.required);

    let newTier: LoyaltyTier = 'bronze';
    for (const [tierName, config] of tiers) {
      if (currentPoints >= config.required) {
        newTier = tierName as LoyaltyTier;
        break;
      }
    }

    // Calculate points needed for next tier
    let pointsToNextTier = 0;
    const nextTierEntry = Object.entries(LOYALTY_CONFIG.tiers)
      .sort(([, a], [, b]) => a.required - b.required)
      .find(([, config]) => config.required > currentPoints);

    if (nextTierEntry) {
      pointsToNextTier = nextTierEntry[1].required - currentPoints;
    }

    // Only update if tier has changed
    if (newTier !== previousTier) {
      // Add tier change to history
      const history = [
        {
          id: Date.now().toString(),
          type: 'earned',
          points: 0,
          description: `Upgraded to ${newTier} tier!`,
          date: new Date().toISOString()
        },
        ...loyaltyInfo.history
      ];

      // Update metafields
      await updateLoyaltyMetafields(customerAccessToken, {
        tier: newTier,
        pointsToNextTier,
        history
      });
    } else {
      // Update points to next tier even if tier hasn't changed
      await updateLoyaltyMetafields(customerAccessToken, {
        pointsToNextTier
      });
    }

    return {
      previousTier,
      newTier,
      pointsToNextTier,
      upgraded: newTier !== previousTier
    };
  } catch (error) {
    console.error('Error updating tier status:', error);
    throw error;
  }
}

// Helper function to check if a tier upgrade notification should be shown
export function shouldShowTierUpgradeNotification(
  previousTier: LoyaltyTier,
  newTier: LoyaltyTier
): boolean {
  const tierOrder: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum'];
  const previousIndex = tierOrder.indexOf(previousTier);
  const newIndex = tierOrder.indexOf(newTier);
  
  return newIndex > previousIndex;
}

// Helper function to get tier benefits difference
export function getTierBenefitsDifference(
  previousTier: LoyaltyTier,
  newTier: LoyaltyTier
): string[] {
  const previousBenefits = new Set(LOYALTY_CONFIG.tiers[previousTier].benefits);
  return LOYALTY_CONFIG.tiers[newTier].benefits.filter(
    benefit => !previousBenefits.has(benefit)
  );
}