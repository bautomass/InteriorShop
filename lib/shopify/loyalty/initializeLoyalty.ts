// lib/shopify/loyalty/initializeLoyalty.ts

import { updateLoyaltyMetafields } from './loyaltyUtils';

export async function initializeCustomerLoyalty(customerAccessToken: string) {
  try {
    // Initialize with default values
    await updateLoyaltyMetafields(customerAccessToken, {
      points: 0,
      tier: 'bronze',
      pointsToNextTier: 1000,
      totalSpent: 0,
      history: [{
        id: Date.now().toString(),
        type: 'earned',
        points: 100,
        description: 'Welcome bonus',
        date: new Date().toISOString()
      }]
    });

    return true;
  } catch (error) {
    console.error('Error initializing customer loyalty:', error);
    throw error;
  }
}