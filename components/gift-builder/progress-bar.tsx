// components/gift-builder/progress-bar.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Box, Check, ClipboardCheck, Gift, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGiftBuilder } from './context';

interface Step {
  id: number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

const stepIcons = {
  1: Box,
  2: Gift,
  3: ClipboardCheck,
  4: ShoppingBag
};

const stepDescriptions = {
  1: 'Select your perfect gift box size and style',
  2: 'Fill your box with amazing items',
  3: 'Review your selections and arrangement',
  4: 'Complete your purchase securely'
};

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const { state, dispatch } = useGiftBuilder();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const isStepAccessible = (stepId: number) => {
    if (stepId === 1) return true;
    if (stepId === 2) return !!state.selectedBox;
    if (stepId === 3) return !!state.selectedBox && state.selectedProducts.length > 0;
    if (stepId === 4) return false;
    return false;
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    if (!isStepAccessible(stepId)) return 'locked';
    return 'upcoming';
  };

  const handleStepClick = (stepId: number) => {
    if (isStepAccessible(stepId) && stepId < currentStep) {
      dispatch({ type: 'SET_STEP', payload: stepId });
    }
  };

  const progressVariants = {
    initial: { width: '0%' },
    animate: {
      width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const stepVariants = {
    inactive: { scale: 1 },
    active: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Enhanced accessibility and navigation
  const handleKeyPress = (e: React.KeyboardEvent, stepId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStepClick(stepId);
    }
  };

  return (
    <nav 
      aria-label="Gift Builder Progress" 
      className="relative px-3 py-6 sm:px-6 sm:py-8"
    >
      {/* Progress Background */}
      <div 
        className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-primary-100/50 dark:bg-primary-800/50"
        role="progressbar"
        aria-valuenow={((currentStep - 1) / (steps.length - 1)) * 100}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="bg-size-200 animate-gradient h-full rounded-full bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500"
          variants={progressVariants}
          initial="initial"
          animate="animate"
        />
      </div>

      {/* Steps */}
      <ol className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.id);
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isAccessible = isStepAccessible(step.id);
          const IconComponent = stepIcons[step.id as keyof typeof stepIcons];
          const isHovered = hoveredStep === step.id;

          return (
            <li 
              key={step.id} 
              className="relative flex flex-1 flex-col items-center"
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Step Button */}
              <motion.button
                disabled={!isAccessible || isCurrent}
                onClick={() => handleStepClick(step.id)}
                onKeyPress={(e) => handleKeyPress(e, step.id)}
                onHoverStart={() => setHoveredStep(step.id)}
                onHoverEnd={() => setHoveredStep(null)}
                variants={stepVariants}
                initial="inactive"
                animate={isCurrent ? 'active' : isHovered ? 'hover' : 'inactive'}
                className={`group relative flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300 ${
                  stepStatus === 'completed' || stepStatus === 'current'
                    ? 'bg-gradient-to-tr from-accent-500 to-accent-400 shadow-lg shadow-accent-500/25'
                    : stepStatus === 'locked'
                      ? 'bg-primary-100/50 dark:bg-primary-800/50'
                      : 'bg-primary-100 dark:bg-primary-800'
                } ${
                  isAccessible && !isCurrent
                    ? 'cursor-pointer hover:ring-4 hover:ring-accent-500/20 focus:outline-none focus:ring-4 focus:ring-accent-500/40'
                    : 'cursor-default'
                }`}
                aria-label={`${step.title}${
                  stepStatus === 'locked' ? ' (locked)' : ''
                }${stepStatus === 'completed' ? ' (completed)' : ''}`}
              >
                {/* Icon Container */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${stepStatus}-${isCurrent}`}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className={`relative flex items-center justify-center ${
                      stepStatus === 'completed' || stepStatus === 'current'
                        ? 'text-white'
                        : 'text-primary-400 dark:text-primary-500'
                    }`}
                  >
                    {stepStatus === 'completed' ? (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 stroke-[3]" />
                    ) : stepStatus === 'locked' ? (
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-20 left-1/2 w-48 -translate-x-1/2 rounded-xl bg-white p-3 text-center shadow-xl dark:bg-primary-800"
                    role="tooltip"
                  >
                    <p className="text-xs font-medium text-primary-900 dark:text-primary-100">
                      {stepDescriptions[step.id as keyof typeof stepDescriptions]}
                    </p>
                    <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white dark:bg-primary-800" />
                  </motion.div>
                )}
              </motion.button>

              {/* Step Label */}
              <motion.div
                className="mt-2 sm:mt-4 flex flex-col items-center"
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                  transition: { type: 'spring', stiffness: 300, damping: 25 }
                }}
              >
                <span
                  className={`text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                    stepStatus === 'completed' || stepStatus === 'current'
                      ? 'text-primary-900 dark:text-primary-50'
                      : 'text-primary-400 dark:text-primary-500'
                  }`}
                >
                  {step.title}
                </span>
                {isCurrent && (
                  <motion.div
                    className="mt-2 h-1 w-6 rounded-full bg-accent-500"
                    layoutId="stepIndicator"
                  />
                )}
              </motion.div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[calc(50%+20px)] right-[calc(50%-20px)] sm:left-[calc(50%+28px)] sm:right-[calc(50%-28px)] top-5 sm:top-7 h-[2px] ${
                    stepStatus === 'completed'
                      ? 'bg-gradient-to-r from-accent-500 to-accent-400'
                      : 'bg-primary-100/50 dark:bg-primary-800/50'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
