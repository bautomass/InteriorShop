import { Package , ShieldCheck, CircleOff,  } from "lucide-react";


export const CONSTANTS = {
    SCROLL: {
      MULTIPLIER: 0.8,
      THRESHOLD: 100,
      ANIMATION_DURATION: 300,
    },
    TIMING: {
      CAROUSEL_INTERVAL: 4000,
      RETRY_DELAY: 1000,
      DEBOUNCE_DELAY: 150,
      METRICS_UPDATE_DELAY: 100,
    },
    INTERSECTION: {
      threshold: 0.2,
      triggerOnce: true,
    },
  } as const;
  
  export const features = [
    { 
      title: 'Eco-Friendly', 
      id: 'eco',
      description: 'Sustainable materials, mindful production'
    },
    { 
      title: 'Artisan Crafted', 
      id: 'artisan',
      description: 'Handmade with care and expertise'
    },
    { 
      title: 'Mindful Living', 
      id: 'mindful',
      description: 'Bringing harmony to your space'
    },
  ] as const;
  
  export const images = [
    {
      url: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Screenshot_2024-02-01_at_17.07.51.png?v=1706800058",
      alt: "Lifestyle image 2",
      text: "Japandi is influenced by the ancient Japanese philosophy of Wabi-Sabi, a way of life which values slow-living, contentment and simplicity.",
      caption: "Embrace the art of simplicity"
    },
    {
      url: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Screenshot_2024-02-01_at_17.08.01.png?v=1706800057",
      alt: "Lifestyle image 1",
      text: "As well as the Scandinavian practice of 'hygge', which translates to comfort, cosiness and wellbeing.",
      caption: "Experience true Nordic comfort"
    }
  ];

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