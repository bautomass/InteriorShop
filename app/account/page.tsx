// app/account/page.tsx
'use client';

import LargeScreenNavBar from '@/components/layout/navbar/LargeScreenNavBar';
import { shopifyFetch } from '@/lib/shopify/client/customerAuth';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import { LoyaltyInfo, Order } from '@/types/account';
import { ChevronRight, Gift, Package, Settings, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const formatTierName = (tier: string | undefined): string => {
    if (!tier) return 'Bronze';
    return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  };

export default function AccountPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);

  const fetchAccountData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Fetch orders and loyalty info in parallel
      const [ordersRes, loyaltyRes] = await Promise.all([
        shopifyFetch({
          query: `
            query getCustomerOrders($customerAccessToken: String!) {
              customer(customerAccessToken: $customerAccessToken) {
                orders(first: 5) {
                  edges {
                    node {
                      id
                      orderNumber
                      processedAt
                      fulfillmentStatus
                      financialStatus
                      totalPrice {
                        amount
                        currencyCode
                      }
                      lineItems(first: 5) {
                        edges {
                          node {
                            title
                            quantity
                            variant {
                              price {
                                amount
                                currencyCode
                              }
                              image {
                                url
                                altText
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken')
          }
        }),
        shopifyFetch({
          query: `
            query getCustomerLoyalty($customerAccessToken: String!) {
              customer(customerAccessToken: $customerAccessToken) {
                metafields(first: 10) {
                  edges {
                    node {
                      key
                      value
                    }
                  }
                }
              }
            }
          `,
          variables: {
            customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken')
          }
        })
      ]);

      // Process orders data
      const orders = ordersRes.body.data.customer.orders.edges.map(
        ({ node }: any) => ({
          id: node.id,
          orderNumber: node.orderNumber,
          processedAt: node.processedAt,
          fulfillmentStatus: node.fulfillmentStatus,
          financialStatus: node.financialStatus,
          totalPrice: node.totalPrice,
          lineItems: node.lineItems.edges.map(({ node: item }: any) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.variant.price,
            image: item.variant.image
          }))
        })
      );

      // Process loyalty data
      const loyaltyMetafields = loyaltyRes.body.data.customer.metafields.edges.reduce(
        (acc: any, { node }: any) => {
          acc[node.key] = node.value;
          return acc;
        },
        {}
      );

      const loyaltyInfo: LoyaltyInfo = {
        points: parseInt(loyaltyMetafields.loyalty_points || '0'),
        tier: loyaltyMetafields.loyalty_tier || 'bronze',
        pointsToNextTier: parseInt(loyaltyMetafields.points_to_next_tier || '1000'),
        totalSpent: parseFloat(loyaltyMetafields.total_spent || '0'),
        joinedAt: loyaltyMetafields.joined_at || new Date().toISOString(),
        history: JSON.parse(loyaltyMetafields.loyalty_history || '[]')
      };

      setRecentOrders(orders);
      setLoyaltyInfo(loyaltyInfo);
    } catch (error) {
      console.error('Error fetching account data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9e896c]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <LargeScreenNavBar />
      {/* Welcome Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.firstName || 'Valued Customer'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your account today.
          </p>
        </div>
        <Link
          href="/account/settings"
          className="text-sm text-[#9e896c] hover:text-[#8a775d] font-medium"
        >
          Edit Profile
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickStatCard
          title="Loyalty Points"
          value={loyaltyInfo?.points.toString() || '0'}
          subtitle="Available Points"
          icon={Gift}
          href="/account/points"
        />
        <QuickStatCard
          title="Recent Orders"
          value={recentOrders.length.toString()}
          subtitle="Last 30 days"
          icon={Package}
          href="/account/orders"
        />
        <QuickStatCard
        title={formatTierName(loyaltyInfo?.tier)}
        value="Member"
        subtitle="Current Tier"
        icon={ShoppingBag}
        href="/account/points"
        />
        <QuickStatCard
          title="Total Spent"
          value={formatPrice(loyaltyInfo?.totalSpent || 0)}
          subtitle="Lifetime"
          icon={Settings}
          href="/account/settings"
        />
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm text-[#9e896c] hover:text-[#8a775d] font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} formatPrice={formatPrice} />
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No orders yet. Start shopping to earn loyalty points!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  href 
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-lg border border-gray-200 
                 hover:border-[#9e896c] transition-colors duration-200"
    >
      <div className="flex items-start">
        <div className="p-2 bg-[#9e896c]/10 rounded-lg">
          <Icon className="w-6 h-6 text-[#9e896c]" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

function OrderCard({ 
  order,
  formatPrice 
}: { 
  order: Order;
  formatPrice: (amount: number) => string;
}) {
  return (
    <Link
      href={`/account/orders/${order.orderNumber}`}
      className="block p-4 bg-white rounded-lg border border-gray-200 
                 hover:border-[#9e896c] transition-colors duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Order #{order.orderNumber}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(order.processedAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(parseFloat(order.totalPrice.amount))}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {order.fulfillmentStatus.charAt(0).toUpperCase() + 
             order.fulfillmentStatus.slice(1).toLowerCase()}
          </p>
        </div>
      </div>
    </Link>
  );
}