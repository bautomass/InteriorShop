// components/product/product-tabs.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe2,
  HeartHandshake,
  Shield,
  Ship,
  Sparkles,
  Star,
  ThumbsUp
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { CareInstructions } from './care-instructions';

interface TabBase {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ShippingTab extends TabBase {
  id: 'shipping';
  content: {
    title: string;
    description: string;
    points: Array<{
      icon: LucideIcon;
      title: string;
      description: string;
    }>;
  };
}

interface QualityTab extends TabBase {
  id: 'quality';
  content: {
    title: string;
    description: string;
    points: Array<{
      icon: LucideIcon;
      title: string;
      description: string;
    }>;
  };
}

interface ReviewsTab extends TabBase {
  id: 'reviews';
  content: {
    title: string;
    description?: string;
    testimonials: Array<{
      id: number;
      rating: number;
      name: string;
      location: string;
      date: string;
      title: string;
      text: string;
      verified: boolean;
      purchaseDate?: string;
      helpfulCount?: number;
      replyCount?: number;
      images?: string[];
    }>;
  };
}

interface CareTab extends TabBase {
  id: 'care';
  content: {
    title: string;
    description: string;
  };
}

type Tab = ShippingTab | QualityTab | ReviewsTab | CareTab;

// Type guards
function isShippingTab(tab: Tab): tab is ShippingTab {
  return tab.id === 'shipping';
}

function isQualityTab(tab: Tab): tab is QualityTab {
  return tab.id === 'quality';
}

function isReviewsTab(tab: Tab): tab is ReviewsTab {
  return tab.id === 'reviews';
}

function isCareTab(tab: Tab): tab is CareTab {
  return tab.id === 'care';
}

const getTabById = (id: Tab['id']): Tab => {
  const tab = tabs.find((t) => t.id === id);
  if (!tab) throw new Error(`Tab with id ${id} not found`);
  return tab;
};

const INITIAL_TAB_ID = 'shipping' as const;

const tabs: Tab[] = [
  {
    id: 'shipping',
    label: 'Shipping Process',
    icon: Ship,
    content: {
      title: 'Our Unique Shipping Journey',
      description: `We believe in transparency about our 25-40 day shipping timeline. Here's why it takes this long:`,
      points: [
        {
          icon: Globe2,
          title: 'Artisanal Production',
          description:
            'Each piece is carefully crafted to order, ensuring the highest quality and reducing waste.'
        },
        {
          icon: Clock,
          title: 'Quality Control',
          description:
            'Multiple inspection points guarantee that only perfect items leave our facility.'
        },
        {
          icon: Ship,
          title: 'Eco-Conscious Shipping',
          description:
            'We use cost-effective sea freight to reduce our carbon footprint and keep prices affordable.'
        }
      ]
    }
  },
  {
    id: 'quality',
    label: 'Quality Guarantee',
    icon: Award,
    content: {
      title: 'Our Quality Promise',
      description: 'Every product meets our strict quality standards:',
      points: [
        {
          icon: Shield,
          title: 'Premium Materials',
          description: 'We source only the finest materials from trusted suppliers.'
        },
        {
          icon: Sparkles,
          title: 'Expert Craftsmanship',
          description: 'Each piece is crafted by skilled artisans with years of experience.'
        },
        {
          icon: HeartHandshake,
          title: 'Lifetime Warranty',
          description: 'We stand behind our products with a comprehensive lifetime warranty.'
        }
      ]
    }
  },
  {
    id: 'reviews',
    label: 'Customer Reviews',
    icon: Star,
    content: {
      title: 'What Our Customers Say',
      testimonials: [
        {
          id: 1,
          rating: 5,
          name: 'Sarah Mitchell',
          location: 'United States',
          date: '2 weeks ago',
          title: 'Exceptional Quality & Service',
          text: "I've been consistently impressed with the quality of products and attention to detail. The sustainable packaging and personal touch make every purchase special. Their customer service is outstanding!",
          verified: true
        },
        {
          id: 2,
          rating: 5,
          name: 'James Wilson',
          location: 'United Kingdom',
          date: '1 month ago',
          title: 'Worth Every Penny',
          text: 'The craftsmanship is extraordinary. Yes, shipping takes a bit longer, but the wait is absolutely worth it. Each piece feels unique and special. Will definitely order again!',
          verified: true
        },
        {
          id: 3,
          rating: 5,
          name: 'Emma Rodriguez',
          location: 'Canada',
          date: '2 months ago',
          title: 'Sustainable Luxury',
          text: 'Love their commitment to sustainability! The eco-friendly packaging and materials show they really care about the environment. The products are beautiful and well-made.',
          verified: true
        },
        {
          id: 4,
          rating: 5,
          name: 'Michael Chen',
          location: 'Singapore',
          date: '3 weeks ago',
          title: 'Outstanding Global Service',
          text: 'Impressed by their international shipping service. The package arrived perfectly wrapped, and the product quality exceeded my expectations. Their attention to detail is remarkable!',
          verified: true
        },
        {
          id: 5,
          rating: 5,
          name: 'Sophie Laurent',
          location: 'France',
          date: '1 month ago',
          title: 'Elegant & Sustainable',
          text: 'The perfect blend of luxury and sustainability. Each piece tells a story of craftsmanship and environmental consciousness. The packaging was plastic-free and beautiful!',
          verified: true
        },
        {
          id: 6,
          rating: 5,
          name: 'David Thompson',
          location: 'Australia',
          date: '6 weeks ago',
          title: 'Worth the Wait',
          text: 'Although shipping to Australia took some time, the quality of the products made it absolutely worth the wait. Their customer service kept me updated throughout the process.',
          verified: true
        },
        {
          id: 7,
          rating: 5,
          name: 'Isabella Martinez',
          location: 'Spain',
          date: '2 months ago',
          title: 'Exceptional Quality',
          text: 'Every detail shows their commitment to quality. From the moment you open the package to using the product, you can feel the dedication to excellence. Highly recommended!',
          verified: true
        },
        {
          id: 8,
          rating: 5,
          name: 'Oliver Schmidt',
          location: 'Germany',
          date: '2.5 months ago',
          title: 'Perfect Gift Choice',
          text: "Ordered as a gift and couldn't be happier. The presentation was beautiful, and the recipient was thrilled with the quality. The sustainable packaging made it even more special.",
          verified: true
        },
        {
          id: 9,
          rating: 5,
          name: 'Anna Kowalski',
          location: 'Poland',
          date: '3 months ago',
          title: 'Superb Customer Service',
          text: 'Had a question about my order and their response was quick and helpful. The product arrived exactly as described, and the quality is outstanding. Will definitely shop here again!',
          verified: true
        },
        {
          id: 10,
          rating: 5,
          name: "Liam O'Connor",
          location: 'Ireland',
          date: '3.5 months ago',
          title: 'Fantastic Experience',
          text: 'From browsing to delivery, everything was perfect. The website is easy to navigate, and the product quality is exceptional. Love their commitment to sustainable practices!',
          verified: true
        }
      ]
    }
  },
  {
    id: 'care',
    label: 'Care Instructions',
    icon: Sparkles,
    content: {
      title: 'Product Care Guide',
      description: 'Select a category to view specific care instructions:'
    }
  }
] as const;

const ReviewStars = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: rating }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
));

