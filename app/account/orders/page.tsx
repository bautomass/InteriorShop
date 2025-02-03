// app/account/orders/page.tsx
'use client';

import { shopifyFetch } from '@/lib/shopify/client/customerAuth';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import { Order } from '@/types/account';
import { Package, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
export default function OrdersPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { body } = await shopifyFetch({
        query: `
          query getCustomerOrders($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              orders(first: 50) {
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
                    subtotalPrice {
                      amount
                      currencyCode
                    }
                    shippingPrice: totalShippingPrice {
                      amount
                      currencyCode
                    }
                    lineItems(first: 50) {
                      edges {
                        node {
                          title
                          quantity
                          variant {
                            id
                            title
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
      });

      const orders = body.data.customer.orders.edges.map(({ node }: any) => ({
        id: node.id,
        orderNumber: node.orderNumber,
        processedAt: node.processedAt,
        fulfillmentStatus: node.fulfillmentStatus,
        financialStatus: node.financialStatus,
        totalPrice: node.totalPrice,
        subtotalPrice: node.subtotalPrice,
        shippingPrice: node.shippingPrice,
        lineItems: node.lineItems.edges.map(({ node: item }: any) => ({
          title: item.title,
          quantity: item.quantity,
          variant: {
            id: item.variant.id,
            title: item.variant.title,
            price: item.variant.price,
            image: item.variant.image
          }
        }))
      }));

      setOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toString().includes(searchQuery.toLowerCase()) ||
    formatDate(order.processedAt).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9e896c]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and track all your orders
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by number or date..."
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-[#9e896c] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              formatPrice={formatPrice} 
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {orders.length === 0 
                ? "You haven't placed any orders yet."
                : "No orders match your search criteria."}
            </p>
            {orders.length === 0 && (
              <div className="mt-6">
                <Link
                  href="/collections/all"
                  className="inline-flex items-center px-4 py-2 border border-transparent 
                           shadow-sm text-sm font-medium rounded-md text-white 
                           bg-[#9e896c] hover:bg-[#8a775d]"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ 
  order, 
  formatPrice 
}: { 
  order: Order;
  formatPrice: (amount: number) => string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    FULFILLED: 'bg-green-100 text-green-800',
    UNFULFILLED: 'bg-yellow-100 text-yellow-800',
    PARTIALLY_FULFILLED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    UNPAID: 'bg-red-100 text-red-800',
    PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Order Header */}
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
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
            <div className="flex gap-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full
                ${statusColors[order.fulfillmentStatus as keyof typeof statusColors]}`}>
                {order.fulfillmentStatus.replace(/_/g, ' ')}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full
                ${statusColors[order.financialStatus as keyof typeof statusColors]}`}>
                {order.financialStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Line Items */}
          <div className="divide-y divide-gray-200">
            {order.lineItems.map((item, index) => (
              <div key={index} className="p-4 flex gap-4">
                {item.variant?.image && (
                  <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.variant.image.url}
                      alt={item.variant.image.altText || item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                  {item.variant?.title !== 'Default Title' && (
                    <p className="text-sm text-gray-500">{item.variant?.title}</p>
                  )}
                  <div className="mt-1 flex justify-between">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(parseFloat(item.variant?.price.amount || '0') * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(parseFloat(order.subtotalPrice.amount))}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{formatPrice(parseFloat(order.shippingPrice.amount))}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(parseFloat(order.totalPrice.amount))}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}