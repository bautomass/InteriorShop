'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createUrl } from 'lib/utils';
import { ArrowRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { memo, useState } from 'react';

// Types
interface MobileMenuProps {
  navBoxes: Array<{
    id: number;
    label: string;
    icon: React.ElementType;
    color: {
      bg: string;
      border: string;
      text: string;
      hover: string;
    };
  }>;
}

const MobileMenu = memo(({ navBoxes }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleMenuToggle = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      if (!isOpen) {
        setIsOpen(true);
      } else {
        // Allow time for hamburger animation before closing
        setTimeout(() => setIsOpen(false), 200);
      }
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create search URL using your existing utility
    const newParams = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      newParams.set('q', searchQuery);
    } else {
      newParams.delete('q');
    }
    
    window.location.href = createUrl('/search', newParams);
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Button */}
      <div className="border-t border-primary-200 bg-primary-50/80 backdrop-blur-md dark:border-primary-700 dark:bg-primary-900/80 xl:hidden">
        <div className="px-4 py-3">
          <button
            onClick={handleMenuToggle}
            disabled={isAnimating}
            className="flex items-center gap-3 w-full rounded-lg border border-primary-200 dark:border-primary-700 bg-white/50 dark:bg-primary-800/50 p-3 text-primary-900 dark:text-primary-50 transition-all hover:bg-white/80 dark:hover:bg-primary-800/80"
          >
            <div className="relative w-6 h-5">
              <motion.span
                className="absolute left-0 top-0 h-0.5 w-6 bg-current rounded-full"
                initial={false}
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 10 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-[10px] h-0.5 w-6 bg-current rounded-full"
                initial={false}
                animate={{
                  opacity: isOpen ? 0 : 1,
                  x: isOpen ? 20 : 0
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 bottom-0 h-0.5 w-6 bg-current rounded-full"
                initial={false}
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -10 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="font-medium text-base">Menu</span>
            <span className="ml-auto text-xs text-primary-500 dark:text-primary-400">
              {navBoxes.length} categories
            </span>
          </button>
        </div>
      </div>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onAnimationComplete={() => setIsAnimating(false)}
            className="fixed inset-0 z-50 bg-white dark:bg-primary-900"
          >
            <div className="relative h-full flex flex-col">
              {/* Menu Header */}
              <div className="border-b border-primary-200 dark:border-primary-700 sticky top-0 bg-white/80 dark:bg-primary-900/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4 p-4">
                  <motion.h2 
                    className="text-2xl font-black text-primary-900 dark:text-primary-50 tracking-tight"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        delay: 0.2,
                        duration: 0.3
                      }
                    }}
                  >
                    <span className="relative">
                      Menu
                      <motion.span
                        className="absolute -bottom-1 left-0 h-0.5 w-full bg-accent-500"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      />
                    </span>
                  </motion.h2>

                  {/* Search Form */}
                  <form 
                    onSubmit={handleSearch}
                    className="flex-1 relative"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-lg border border-primary-200 dark:border-primary-700 bg-white/50 dark:bg-primary-800/50 py-2 px-4 text-primary-900 dark:text-primary-50 placeholder-primary-500 dark:placeholder-primary-400"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-500 dark:text-primary-400"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </form>

                  {/* Enhanced Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-3 bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50 hover:bg-primary-200 dark:hover:bg-primary-700 transition-all"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <motion.div 
                className="flex-1 overflow-auto px-4 pt-4 pb-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                <div className="grid gap-2 pb-6">
                  {navBoxes.map((box) => {
                    const Icon = box.icon;
                    return (
                      <motion.button
                        key={box.id}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        className={`
                          flex items-center gap-3 rounded-lg border p-4 
                          ${box.color.bg} ${box.color.border} ${box.color.hover}
                          text-left w-full
                        `}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        <Icon className={`h-6 w-6 ${box.color.text}`} aria-hidden="true" />
                        <div>
                          <span className={`font-medium ${box.color.text}`}>
                            {box.label}
                          </span>
                          <p className="mt-0.5 text-sm text-primary-500 dark:text-primary-400">
                            {`${Math.floor(Math.random() * 50 + 10)} items`}
                          </p>
                        </div>
                        <ArrowRight className={`ml-auto h-5 w-5 ${box.color.text}`} />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Bottom Content */}
                <div className="border-t border-primary-200 dark:border-primary-700 pt-6">
                  <div className="rounded-lg bg-primary-50 dark:bg-primary-800/50 p-4">
                    <h3 className="font-medium text-primary-900 dark:text-primary-50 mb-2">
                      Need Help?
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-300 mb-4">
                      Our customer service team is here to help you find the perfect items.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300"
                    >
                      Contact Support
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;

