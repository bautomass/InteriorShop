// app/account/layout.tsx
'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Gift, Package, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const navigation = [
    {
      name: 'Overview',
      href: '/account',
      icon: User,
      exact: true
    },
    {
      name: 'Orders',
      href: '/account/orders',
      icon: Package
    },
    {
      name: 'Loyalty Points',
      href: '/account/points',
      icon: Gift
    },
    {
      name: 'Settings',
      href: '/account/settings',
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 mt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium 
                              transition-colors duration-200
                              ${isActive 
                                ? 'bg-[#9e896c] text-white' 
                                : 'text-neutral-600 hover:bg-neutral-100'
                              }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}