'use client';
import { AccountModal } from '@/components/AccountModal';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';
import { ChevronRight, UserCircle } from 'lucide-react';
import { useState } from 'react';

const LoyaltySignup = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { user } = useAuth();
  
  if (user) return null;
  
  return (
    <>
      <motion.div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsAccountModalOpen(true)}
      >
        <motion.div
          className="flex items-center"
          animate={{
            x: isHovered ? 0 : -220,
          }}
          initial={{ x: -220 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40
          }}
        >
          {/* Main content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-r-lg shadow-lg 
                        border-y border-r border-[#b39e86] p-4 cursor-pointer group">
            <div className="w-[180px]">
              <div className="mb-3">
                <span className="text-sm font-medium text-[#6B5E4C]">
                  Join & Earn
                </span>
              </div>
              <p className="text-xs text-[#8C7E6A] mb-3 leading-relaxed">
                Get $5 off your first order and earn points with every purchase
              </p>
              <motion.div 
                className="flex items-center text-xs text-[#9c826b] font-medium"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              >
                Sign up now
                <ChevronRight className="w-3 h-3 ml-1" />
              </motion.div>
            </div>
          </div>

          {/* User icon tab */}
          <motion.div 
            className="bg-white/95 backdrop-blur-sm h-14 w-12
                     rounded-r-lg shadow-lg border-y border-r border-[#b39e86] 
                     flex items-center justify-center relative
                     overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#b39e86]/5 to-transparent"
              animate={{
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <UserCircle className="w-5 h-5 text-[#9c826b]" />
          </motion.div>
        </motion.div>
      </motion.div>

      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
};

export default LoyaltySignup;