const TabButton = memo(
  ({ tab, isActive, onClick }: { tab: Tab; isActive: boolean; onClick: () => void }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm transition-all duration-300 sm:text-base ${
        isActive
          ? 'border border-b-0 border-[#B5A48B]/20 bg-white text-[#6B5E4C]'
          : 'bg-[#6B5E4C]/5 text-[#6B5E4C] hover:bg-[#6B5E4C]/10'
      } ${isActive ? 'z-10' : 'z-0'} `}
    >
      <tab.icon className="h-4 w-4" />
      <span className="hidden sm:inline">{tab.label}</span>
      {isActive && <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-white" />}
    </motion.button>
  )
);

TabButton.displayName = 'TabButton';
ReviewStars.displayName = 'ReviewStars';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class TabErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-600">Something went wrong loading this tab.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add new interface and components
interface Testimonial {
  id: number;
  rating: number;
  name: string;
  location: string;
  date: string;
  title: string;
  text: string;
  verified: boolean;
  purchaseDate?: string;
  helpfulCount?: number;
  replyCount?: number;
  images?: string[];
}

const VerifiedBadge = memo(() => (
  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 transition-opacity">
    <CheckCircle className="h-3 w-3" />
    Verified Purchase
  </span>
));
VerifiedBadge.displayName = 'VerifiedBadge';

// Add ReviewCardProps interface
interface ReviewCardProps {
  review: {
    id: number;
    name: string;
    location: string;
    rating: number;
    title: string;
    text: string;
    date: string;
    verified: boolean;
  };
  helpfulCount: number;
  onHelpful: () => void;
}

// Replace existing ReviewCard component
const ReviewCard = memo(({ review }: { review: Testimonial }) => {
  const [helpfulCount, setHelpfulCount] = useState(() => {
    const initialCount = Math.floor(Math.random() * 4) + 1;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`helpful-${review.id}`);
      return saved ? JSON.parse(saved) : initialCount;
    }
    return initialCount;
  });
  
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`voted-${review.id}`) === 'true';
    }
    return false;
  });

  const handleHelpfulClick = () => {
    if (!hasVoted) {
      const newCount = helpfulCount + 1;
      setHelpfulCount(newCount);
      setHasVoted(true);
      localStorage.setItem(`helpful-${review.id}`, JSON.stringify(newCount));
      localStorage.setItem(`voted-${review.id}`, 'true');
    }
  };

  return (
    <motion.div 
      layout
      className="flex h-full flex-col rounded-xl bg-white p-6 shadow-md"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{review.name}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{review.location}</span>
            </div>
          </div>
          <ReviewStars rating={review.rating} />
        </div>
        
        {review.verified && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              <Check className="w-3 h-3 mr-1" />
              Verified Purchase
            </span>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex-grow">
        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
        <p className="text-gray-600 text-sm line-clamp-4">{review.text}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleHelpfulClick}
          disabled={hasVoted}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors
            ${hasVoted 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-gray-500' : ''}`} />
          <span>Helpful</span>
          <span className="text-gray-400">({helpfulCount})</span>
        </button>
      </div>
    </motion.div>
  );
});

