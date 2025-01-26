'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useCallback, useState } from 'react';

const INSTA_IMAGES = Array.from({ length: 15 }, (_, i) => ({
  src: `/images/instagram-section/instagram-${i + 1}.png`,
  alt: `Instagram story ${i + 1}`
}));

interface InstagramBannerProps {
  className?: string;
  instagramHandle?: string;
}

const InstagramBanner = ({ 
  className = '',
  instagramHandle = 'simple_interior_store_' 
}: InstagramBannerProps) => {
  const [isScrolling, setIsScrolling] = useState(true);

  const handleHoverStart = useCallback(() => {
    setIsScrolling(false);
  }, []);

  const handleHoverEnd = useCallback(() => {
    const timer = setTimeout(() => setIsScrolling(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full overflow-hidden py-2 sm:py-8 ${className}
      bg-gradient-to-r from-[#E8E2D9] via-[#F0EDE9] to-[#E8E2D9]
      before:absolute before:inset-0 
      before:bg-[radial-gradient(circle_at_50%_50%,rgba(107,94,76,0.08),transparent_45%)]
      before:opacity-60`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 
        bg-gradient-to-r from-[#E8E2D9] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 
        bg-gradient-to-l from-[#E8E2D9] to-transparent z-10" />

      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isScrolling ? "-50%" : "0%" }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 300,
            ease: "linear"
          }
        }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        className="flex gap-1 sm:gap-4 w-fit"
      >
        {[...INSTA_IMAGES, ...INSTA_IMAGES].map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ 
              scale: 1.05,
              filter: 'grayscale(0%)',
              zIndex: 20
            }}
            className="relative h-[300px] sm:h-[600px] w-[168px] sm:w-[337px] overflow-hidden transform-gpu"
            style={{ filter: 'grayscale(20%)' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 337px, 168px"
              loading={index < 5 ? 'eager' : 'lazy'}
            />
          </motion.div>
        ))}
      </motion.div>

      <a
        href={`https://instagram.com/${instagramHandle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-30 flex items-center justify-center 
                  bg-black/0 transition-colors hover:bg-black/70 group"
      >
        <div className="text-center opacity-0 transform scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 px-4">
          <p className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Follow Us on Instagram</p>
          <p className="text-base sm:text-lg text-white/80 mb-3 sm:mb-6">@{instagramHandle}</p>
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black text-sm sm:text-base font-medium rounded hover:bg-white/90 transition-colors">
            Visit Our Instagram
          </button>
        </div>
      </a>
    </div>
  );
};

export default memo(InstagramBanner);








// 'use client';

// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import { memo, useCallback, useState } from 'react';

// const INSTA_IMAGES = Array.from({ length: 15 }, (_, i) => ({
//   src: `/images/instagram-section/instagram-${i + 1}.png`,
//   alt: `Instagram story ${i + 1}`
// }));

// interface InstagramBannerProps {
//   className?: string;
//   instagramHandle?: string;
// }

// const InstagramBanner = ({ 
//   className = '',
//   instagramHandle = 'simple_interior_store_' 
// }: InstagramBannerProps) => {
//   const [isScrolling, setIsScrolling] = useState(true);

//   const handleHoverStart = useCallback(() => {
//     setIsScrolling(false);
//   }, []);

//   const handleHoverEnd = useCallback(() => {
//     const timer = setTimeout(() => setIsScrolling(true), 200);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className={`relative w-full overflow-hidden py-4 sm:py-8 ${className}
//       bg-gradient-to-r from-[#E8E2D9] via-[#F0EDE9] to-[#E8E2D9]
//       before:absolute before:inset-0 
//       before:bg-[radial-gradient(circle_at_50%_50%,rgba(107,94,76,0.08),transparent_45%)]
//       before:opacity-60`}
//     >
//       <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 
//         bg-gradient-to-r from-[#E8E2D9] to-transparent z-10" />
//       <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 
//         bg-gradient-to-l from-[#E8E2D9] to-transparent z-10" />

//       <motion.div
//         initial={{ x: 0 }}
//         animate={{ x: isScrolling ? "-50%" : "0%" }}
//         transition={{
//           x: {
//             repeat: Infinity,
//             repeatType: "loop",
//             duration: 300,
//             ease: "linear"
//           }
//         }}
//         onHoverStart={handleHoverStart}
//         onHoverEnd={handleHoverEnd}
//         className="flex gap-2 sm:gap-4 w-fit"
//       >
//         {[...INSTA_IMAGES, ...INSTA_IMAGES].map((image, index) => (
//           <motion.div
//             key={index}
//             whileHover={{ 
//               scale: 1.05,
//               filter: 'grayscale(0%)',
//               zIndex: 20
//             }}
//             className="relative h-[600px] w-[337px] overflow-hidden transform-gpu"
//             style={{ filter: 'grayscale(20%)' }}
//           >
//             <Image
//               src={image.src}
//               alt={image.alt}
//               fill
//               className="object-cover"
//               sizes="337px"
//               loading={index < 5 ? 'eager' : 'lazy'}
//             />
//           </motion.div>
//         ))}
//       </motion.div>

//       <a
//         href={`https://instagram.com/${instagramHandle}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="absolute inset-0 z-30 flex items-center justify-center 
//                   bg-black/0 transition-colors hover:bg-black/70 group"
//       >
//         <div className="text-center opacity-0 transform scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
//           <p className="text-3xl font-bold text-white mb-4">Follow Us on Instagram</p>
//           <p className="text-lg text-white/80 mb-6">@{instagramHandle}</p>
//           <button className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-white/90 transition-colors">
//             Visit Our Instagram
//           </button>
//         </div>
//       </a>
//     </div>
//   );
// };

// export default memo(InstagramBanner);