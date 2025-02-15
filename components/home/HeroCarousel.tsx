'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const DesktopHero = dynamic(() => import('./desktop-hero/DesktopHero'), { 
  ssr: false,
  loading: () => (
    <div 
      className="hidden lg:block h-screen bg-[#f5f5f4]" 
      role="presentation" 
      aria-hidden="true"
    />
  )
});

const MobileHero = dynamic(() => import('./mobile-header-hero/MobileHero'), { 
  ssr: true,
  loading: () => (
    <div 
      className="block lg:hidden h-screen bg-[#f5f5f4]" 
      role="presentation" 
      aria-hidden="true"
    />
  )
});

const HeroCarousel = () => {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const checkIsDesktop = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 1024);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    checkIsDesktop();

    const handleResize = () => {
      checkIsDesktop();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkIsDesktop]);

  // Before mount, show loading placeholders
  if (!mounted) {
    return (
      <div>
        <div 
          className="block lg:hidden h-screen bg-[#f5f5f4]" 
          role="presentation" 
          aria-hidden="true"
        />
        <div 
          className="hidden lg:block h-screen bg-[#f5f5f4]" 
          role="presentation" 
          aria-hidden="true"
        />
      </div>
    );
  }

  // After mount, show appropriate hero based on screen size
  return (
    <>
      {isDesktop ? <DesktopHero /> : <MobileHero />}
    </>
  );
};

export default HeroCarousel;



// 'use client';

// import dynamic from 'next/dynamic';

// // Dynamic imports with loading states
// const DesktopHero = dynamic(() => import('./DesktopHero'), { 
//   ssr: false,
//   loading: () => <div className="hidden lg:block h-screen bg-[#f5f5f4]" />
// });

// const MobileHero = dynamic(() => import('./mobile-header-hero/MobileHero'), { 
//   ssr: true,
//   loading: () => <div className="lg:hidden h-screen bg-[#f5f5f4]" />
// });

// const HeroCarousel = () => {
//   return (
//     <>
//       <div className="lg:hidden">
//         <MobileHero />
//       </div>
//       <div className="hidden lg:block">
//         <DesktopHero />
//       </div>
//     </>
//   );
// };

// export default HeroCarousel;