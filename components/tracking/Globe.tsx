// components/tracking/Globe.tsx
'use client';

import { useEffect, useRef } from 'react';

interface GlobeProps {
  isLoading: boolean;
}

export const Globe = ({ isLoading }: GlobeProps) => {
  const globeRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (isLoading && globeRef.current) {
      // Reset animation by removing and re-adding the class
      globeRef.current.classList.remove('animate-spin-slow');
      void (globeRef.current as unknown as HTMLElement).offsetWidth; // Trigger reflow
      globeRef.current.classList.add('animate-spin-slow');
    }
  }, [isLoading]);

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
      {/* Main GIF Animation */}
      <div className={`relative w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-75' : 'opacity-100'}`}>
        <img
          src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/globe-svg.svg?v=1738789222"
          alt="Tracking Animation"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full absolute">
            <div className="absolute inset-0 animate-ping opacity-20 rounded-full border-2 border-[#6B5E4C]" />
            <div className="absolute inset-4 animate-ping opacity-30 rounded-full border-2 border-[#6B5E4C]" />
            <div className="absolute inset-8 animate-ping opacity-40 rounded-full border-2 border-[#6B5E4C]" />
          </div>
        </div>
      )}

      {/* Optional Gradient Overlay - uncomment if you want to add a subtle gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF9F6]/10" /> */}
    </div>
  );
};