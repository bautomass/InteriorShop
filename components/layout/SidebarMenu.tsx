'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

// Types
interface Collection {
  id: string;
  title: string;
  handle: string;
}

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Animation variants
const sidebarVariants: Variants = {
  closed: {
    x: '-100%',
    transition: {
      type: 'tween',
      duration: 0.15
    }
  },
  open: {
    x: 0,
    transition: {
      type: 'tween',
      duration: 0.15
    }
  }
};

const listVariants: Variants = {
  open: {
    transition: {
      staggerChildren: 0.01,
      delayChildren: 0.05
    }
  },
  closed: {
    transition: {
      staggerChildren: 0.01,
      staggerDirection: -1
    }
  }
};

const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.15
    }
  },
  closed: {
    y: 10,
    opacity: 0,
    transition: {
      duration: 0.15
    }
  }
};

// Constants
const EXCLUDED_HANDLES: readonly string[] = [
  'all',
  'new-arrivals',
  'top-products',
  'freshfreshfresh',
  'home-collection'
];

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch collections
  const fetchCollections = useCallback(async () => {
    try {
      const response = await fetch('/api/collections', {
        next: { revalidate: 0 },
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const { collections } = await response.json();

      const filteredCollections = collections.filter(
        (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
      );

      setCollections(filteredCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    if (isOpen && mounted) {
      fetchCollections();
    }

    return () => {
      mounted = false;
    };
  }, [isOpen, fetchCollections]);

  // Event handlers
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  const handleSidebarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed bottom-0 left-0 top-0 z-50 flex w-[400px] max-w-[90vw] flex-col overflow-hidden bg-white shadow-xl"
            onClick={handleSidebarClick}
          >
            {/* Background Pattern */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at center, #9e896c 1px, transparent 1px),
                  radial-gradient(circle at center, #9e896c 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
                opacity: 0.1
              }}
            />

            {/* Top Gradient */}
            <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#9e896c]/20 to-transparent" />

            {/* Header */}
            <div className="relative border-b border-neutral-100 bg-white/90">
              <div className="p-4 pr-12">
                <h2 className="text-lg font-light tracking-wide text-neutral-800">Collections</h2>
                <p className="mt-0.5 text-xs text-neutral-500">Explore our curated categories</p>
              </div>

              <button
                onClick={onClose}
                className="group absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors duration-200 hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600" />
              </button>
            </div>

            {/* Content */}
            <div className="custom-scrollbar relative flex-1 overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-2 gap-2 p-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-md bg-white/50" />
                  ))}
                </div>
              ) : (
                <motion.div variants={listVariants} initial="closed" animate="open" className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {collections.map((collection) => (
                      <motion.div key={collection.id} variants={itemVariants}>
                        <Link
                          href={`/collections/${collection.handle}`}
                          onClick={handleLinkClick}
                          className="group relative block overflow-hidden rounded-md border border-neutral-100 bg-white/80 p-2.5 transition-all duration-300 hover:border-neutral-200 hover:bg-white hover:shadow-md"
                        >
                          <div className="relative z-10 flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-neutral-800 transition-colors group-hover:text-[#9e896c]">
                                {collection.title}
                              </h3>
                              <p className="mt-0.5 text-[10px] text-neutral-500 group-hover:text-neutral-600">
                                View collection
                              </p>
                            </div>
                            <svg
                              className="h-4 w-4 translate-x-2 transform text-neutral-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[#9e896c] group-hover:opacity-100"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#9e896c]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="relative bg-white/90 px-4 py-3">
              <div className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#9e896c]/20 to-transparent" />
              <div className="flex items-center justify-center gap-6 text-xs">
                <Link
                  href="/help"
                  className="text-neutral-500 transition-colors duration-200 hover:text-[#9e896c]"
                >
                  Help
                </Link>
                <span className="text-neutral-300">·</span>
                <Link
                  href="/privacy"
                  className="text-neutral-500 transition-colors duration-200 hover:text-[#9e896c]"
                >
                  Privacy
                </Link>
                <span className="text-neutral-300">·</span>
                <Link
                  href="/terms"
                  className="text-neutral-500 transition-colors duration-200 hover:text-[#9e896c]"
                >
                  Terms
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
