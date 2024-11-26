// components/gift-builder/gift-builder.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useGiftBuilder } from './context';
import { GiftBoxSelector } from './gift-box-selector';
import { GiftReview } from './gift-review';
import { GiftSummary } from './gift-summary';
import { ProductSelector } from './product-selector';
import { ProgressBar } from './progress-bar';

const steps = [
  { id: 1, title: 'Choose Box' },
  { id: 2, title: 'Add Products' },
  { id: 3, title: 'Review Gift' },
  { id: 4, title: 'Checkout' }
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export function GiftBuilder() {
  const { state } = useGiftBuilder();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary-900 dark:text-primary-50">
            Create Your Perfect Gift
          </h1>
          <p className="text-lg text-primary-600 dark:text-primary-300">
            Craft a unique gift experience in just a few simple steps
          </p>
        </div>

        <ProgressBar steps={steps} currentStep={state.step} />

        <div className="mt-8 flex gap-8">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {state.step === 1 && <GiftBoxSelector />}
              {state.step === 2 && <ProductSelector />}
              {state.step === 3 && <GiftReview />}
            </AnimatePresence>
          </div>

          <div className="w-80 flex-shrink-0">
            <GiftSummary />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
