'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { memo } from 'react';
import type { FeatureCardProps } from '../types';

export const FeatureCard = memo(function FeatureCard({ 
  feature, 
  index, 
  isExpanded, 
  onClick 
}: FeatureCardProps) {
  const { icon: Icon } = feature;
  
  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg backdrop-blur-sm transition-all duration-300 cursor-pointer",
        isExpanded ? "bg-white/80 p-8" : "bg-white/50 p-6"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-[#6B5E4C]" />
          <ChevronDown className={cn(
            "h-5 w-5 text-[#6B5E4C] transition-transform duration-300",
            isExpanded ? "rotate-180" : ""
          )} />
        </div>
        <h3 className="mt-4 text-lg font-medium text-[#6B5E4C]">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm text-[#8C7E6A]">
          {feature.description}
        </p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 border-t border-[#6B5E4C]/20 pt-4"
            >
              <h4 className="text-md font-semibold text-[#6B5E4C]">
                {feature.expandedContent.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {feature.expandedContent.highlights.map((highlight, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start text-sm text-[#8C7E6A]"
                  >
                    <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6B5E4C]" />
                    {highlight}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 rounded-lg bg-[#6B5E4C]/5 p-3"
              >
                <p className="text-sm font-medium text-[#6B5E4C]">Key Benefit:</p>
                <p className="mt-1 text-sm text-[#8C7E6A]">{feature.expandedContent.keyBenefit}</p>
                <p className="mt-2 text-xs text-[#8C7E6A]/70 italic">{feature.expandedContent.citation}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});