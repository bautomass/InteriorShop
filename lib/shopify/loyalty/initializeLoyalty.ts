// lib/shopify/loyalty/initializeLoyalty.ts
import { LOYALTY_CONFIG } from '@/lib/constants/loyalty';
import { updateLoyaltyMetafields } from './loyaltyUtils';

export async function initializeCustomerLoyalty(customerAccessToken: string, customerId: string) {
  try {
    const response = await fetch('/api/init-loyalty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initialize loyalty');
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing customer loyalty:', error);
    throw error;
  }
}

export async function addWelcomePointsToExisting(customerAccessToken: string) {
  try {
    const signupBonus = LOYALTY_CONFIG.bonuses.signup;
    
    await updateLoyaltyMetafields(customerAccessToken, {
      points: signupBonus,
      tier: 'bronze',
      pointsToNextTier: LOYALTY_CONFIG.tiers.silver.required - signupBonus,
      totalSpent: 0,
      joinedAt: new Date().toISOString(),
      history: [{
        id: Date.now().toString(),
        type: 'earned',
        points: signupBonus,
        description: 'Welcome bonus for joining our loyalty program!',
        date: new Date().toISOString()
      }]
    });

    return {
      success: true,
      signupBonus
    };
  } catch (error) {
    console.error('Error adding welcome points:', error);
    throw error;
  }
}