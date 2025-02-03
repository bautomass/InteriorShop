'use client';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

const AccountModal = lazy(() => import('@/components/AccountModal').then(module => ({ default: module.AccountModal })));

const LoyaltySignup = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { user } = useAuth();
  
  if (user) return null;
  
  return (
    <>
      <motion.div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
      >
        <motion.div
          className="flex items-center"
          animate={{
            x: isHovered ? 0 : -225,
          }}
          initial={{ x: -225 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40
          }}
        >
          {/* Main content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-r-lg shadow-lg 
                        border-y border-r border-[#b39e86] p-4 cursor-pointer group"
                onClick={() => setIsAccountModalOpen(true)}>
            <div className="w-[180px]">
              <div className="mb-3">
                <span className="text-sm font-medium text-[#6B5E4C]">
                Your Space
                </span>
              </div>
              <p className="text-xs text-[#8C7E6A] mb-3 leading-relaxed">
              Join us for a personalized shopping experience and earn rewards with every purchase
              </p>
              <motion.div 
                className="flex items-center text-xs text-[#9c826b] font-medium
                          hover:text-[#8b6f57] transition-colors duration-200
                          w-fit"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              >
                Sign up now
                <motion.div
                  className="ml-1"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Tab with animated arrow */}
          <div 
            className="bg-white/95 backdrop-blur-sm h-12 w-8 rounded-r-lg shadow-lg 
                       border-y border-r border-[#b39e86] flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              animate={{
                x: [3, 8, 3],
                rotate: isHovered ? 180 : 0
              }}
              transition={{
                x: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
            >
              <ChevronRight className="w-6 h-6 text-[#9c826b]" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {isAccountModalOpen && (
        <Suspense fallback={null}>
          <AccountModal 
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default LoyaltySignup;