'use client';

import dynamic from 'next/dynamic';

// Dynamic imports with loading states
const DesktopHero = dynamic(() => import('./DesktopHero'), { 
  ssr: false,
  loading: () => <div className="hidden lg:block h-screen bg-[#f5f5f4]" />
});

const MobileHero = dynamic(() => import('./mobile-header-hero/MobileHero'), { 
  ssr: true,
  loading: () => <div className="lg:hidden h-screen bg-[#f5f5f4]" />
});

const HeroCarousel = () => {
  return (
    <>
      <div className="lg:hidden">
        <MobileHero />
      </div>
      <div className="hidden lg:block">
        <DesktopHero />
      </div>
    </>
  );
};

export default HeroCarousel;