'use client';

import DesktopHero from './desktop-hero/DesktopHero';
import MobileHero from './mobile-header-hero/MobileHero';

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
