import { motion } from 'framer-motion';

const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Enhanced Grid Pattern with Gradients */}
      <svg 
        className="absolute w-full h-full opacity-[0.08] dark:opacity-[0.05]" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>
          
          <pattern 
            id="gridPattern" 
            x="0" 
            y="0" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(0)"
          >
            {/* Vertical lines */}
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="url(#gridGradient)" 
              strokeWidth="0.5"
            />
            {/* Diagonal accent lines */}
            <path 
              d="M 40 0 L 0 40" 
              fill="none" 
              stroke="url(#gridGradient)" 
              strokeWidth="0.3"
              opacity="0.5"
            />
          </pattern>

          {/* Radial gradient overlay */}
          <radialGradient id="radialFade">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base grid */}
        <motion.rect 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          width="100%" 
          height="100%" 
          fill="url(#gridPattern)" 
        />

        {/* Subtle radial overlay */}
        <motion.circle 
          initial={{ r: 0 }}
          animate={{ r: 500 }}
          transition={{ duration: 2, ease: "easeOut" }}
          cx="50%" 
          cy="50%" 
          fill="url(#radialFade)" 
        />
      </svg>
    </div>
  );
};

export default BackgroundElements;