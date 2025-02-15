//HeroCarousel.tsx
'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

// Import MobileHero directly for better initial load
import MobileHero from './mobile-header-hero/MobileHero';

// Only dynamically import DesktopHero since mobile is our priority
const DesktopHero = dynamic(() => import('./desktop-hero/DesktopHero'), { 
  ssr: true, // Change to true for better initial paint
  loading: () => (
    <div 
      className="hidden lg:block h-screen bg-[#f5f5f4]" 
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
      setIsDesktop(window.matchMedia('(min-width: 1024px)').matches);
    }
  }, []);

  useEffect(() => {
    checkIsDesktop();
    setMounted(true);

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleResize = () => checkIsDesktop();
    
    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, [checkIsDesktop]);

  // Pre-render mobile hero while checking desktop
  if (!mounted) {
    return <MobileHero />;
  }

  return (
    <>
      {isDesktop ? (
        <div className="hidden lg:block">
          <DesktopHero />
        </div>
      ) : (
        <div className="block lg:hidden">
          <MobileHero />
        </div>
      )}
    </>
  );
};

export default HeroCarousel;














// //HeroCarousel.tsx
// 'use client';

// import dynamic from 'next/dynamic';
// import { useCallback, useEffect, useState } from 'react';

// const DesktopHero = dynamic(() => import('./desktop-hero/DesktopHero'), { 
//   ssr: false,
//   loading: () => (
//     <div 
//       className="hidden lg:block h-screen bg-[#f5f5f4]" 
//       role="presentation" 
//       aria-hidden="true"
//     />
//   )
// });

// const MobileHero = dynamic(() => import('./mobile-header-hero/MobileHero'), { 
//   ssr: true,
//   loading: () => (
//     <div 
//       className="block lg:hidden h-screen bg-[#f5f5f4]" 
//       role="presentation" 
//       aria-hidden="true"
//     />
//   )
// });

// const HeroCarousel = () => {
//   const [mounted, setMounted] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(false);

//   const checkIsDesktop = useCallback(() => {
//     if (typeof window !== 'undefined') {
//       setIsDesktop(window.innerWidth >= 1024);
//     }
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//     checkIsDesktop();

//     const handleResize = () => {
//       checkIsDesktop();
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [checkIsDesktop]);

//   if (!mounted) {
//     return (
//       <div role="presentation" aria-label="Loading hero section">
//         <div className="block lg:hidden h-screen bg-[#f5f5f4]" />
//         <div className="hidden lg:block h-screen bg-[#f5f5f4]" />
//       </div>
//     );
//   }

//   // Conditionally render based on screen size
//   return isDesktop ? <DesktopHero /> : <MobileHero />;
// };

// export default HeroCarousel;
