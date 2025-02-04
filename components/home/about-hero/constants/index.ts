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