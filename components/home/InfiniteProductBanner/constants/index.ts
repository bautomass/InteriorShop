//INFINITE PRODUCT BANNER
export const BANNER_CONSTANTS = {
    ANIMATION: {
      HOVER: {
        scale: 1.08,
        y: -8,
        filter: 'grayscale(0%)',
        zIndex: 20,
        transition: { 
          type: "spring",
          stiffness: 200,
          damping: 25,
        }
      },
      SALE_BADGE: {
        initial: { scale: 0.8, opacity: 0, rotate: -12 },
        animate: { 
          scale: [0.8, 1.1, 1],
          opacity: 1,
          rotate: [-12, -15, -12]
        }
      },
      SCROLL: {
        duration: 1200,
        ease: "linear"
      }
    },
    SNIPPETS: [
      "Energy efficient LED compatible",
      "Premium crafted lighting",
      "Modern minimalist design",
      "Perfect ambient lighting",
      "Dimmable brightness control",
      "Elegant home accent piece",
      "Versatile lighting solution",
      "Contemporary style lighting",
      "Unique designer lamp",
      "Artisan crafted fixture",
      "Adjustable light settings",
      "Premium quality finish"
    ] as const
  };