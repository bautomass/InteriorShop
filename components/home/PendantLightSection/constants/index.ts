import { CircleOff, ShieldCheck } from "lucide-react";

import { Package } from "lucide-react";

// New constants for FeaturedProduct
export const PRODUCT_CONSTANTS = {
    INITIAL_SHARE_COUNT: 67,
    TOUCH_THRESHOLD: 50,
    SCROLL_AMOUNT: 200,
    IMAGE_SIZES: {
      THUMBNAIL: '80px',
      MAIN: '(max-width: 768px) 100vw, 50vw',
    },
    ANIMATION: {
      MOBILE_BLINK: {
        initial: { scale: 1 },
        hover: {
          scale: 1.1,
          opacity: [1, 0.5, 1],
          transition: {
            opacity: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.15 }
          }
        }
      },
      IMAGE_ZOOM: {
        scale: 1.05,
        transition: { 
          duration: 20, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }
      }
    }
  } as const;
  
  export const HIGHLIGHTS = [
    { 
      icon: Package,
      title: "Artisan Crafted",
      description: "Handmade by skilled Japanese artisans"
    },
    {
      icon: CircleOff,
      title: "Zero Waste",
      description: "Sustainable materials and packaging"
    },
    {
      icon: ShieldCheck,
      title: "5-Year Warranty",
      description: "Quality guaranteed craftsmanship"
    }
  ] as const;