// Replace existing ReviewsContainer component
const ReviewsContainer = memo(({ testimonials }: { testimonials: Testimonial[] }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const reviewsPerPage = 3;
  const pageCount = Math.ceil(testimonials.length / reviewsPerPage);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < pageCount) {
      setPage([newPage, newDirection]);
    }
  };

  return (
    <div className="relative w-full px-4">
      <button 
        onClick={() => paginate(-1)}
        className={`absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur transition-all 
          hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none`}
        disabled={page === 0}
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="grid grid-cols-3 gap-6"
        >
          {testimonials
            .slice(page * reviewsPerPage, (page + 1) * reviewsPerPage)
            .map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
        </motion.div>
      </AnimatePresence>

      <button 
        onClick={() => paginate(1)}
        className={`absolute -right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur transition-all 
          hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none`}
        disabled={page === pageCount - 1}
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
});

ReviewsContainer.displayName = 'ReviewsContainer';
ReviewCard.displayName = 'ReviewCard';

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState<Tab['id']>(INITIAL_TAB_ID);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: true
  });

  const checkScrollability = useCallback(() => {
    const element = reviewsRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    setScrollState({
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft < scrollWidth - clientWidth - 10
    });
  }, []);

  // Add resize observer
  useEffect(() => {
    const element = reviewsRef.current;
    if (!element) return;

    const observer = new ResizeObserver(checkScrollability);
    observer.observe(element);
    return () => observer.disconnect();
  }, [checkScrollability]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const element = reviewsRef.current;
    if (!element) return;

    const scrollAmount = element.clientWidth * (direction === 'left' ? -0.8 : 0.8);
    element.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const renderTabContent = (activeTab: Tab['id']) => {
    const tab = getTabById(activeTab);

    return (
      <TabErrorBoundary>
        {isShippingTab(tab) && (
          <div className="space-y-6">
            <h3 className="text-xl font-light text-[#6B5E4C] sm:text-2xl">{tab.content.title}</h3>
            <p className="text-[#8C7E6A]">{tab.content.description}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tab.content.points.map((point, index) => (
                <div key={index} className="rounded-xl bg-white/80 p-4 shadow-sm sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B5E4C]/10">
                      <point.icon className="h-4 w-4 text-[#6B5E4C]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-[#6B5E4C]">{point.title}</h4>
                      <p className="text-sm text-[#8C7E6A]">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isQualityTab(tab) && (
          <div className="space-y-6">
            <h3 className="text-xl font-light text-[#6B5E4C] sm:text-2xl">{tab.content.title}</h3>
            <p className="text-[#8C7E6A]">{tab.content.description}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tab.content.points.map((point, index) => (
                <div key={index} className="rounded-xl bg-white/80 p-4 shadow-sm sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B5E4C]/10">
                      <point.icon className="h-4 w-4 text-[#6B5E4C]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-[#6B5E4C]">{point.title}</h4>
                      <p className="text-sm text-[#8C7E6A]">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {isReviewsTab(tab) && (
        <div className="space-y-8">
          <h3 className="text-xl font-light text-[#6B5E4C] sm:text-2xl">{tab.content.title}</h3>
          <ReviewsContainer testimonials={tab.content.testimonials} />
        </div>
      )}

        {isCareTab(tab) && <CareInstructions />}
      </TabErrorBoundary>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 mx-auto mt-12 w-full max-w-[1400px] px-4 sm:px-6 lg:px-8"
    >
      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={isActive}
              onClick={() => setActiveTab(tab.id)}
            />
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="-mt-[1px] rounded-lg rounded-tl-none border border-[#B5A48B]/20 bg-white p-6 sm:p-8">
        {renderTabContent(activeTab)}
      </div>
    </motion.div>
  );
}
