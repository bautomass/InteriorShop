'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

const HeroButtons = memo(() => (
  <div className="absolute bottom-0 left-0 right-0 z-10 grid grid-cols-2">
    <Link
      href="/story"
      className="py-4 bg-white text-[#9e896c] text-sm font-medium text-center
                 hover:bg-[#9e896c] hover:text-white transition-colors"
    >
      Our Story
    </Link>
    <Link
      href="/collections/all-products"
      prefetch={false}
      className="py-4 bg-[#9e896c] text-white text-sm font-medium text-center
                 hover:bg-opacity-90 transition-colors"
    >
      All Products
    </Link>
  </div>
));

HeroButtons.displayName = 'HeroButtons';

const MobileHero = memo(() => {
  return (
    <div className="relative h-[100vh] lg:hidden">
      <HeroButtons />
      <div className="relative h-full w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile-hero-image.webp?v=1736699557"
          alt="Mobile Hero"
          fill
          priority
          fetchPriority="high"
          className="object-cover translate-y-[-50px]"
          sizes="100vw"
          quality={100}
          loading="eager"
        />
        
        {/* Quote Overlay */}
        <div className="absolute top-36 right-4 max-w-[220px] z-10">
          <div className="backdrop-blur-sm rounded-2xl p-6 
            bg-[#6b5e4c]/90
            before:absolute before:inset-0 before:-z-10
            before:rounded-2xl before:p-[1px]
            before:bg-gradient-to-br before:from-white/20 before:to-transparent
            after:absolute after:w-16 after:h-16
            after:top-0 after:right-0
            after:bg-white/5
            after:rounded-full after:blur-2xl
            after:transform after:-translate-x-1/2 after:-translate-y-1/2">
            <blockquote className="relative">
              <p className="text-white text-sm font-medium leading-relaxed tracking-wide">
                Simplicity is the ultimate sophistication
              </p>
              <footer className="mt-3">
                <cite className="block text-right text-white/60 text-[11px] font-medium tracking-widest uppercase not-italic">
                  — Leonardo da Vinci
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
});

MobileHero.displayName = 'MobileHero';

export default MobileHero;