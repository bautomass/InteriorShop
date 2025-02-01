export const LAMP_CONSTANTS = {
    SWIPER_CONFIG: {
      modules: ['Autoplay', 'Navigation'],
      spaceBetween: 16,
      loop: false,
      speed: 1000,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      navigation: {
        prevEl: '.custom-swiper-button-prev',
        nextEl: '.custom-swiper-button-next',
        enabled: true
      },
      breakpoints: {
        0: { slidesPerView: 1.2, spaceBetween: 16 },
        480: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 16 },
        1024: { slidesPerView: 'auto' as const, spaceBetween: 16 }
      }
    },
    VIEW_SETTINGS: {
      minCards: 4,
      maxCards: 6,
      defaultCards: 4
    },
    BANNER_IMAGES: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Untitled_664_x_800_px_1.gif',
        alt: 'Modern designer lamp in a minimalist setting'
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/Untitled_664_x_800_px.jpg',
        alt: 'Artistic pendant lighting arrangement'
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/rattan_lamp.jpg',
        alt: 'Contemporary floor lamp showcase'
      }
    ],
    CATEGORY_PATTERNS: {
      Chandelier: ['chandelier', 'hanging light', 'pendant light', 'ceiling light', 'suspended'],
      'Wall Lamp': ['wall lamp', 'sconce', 'wall light', 'wall mount', 'wall-mounted'],
      'Floor Lamp': ['floor lamp', 'standing lamp', 'floor light', 'standing light', 'floor-standing'],
      'Table Lamp': ['table lamp', 'desk lamp', 'bedside lamp', 'desk light', 'table light'],
      'Pendant Light': ['pendant', 'hanging lamp', 'suspended light', 'drop light']
    },
    ANIMATION: {
      CARD: {
        whileHover: { y: -8 }
      },
      SALE_BADGE: {
        initial: { scale: 0.8, opacity: 0, rotate: -12 },
        animate: { 
          scale: [0.8, 1.1, 1],
          opacity: 1,
          rotate: [-12, -15, -12]
        }
      }
    }
  } as const;