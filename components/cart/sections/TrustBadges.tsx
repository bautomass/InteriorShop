// components/cart/sections/TrustBadges.tsx
import { Lock, RotateCcw, Truck } from 'lucide-react';

const TRUST_BADGES = [
  {
    title: 'Free Shipping',
    description: 'On all orders',
    icon: Truck
  },
  {
    title: 'Secure Payments',
    description: 'SSL encryption',
    icon: Lock
  },
  {
    title: 'Easy Returns',
    description: '30 day returns',
    icon: RotateCcw
  }
] as const;

export default function TrustBadges() {
  return (
    <>
      {TRUST_BADGES.map((badge) => (
        <div 
          key={badge.title}
          className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-[#6B5E4C]/5 flex items-center space-x-4"
        >
          <div className="flex-shrink-0 text-[#6B5E4C]">
            <badge.icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-[#6B5E4C] font-medium">{badge.title}</h3>
            <p className="text-sm text-[#8C7E6A]">{badge.description}</p>
          </div>
        </div>
      ))}
    </>
  );
}