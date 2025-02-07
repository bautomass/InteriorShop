'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled more than 400px
      if (window.scrollY > 3000) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-8 z-50"
        >
          <button
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex items-center justify-center w-12 h-12 
                     bg-white rounded-xl shadow-lg border border-neutral-200
                     hover:border-[#9e896c]/20 transition-all duration-300"
            aria-label="Back to top"
          >
            {/* Background animation */}
            <div className={`absolute inset-0 rounded-xl bg-[#9e896c]/5 
                         transition-all duration-300 
                         ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
            />

            {/* Arrow icon with animation */}
            <motion.div
              animate={{
                y: isHovered ? -2 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUp 
                className="w-5 h-5 text-neutral-600 group-hover:text-[#9e896c] 
                          transition-colors duration-300" 
              />
            </motion.div>

            {/* Label tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 
                         pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0, 
                  y: isHovered ? 0 : 10 
                }}
                className="bg-neutral-900 text-white text-xs px-3 py-1.5 
                         rounded-lg whitespace-nowrap"
              >
                Back to top
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 
                             w-2 h-2 bg-neutral-900 rotate-45" 
                />
              </motion.div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;