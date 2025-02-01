'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { memo } from 'react';
import { LAMP_CONSTANTS } from '../constants/lamp-constants';

export const LampBannerSection = memo(function LampBannerSection() {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-4 md:px-8">
      <div className="mx-auto max-w-[2000px]">
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {LAMP_CONSTANTS.BANNER_IMAGES.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden rounded-md",
                index !== LAMP_CONSTANTS.BANNER_IMAGES.length - 1 ? "hidden md:block" : ""
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={true}
              />

              {(index === 1 || (index === 2 && window.innerWidth < 768)) && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/80 to-transparent",
                  "transition-transform duration-500 ease-out",
                  "md:translate-y-full md:group-hover:translate-y-0",
                  index === 2 ? "translate-y-0 md:hidden" : "translate-y-full md:block"
                )}>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="space-y-4">
                      <div className="h-0.5 w-12 bg-accent-300/60" />
                      <h3 className="text-xl font-bold tracking-wide text-white">
                        Wabi-Sabi Rattan Chandelier
                      </h3>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-accent-200">
                            Natural Harmony
                          </p>
                          <p className="text-xs leading-relaxed text-white/80">
                            Hand-woven rattan strands dance with light, casting intricate
                            shadows that change with the day's rhythm
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-accent-200">
                            Artisan Heritage
                          </p>
                          <p className="text-xs leading-relaxed text-white/80">
                            Each weave tells the story of skilled hands, preserving
                            traditional craftsmanship in modern design
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-accent-200">Living Energy</p>
                          <p className="text-xs leading-relaxed text-white/80">
                            Natural materials breathe life into your space, creating an
                            atmosphere of calm and organic beauty
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-accent-200">
                            Timeless Beauty
                          </p>
                          <p className="text-xs leading-relaxed text-white/80">
                            Ages gracefully like nature itself, each piece developing its own
                            character over time
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 rounded-md border border-accent-300/40 bg-accent-300/20 
                                 px-6 py-2 text-sm font-medium text-white transition-colors 
                                 duration-200 hover:bg-accent-300/30"
                      >
                        Discover More
                      </motion.button>
                    </div>

                    <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-accent-300/40" />
                    <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-accent-300/40" />
                  </div>
                </div>
              )}

              {/* Interactive Dot for Last Image */}
              {index === LAMP_CONSTANTS.BANNER_IMAGES.length - 1 && (
                <BannerInteractiveDot />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

LampBannerSection.displayName = 'LampBannerSection';

const BannerInteractiveDot = memo(function BannerInteractiveDot() {
  return (
    <a
      href="/product/earthy-elegance-wabi-sabi-rattan-chandelier-handcrafted"
      className="group/dot absolute bottom-[70%] left-[15%]"
    >
      <div className="relative inline-flex">
        <div className="absolute -inset-1.5 h-7 w-7 animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite] rounded-full bg-[#dcd5ca]/60" />
        <div className="absolute -inset-1.5 h-7 w-7 animate-[ping_3.5s_cubic-bezier(0.35,0,0.25,1)_infinite_1.75s] rounded-full bg-[#ebe7e0]/50" />

        <div className="relative h-4 w-4 rounded-full border-2 border-[#9c826b] bg-[#ebe7e0] 
                    shadow-[0_0_10px_rgba(199,186,168,0.8)] transition-all duration-500 
                    ease-in-out group-hover/dot:scale-125" />

        <div className="absolute left-full top-1/2 ml-2 min-w-max -translate-x-2 -translate-y-1/2 
                    opacity-0 transition-all duration-500 ease-out group-hover/dot:translate-x-0 
                    group-hover/dot:opacity-100">
          <div className="flex items-center gap-2 rounded-lg border border-[#b39e86] bg-[#ebe7e0]/95 
                       p-2 shadow-lg backdrop-blur-sm transition-all duration-500 ease-out 
                       hover:bg-[#dcd5ca]/95">
            <span className="whitespace-nowrap px-1 text-sm font-medium text-[#9c826b]">
              View Product
            </span>
            <svg
              className="h-4 w-4 text-[#9c826b] transition-all duration-300 group-hover/dot:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
});

BannerInteractiveDot.displayName = 'BannerInteractiveDot';