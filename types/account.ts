// types/account.ts

export interface OrderVariant {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText: string;
    };
  }
  
  export interface OrderItem {
    title: string;
    quantity: number;
    variant: OrderVariant;
  }
  
  export interface Order {
    id: string;
    orderNumber: number;
    processedAt: string;
    fulfillmentStatus: string;
    financialStatus: string;
    totalPrice: {
      amount: string;
      currencyCode: string;
    };
    subtotalPrice: {
      amount: string;
      currencyCode: string;
    };
    shippingPrice: {
      amount: string;
      currencyCode: string;
    };
    lineItems: OrderItem[];
  }
  
  export interface CustomerAddress {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    zip: string;
    country: string;
    phone?: string;
    isDefault: boolean;
  }
  
  export interface LoyaltyInfo {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    pointsToNextTier: number;
    totalSpent: number;
    joinedAt: string;
    history: {
      id: string;
      type: 'earned' | 'redeemed';
      points: number;
      description: string;
      date: string;
      orderId?: string;
    }[];
  }