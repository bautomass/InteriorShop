import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { useInView } from 'react-intersection-observer';
import { CONSTANTS } from './constants';
import type { ViewAllCardProps } from './types';

export const ViewAllCard = memo(function ViewAllCard({ inView, index }: ViewAllCardProps) {
  const { ref, inView: cardInView } = useInView(CONSTANTS.INTERSECTION);

  return (
    <Link
      ref={ref}
      href="/collections"
      className={`group relative flex h-16 min-w-[240px] overflow-hidden rounded-xl 
        bg-[#6B5E4C] backdrop-blur-sm transition-all duration-500 
        hover:shadow-lg hover:-translate-y-1 hover:bg-[#7B6E5C]
        ${cardInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        motion-safe:transform motion-safe:transition-all motion-safe:duration-700`}
      style={{
        transitionDelay: `${index * 100}ms`
      }}
    >
      <div className="relative flex-1 flex items-center justify-center">
        <div className="text-center pr-6">
          <h3 className="font-medium text-[#eaeadf] text-sm tracking-wide whitespace-nowrap
                        group-hover:text-white transition-colors duration-300">
            View All Collections
          </h3>
          <p className="text-[#eaeadf]/80 text-xs mt-0.5
                       group-hover:text-white/90 transition-colors duration-300">
            Explore our complete catalog
          </p>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ArrowRight 
            className="w-4 h-4 text-[#eaeadf] transform translate-x-0 
                       group-hover:translate-x-1 group-hover:text-white 
                       transition-all duration-300" 
          />
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                     transition-all duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r 
                       from-[#8C7E6A]/20 via-[#8C7E6A]/10 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                       transition-opacity duration-300
                       bg-gradient-to-r from-white/5 via-white/10 to-transparent
                       blur-xl" />
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                       transition-transform duration-1000
                       bg-gradient-to-r from-transparent via-white/10 to-transparent
                       transform-gpu" />
      </div>
    </Link>
  );
});

ViewAllCard.displayName = 'ViewAllCard';