// components/animations/AnimatedWord.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const AnimatedWord = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  const nextWord = useCallback(() => {
    setIndex((prev) => (prev + 1) % words.length);
    setKey(prev => prev + 1);
  }, [words.length]);

  useEffect(() => {
    const timer = setInterval(nextWord, 4000);
    return () => clearInterval(timer);
  }, [nextWord]);

  return (
    <div className="relative inline-block min-w-[280px] overflow-hidden z-50 flex items-center h-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={key}
          initial={{ 
            y: 20,
            opacity: 0,
          }}
          animate={{ 
            y: 0,
            opacity: 1,
          }}
          exit={{ 
            y: -20,
            opacity: 0,
          }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.4
          }}
          className="whitespace-nowrap font-medium z-50 
                     bg-gradient-to-r from-primary-800 via-primary-900 to-accent-600 
                     dark:from-primary-200 dark:via-primary-100 dark:to-accent-400 
                     bg-clip-text text-transparent
                     flex items-center"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedWord;