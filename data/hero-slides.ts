export interface HeroSlide {
  id: string;
  image: string;
  mobileImage: string;
  alt: string;
  title: string;
  subtitle?: string;
  lampImage?: string;
  productLink?: string;
  menu: {
    items: Array<{
      label: string;
      link: string;
      description?: string;
    }>;
    position?: 'left' | 'right';
    style?: 'minimal' | 'elegant' | 'modern' | 'classic' | 'bold';
    alignment?: 'top' | 'middle' | 'center';
  };
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-1.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-1-mobile.jpg',
    alt: 'Simple Interior Ideas',
    title: 'Modern Living',
    subtitle: 'Discover our curated collection',
    menu: {
      items: [
        { label: 'Living Room', link: '/collections/living-room' },
        { label: 'Bedroom', link: '/collections/bedroom' },
        { label: 'Dining', link: '/collections/dining' }
      ],
      position: 'right'
    }
  },
  {
    id: 'slide-2',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-2.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-2-mobile.jpg',
    alt: 'Minimalist Design',
    title: 'Minimalist Beauty',
    subtitle: 'Less is more',
    menu: {
      items: [
        { label: 'Minimalist', link: '/collections/minimalist' },
        { label: 'Essentials', link: '/collections/essentials' }
      ],
      position: 'left'
    }
  },
  {
    id: 'slide-3',
    image: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-3.jpg',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hero-3-mobile.jpg',
    alt: 'Lighting Collection',
    title: 'Illuminate Your Space',
    subtitle: 'Modern lighting solutions',
    menu: {
      items: [
        { label: 'Pendant Lights', link: '/collections/pendant-lights' },
        { label: 'Table Lamps', link: '/collections/table-lamps' },
        { label: 'Floor Lamps', link: '/collections/floor-lamps' }
      ],
      position: 'right'
    }
  }
]; 