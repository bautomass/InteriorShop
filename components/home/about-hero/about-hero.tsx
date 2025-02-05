'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from './components/ErrorFallback';
import { features, heroImage } from './constants';

const AboutHero = memo(function AboutHero() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <section 
        className="bg-[#eaeadf] relative overflow-hidden opacity-100"
        aria-label="About our store"
      >
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-white opacity-50 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              {/* Main content area - always at the top */}
              <div className="space-y-6 order-1">
                <h1 className="text-[#6B5E4C] text-4xl font-light leading-tight">
                  Beauty in Simplicity
                  <span className="block mt-1.5 text-2xl text-[#8C7E6A]">
                    Warmth in Minimalism
                  </span>
                </h1>
                
                <div className="space-y-3 text-[#8C7E6A] text-lg">
                  <p>
                    Welcome to our store dedicated to those who find beauty in simplicity and warmth in the minimalist approach.
                  </p>
                  <p className="text-base">
                    We source unique, handmade decors made from eco-friendly materials, working with artisans and small businesses who prioritize quality and sustainability.
                  </p>
                </div>
              </div>

              {/* Mobile/Tablet Image Gallery */}
              <div className="block lg:hidden order-2">
                <div 
                  className="relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={heroImage.url}
                      alt={heroImage.alt}
                      fill
                      priority
                      loading="eager"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E4C]/95 via-[#6B5E4C]/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 transform translate-y-full 
                      group-hover:translate-y-0 transition-all duration-700 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-white text-xl sm:text-2xl font-light leading-relaxed transform 
                          translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                          transition-all duration-700 delay-100 ease-out">
                          {heroImage.text}
                        </p>
                        <p className="text-white/80 mt-2 transform translate-y-full opacity-0 
                          group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                          {heroImage.caption}
                        </p>
                      </div>
                      
                      <div className="w-0 group-hover:w-24 h-[1px] bg-white/60 mt-6 
                        transition-all duration-700 delay-200 ease-out" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features section */}
              <div className="order-3">
                <div className="flex gap-3">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="group relative flex-1 overflow-hidden bg-white/80 backdrop-blur rounded-xl
                        transition-all duration-300 hover:bg-[#B5A48B]"
                      style={{ height: '60px' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#6B5E4C] group-hover:text-white 
                          transition-colors duration-300 text-[12px] font-bold tracking-wide">
                          {feature.title}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center
                        bg-[#B5A48B] transform translate-y-full group-hover:translate-y-0 
                        transition-transform duration-300 ease-out">
                        <div className="text-center px-4">
                          <span className="block text-white text-sm font-bold tracking-wide mb-1">
                            {feature.title}
                          </span>
                          <span className="block text-white/90 text-xs font-medium">
                            {feature.description}
                          </span>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-[#B5A48B]/10 transform -skew-x-12 
                        translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Collections section */}
              <div className="flex items-center justify-center order-4 lg:order-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 items-center w-full sm:w-auto">
                  <h2 className="relative text-[#6B5E4C] text-3xl sm:text-2xl font-medium sm:font-light text-center sm:text-left">
                    <span className="relative px-4 py-2">
                      <span className="relative bg-gradient-to-r from-[#4A3F33] to-[#8B7355] bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-2xl
                        before:content-[''] before:absolute before:-top-1 before:left-0 
                        before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#B5A48B]/40 before:to-[#B5A48B]/40
                        after:content-[''] after:absolute after:-bottom-1 after:left-0 
                        after:w-full after:h-[1px] after:bg-gradient-to-r after:from-[#B5A48B]/40 after:via-[#B5A48B]/40 after:to-transparent">
                        Discover Our Collections
                      </span>
                    </span>
                  </h2>
                  
                  <Link
                    href="/collections"
                    className="group/btn relative inline-flex items-center justify-center sm:justify-start gap-2 
                      w-[90%] sm:w-auto px-6 py-3.5
                      bg-[#6B5E4C] text-[#eaeadf] text-sm
                      border border-[#B5A48B]/20
                      hover:bg-[#7B6E5C] hover:border-[#B5A48B]/40 
                      transition-all duration-300 
                      transform hover:-translate-y-0.5
                      overflow-hidden"
                  >
                    <span className="text-sm font-medium relative z-10">Explore Collections</span>
                    <ArrowRight 
                      className="w-3.5 h-3.5 transform translate-x-0
                        group-hover/btn:translate-x-1 transition-transform duration-300
                        relative z-10" 
                    />
                    <div className="absolute top-0 -left-[100%] w-[120%] h-full 
                      bg-gradient-to-r from-transparent via-white/20 to-transparent
                      group-hover/btn:left-[100%] transition-all duration-1000 ease-in-out" />
                  </Link>
                </div>
              </div>

              {/* Quote section */}
              <blockquote className="relative pl-6 order-5 lg:order-4 hidden lg:block">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#B5A48B] to-transparent" />
                <p className="italic text-[#8C7E6A] text-base sm:text-lg">
                  "Simplicity is the ultimate sophistication"
                </p>
                <cite className="block mt-2 text-[#6B5E4C] not-italic">— Leonardo da Vinci</cite>
              </blockquote>
            </div>

            {/* Desktop Image Gallery - Right Column */}
            <div className="hidden lg:block lg:col-span-7">
              <div 
                className="relative h-[500px] rounded-3xl overflow-hidden group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute inset-0">
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt}
                    fill
                    priority
                    loading="eager"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E4C]/95 via-[#6B5E4C]/20 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-12 transform translate-y-full 
                    group-hover:translate-y-0 transition-all duration-700 ease-out">
                    <div className="overflow-hidden">
                      <p className="text-white text-2xl font-light leading-relaxed transform 
                        translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                        transition-all duration-700 delay-100 ease-out">
                        {heroImage.text}
                      </p>
                      <p className="text-white/80 mt-2 transform translate-y-full opacity-0 
                        group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                        {heroImage.caption}
                      </p>
                    </div>
                    
                    <div className="w-0 group-hover:w-24 h-[1px] bg-white/60 mt-6 
                      transition-all duration-700 delay-200 ease-out" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
});

AboutHero.displayName = 'AboutHero';

export default AboutHero;