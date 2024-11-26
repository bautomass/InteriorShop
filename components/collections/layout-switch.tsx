// components/collections/layout-switch.tsx
'use client';

import { motion } from 'framer-motion';
import { Grid, LayoutList, Table2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

type LayoutType = 'grid' | 'list' | 'table';

interface LayoutOption {
  value: LayoutType;
  icon: typeof Grid;
  label: string;
}

const layoutOptions: LayoutOption[] = [
  { value: 'grid', icon: Grid, label: 'Grid view' },
  { value: 'list', icon: LayoutList, label: 'List view' },
  { value: 'table', icon: Table2, label: 'Table view' }
];

export function LayoutSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLayout = (searchParams.get('layout') as LayoutType) || 'grid';

  const handleLayoutChange = useCallback(
    (layout: LayoutType) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('layout', layout);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Initialize layout if not set
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has('layout')) {
      handleLayoutChange('grid');
    }
  }, [searchParams, handleLayoutChange]);

  return (
    <div className="relative flex items-center gap-2 rounded-lg border border-primary-200 bg-white/80 p-1 backdrop-blur-sm dark:border-primary-700 dark:bg-primary-800/80">
      {layoutOptions.map((option) => {
        const isActive = currentLayout === option.value;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.value}
            onClick={() => handleLayoutChange(option.value)}
            className={`relative rounded-md p-2 transition-colors ${
              isActive
                ? 'text-accent-500'
                : 'text-primary-400 hover:text-primary-900 dark:hover:text-primary-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={option.label}
            title={option.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeLayout"
                className="absolute inset-0 rounded-md bg-accent-500/10"
                initial={false}
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6
                }}
              />
            )}
            <Icon className="relative h-5 w-5" />
          </motion.button>
        );
      })}
    </div>
  );
}
