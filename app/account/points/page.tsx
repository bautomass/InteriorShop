'use client';

import { LOYALTY_CONFIG } from '@/lib/constants/loyalty';
import { shopifyFetch } from '@/lib/shopify/client/customerAuth';
import { redeemPoints } from '@/lib/shopify/loyalty/handleRedemption';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import { LoyaltyInfo } from '@/types/account';
import { motion } from 'framer-motion';
import { Award, CircleDollarSign, Gift, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import LargeScreenNavBar from '@/components/layout/navbar/LargeScreenNavBar';
export default function PointsPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'rewards' | 'history' | 'tiers'>('rewards');
  const [isLoading, setIsLoading] = useState(true);
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);

  const fetchLoyaltyData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { body } = await shopifyFetch({
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
      });

      const metafields = body.data.customer.metafields.edges.reduce(
        (acc: any, { node }: any) => {
          acc[node.key] = node.value;
          return acc;
        },
        {}
      );

      setLoyaltyInfo({
        points: parseInt(metafields.loyalty_points || '0'),
        tier: metafields.loyalty_tier || 'bronze',
        pointsToNextTier: parseInt(metafields.points_to_next_tier || '1000'),
        totalSpent: parseFloat(metafields.total_spent || '0'),
        joinedAt: metafields.joined_at || new Date().toISOString(),
        history: JSON.parse(metafields.loyalty_history || '[]')
      });
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLoyaltyData();
  }, [fetchLoyaltyData]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9e896c]" />
      </div>
    );
  }

  if (!loyaltyInfo) return null;

  return (
    <div className="p-6">
      <LargeScreenNavBar />

      {/* Header & Points Overview */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Loyalty Program</h1>
        <p className="mt-1 text-sm text-gray-500">
          Earn points with every purchase and unlock exclusive rewards.
        </p>
      </div>

      {/* Points Card */}
      <div className="bg-[#9e896c] text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Available Points</p>
            <p className="text-4xl font-bold mt-1">{loyaltyInfo.points}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white/80">Current Tier</p>
            <p className="text-2xl font-semibold mt-1 capitalize">
              {loyaltyInfo.tier}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {(['rewards', 'history', 'tiers'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md
                      ${activeTab === tab 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'rewards' && (
          <RewardsTab points={loyaltyInfo.points} />
        )}
        {activeTab === 'history' && (
          <HistoryTab history={loyaltyInfo.history} />
        )}
        {activeTab === 'tiers' && (
          <TiersTab 
            currentTier={loyaltyInfo.tier} 
            points={loyaltyInfo.points}
          />
        )}
      </div>
    </div>
  );
}

function RewardsTab({ points }: { points: number }) {
  const handleRedeemReward = async (rewardPoints: number, reward: { id: string; description: string }) => {
    if (points < rewardPoints) return;
    
    try {
      await redeemPoints({
        customerAccessToken: localStorage.getItem('shopifyCustomerAccessToken') || '',
        rewardId: parseInt(reward.id),
        points: rewardPoints,
        description: reward.description
      });
      console.log('Redeeming reward:', rewardPoints);
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {LOYALTY_CONFIG.rewards.map((reward, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-lg border ${
            points >= reward.points
              ? 'border-[#9e896c] bg-[#9e896c]/5'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {reward.description}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {reward.points} points
              </p>
            </div>
            <button
              onClick={() => handleRedeemReward(reward.points, reward)}
              disabled={points < reward.points}
              className={`px-4 py-2 rounded-lg text-sm font-medium
                        ${points >= reward.points
                          ? 'bg-[#9e896c] text-white hover:bg-[#8a775d]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        } transition-colors`}
            >
              {points >= reward.points ? 'Redeem' : 'Locked'}
            </button>
          </div>
          {points < reward.points && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                You need {reward.points - points} more points to unlock this reward
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-[#9e896c] rounded-full transition-all duration-500"
                  style={{ width: `${(points / reward.points) * 100}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function HistoryTab({ 
  history 
}: { 
  history: LoyaltyInfo['history']
}) {
  return (
    <div className="space-y-4">
      {history.length > 0 ? (
        history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${
                item.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {item.type === 'earned' ? (
                  <Gift className="w-4 h-4 text-green-600" />
                ) : (
                  <CircleDollarSign className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.description}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
            <p className={`text-sm font-medium ${
              item.type === 'earned' ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.type === 'earned' ? '+' : '-'}{item.points} points
            </p>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">
          No points history yet. Start shopping to earn points!
        </p>
      )}
    </div>
  );
}

function TiersTab({ 
  currentTier,
  points 
}: { 
  currentTier: LoyaltyInfo['tier'];
  points: number;
}) {
  return (
    <div className="space-y-6">
      {Object.entries(LOYALTY_CONFIG.tiers).map(([tier, config], index) => {
        const isCurrentTier = tier === currentTier;
        const isUnlocked = points >= config.required;

        return (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${
              isCurrentTier
                ? 'border-[#9e896c] bg-[#9e896c]/5'
                : isUnlocked
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {tier} Tier
                  </h3>
                  {isCurrentTier && (
                    <span className="px-2 py-1 text-xs font-medium text-[#9e896c] bg-[#9e896c]/10 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {config.required} points required
                </p>
              </div>
              <div className={`p-2 rounded-full ${
                isUnlocked ? 'bg-[#9e896c]/10' : 'bg-gray-100'
              }`}>
                {isUnlocked ? (
                  <Award className="w-5 h-5 text-[#9e896c]" />
                ) : (
                  <Star className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {config.benefits.map((benefit: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isUnlocked ? 'bg-[#9e896c]' : 'bg-gray-300'
                  }`} />
                  <p className={`text-sm ${
                    isUnlocked ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}