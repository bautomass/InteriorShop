// components/product/product-tabs.tsx
'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe2,
  HeartHandshake,
  Shield,
  Ship,
  Sparkles,
  Star
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

            <div className="relative">
              <button
                onClick={() => scroll('left')}
                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-gray-50 ${!scrollState.canScrollLeft && 'opacity-0'} md:-left-4`}
                disabled={!scrollState.canScrollLeft}
              >
                <ChevronLeft className="h-5 w-5 text-[#6B5E4C]" />
              </button>

              <div
                ref={reviewsRef}
                onScroll={checkScrollability}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-6 scrollbar-hide"
              >
                {tab.content.testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="min-w-[300px] flex-shrink-0 snap-center rounded-xl bg-white/80 p-6 shadow-sm transition-transform hover:scale-[1.02] sm:min-w-[350px] lg:min-w-[400px]"
                  >
                    <ReviewStars rating={testimonial.rating} />
                    <h4 className="mt-4 font-medium text-[#6B5E4C]">{testimonial.title}</h4>
                    <p className="mt-2 line-clamp-4 text-sm text-[#8C7E6A]">{testimonial.text}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-[#8C7E6A]">
                      <div className="flex flex-col">
                        <span className="font-medium">{testimonial.name}</span>
                        <span>{testimonial.location}</span>
                      </div>
                      <span>{testimonial.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scroll('right')}
                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-gray-50 ${!scrollState.canScrollRight && 'opacity-0'} md:-right-4`}
                disabled={!scrollState.canScrollRight}
              >
                <ChevronRight className="h-5 w-5 text-[#6B5E4C]" />
              </button>
            </div>
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
