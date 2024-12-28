'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Collection {
  id: string;
  title: string;
  handle: string;
}

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchCollections() {
      try {
        const response = await fetch('/api/collections', {
          next: { revalidate: 0 },
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const { collections } = await response.json();
        
        if (mounted) {
          const filteredCollections = collections.filter((collection: Collection) => {
            const excludedHandles = ['all', 'new-arrivals', 'top-products', 'freshfreshfresh', 'home-collection'];
            return !excludedHandles.includes(collection.handle.toLowerCase());
          });
          
          console.log('Filtered collections:', filteredCollections);
          setCollections(filteredCollections);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (isOpen) {
      fetchCollections();
    }

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const sidebarVariants = {
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

  const listVariants = {
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

  const itemVariants = {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed left-0 top-0 bottom-0 w-[400px] max-w-[90vw] bg-white shadow-xl z-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="absolute inset-0 pointer-events-none"
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
            
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9e896c]/20 to-transparent" />

            <div className="relative border-b border-neutral-100 bg-white/90">
              <div className="p-4 pr-12">
                <h2 className="text-lg font-light tracking-wide text-neutral-800">Collections</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Explore our curated categories</p>
              </div>
              
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200 group"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {loading ? (
                <div className="p-3 grid grid-cols-2 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="animate-pulse h-16 bg-white/50 rounded-md"
                    />
                  ))}
                </div>
              ) : (
                <motion.div 
                  variants={listVariants}
                  initial="closed"
                  animate="open"
                  className="p-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {collections.map((collection) => (
                      <motion.div
                        key={collection.id}
                        variants={itemVariants}
                      >
                        <Link
                          href={`/collections/${collection.handle}`}
                          onClick={onClose}
                          className="group block p-2.5 rounded-md bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300 border border-neutral-100 hover:border-neutral-200 relative overflow-hidden"
                        >
                          <div className="relative z-10 flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-neutral-800 group-hover:text-[#9e896c] transition-colors">
                                {collection.title}
                              </h3>
                              <p className="text-[10px] text-neutral-500 group-hover:text-neutral-600 mt-0.5">
                                View collection
                              </p>
                            </div>
                            <svg 
                              className="w-4 h-4 text-neutral-300 group-hover:text-[#9e896c] transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14m-7-7 7 7-7 7"/>
                            </svg>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#9e896c]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="relative py-3 px-4 bg-white/90">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-px bg-gradient-to-r from-transparent via-[#9e896c]/20 to-transparent" />
              <div className="flex items-center justify-center gap-6 text-xs">
                <Link 
                  href="/help" 
                  className="text-neutral-500 hover:text-[#9e896c] transition-colors duration-200"
                >
                  Help
                </Link>
                <span className="text-neutral-300">·</span>
                <Link 
                  href="/privacy" 
                  className="text-neutral-500 hover:text-[#9e896c] transition-colors duration-200"
                >
                  Privacy
                </Link>
                <span className="text-neutral-300">·</span>
                <Link 
                  href="/terms" 
                  className="text-neutral-500 hover:text-[#9e896c] transition-colors duration-200"
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