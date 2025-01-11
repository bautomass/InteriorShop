'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lib/shopify/types';
import { Check, ChevronDown, Clock, DollarSign, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useCallback, useEffect, useState } from 'react';
import ThemeToggle from '../../theme-toggle';

interface Currency {
  code: string;
  symbol: string;
}

const currencies: readonly Currency[] = [
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' }
] as const;

const email = 'info@simpleinteriorideas.com';
const workingHours = 'Mon-Fri: 9-18';

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      const response = await fetch('/api/collections');
      if (!response.ok) throw new Error('Failed to fetch collections');
      const { collections } = await response.json();
      setCollections(collections.filter(
        (collection: Collection) => !EXCLUDED_HANDLES.includes(collection.handle.toLowerCase())
      ));
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchCollections();
  }, [isOpen, fetchCollections]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div className="border-b border-neutral-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={closeMobileMenu}
                    className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200"
                  >
                    <XMarkIcon className="h-6" />
                  </button>
                  <ThemeToggle />
                </div>
                
                <div className="space-y-3 border-t border-neutral-200 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm text-neutral-600">{workingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${email}`} className="text-sm text-neutral-600">
                      {email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <button 
                      onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                      className="flex items-center gap-1 text-sm"
                    >
                      {selectedCurrency.code}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {isCurrencyOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 rounded-md bg-neutral-50 p-2">
                          {currencies.map((currency) => (
                            <button
                              key={currency.code}
                              onClick={() => {
                                setSelectedCurrency(currency);
                                setIsCurrencyOpen(false);
                              }}
                              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-white"
                            >
                              {currency.code}
                              {selectedCurrency.code === currency.code && (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="mb-4 text-lg font-medium">Collections</h3>
                {loading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 animate-pulse rounded-md bg-neutral-100" />
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {collections.map((collection) => (
                      <motion.div
                        key={collection.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <Link
                          href={`/collections/${collection.handle}`}
                          onClick={closeMobileMenu}
                          className="group block rounded-md border border-neutral-200 p-4 transition-all hover:border-neutral-300 hover:shadow-sm"
                        >
                          <h4 className="text-sm font-medium">{collection.title}</h4>
                          <p className="mt-1 text-xs text-neutral-500">View collection →</p>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="border-t border-neutral-200 px-4 pt-4">
                <ul className="space-y-3">
                  {menu.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.path}
                        onClick={closeMobileMenu}
                        className="block text-lg text-neutral-800 hover:text-neutral-500"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
