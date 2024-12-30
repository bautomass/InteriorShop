'use client';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkPlus, Box, ChevronLeft, ChevronRight, Flower, Lightbulb, Maximize, Palette, Search, Share2, Sofa } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

enum CategoryId {
  Lighting = 'lighting',
  Color = 'color',
  Space = 'space',
  Furniture = 'furniture',
  Accessories = 'accessories',
  Organization = 'organization'
}

interface Tip {
  id: string;
  title: string;
  image: string;
  description: string;
  category: string;
  readTime: string;
  authorTip: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'High' | 'Medium' | 'Low';
}

interface InteriorTipsData {
  [CategoryId.Lighting]: Tip[];
  [CategoryId.Color]: Tip[];
  [CategoryId.Space]: Tip[];
  [CategoryId.Furniture]: Tip[];
  [CategoryId.Accessories]: Tip[];
  [CategoryId.Organization]: Tip[];
}

interface Category {
  id: CategoryId;
  name: string;
  icon: React.FC<{ className?: string }>;
}

interface TipCardProps {
  tip: Tip;
  onSave: (tipId: string) => void;
  isSaved: boolean;
  onShare: (tip: Tip) => Promise<void>;
}

const interiorTips: InteriorTipsData = {
    lighting: [
      {
        id: "l1",
        title: "Natural Light Maximization",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/natural-light-interior.jpg",
        description: "Maximize natural light in your space by using sheer curtains or blinds that allow light to filter through. Large windows, skylights, and strategically placed mirrors can help enhance natural light.",
        category: "Lighting",
        readTime: "2 min",
        authorTip: "Place mirrors opposite windows to double the natural light effect",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "l2",
        title: "Layered Lighting Design",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/layered-lighting.jpg",
        description: "Create ambiance with multiple light sources at different heights. Combine overhead, task, and accent lighting to create depth and functionality.",
        category: "Lighting",
        readTime: "3 min",
        authorTip: "Use dimmer switches for versatile lighting control",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "l3",
        title: "Smart Lighting Solutions",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/smart-lighting.jpg",
        description: "Integrate smart lighting systems to control ambiance, save energy, and enhance security. Program different lighting scenes for various times of day and activities.",
        category: "Lighting",
        readTime: "4 min",
        authorTip: "Create preset scenes for different activities like reading, dining, and entertaining",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "l4",
        title: "Task Lighting Placement",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/task-lighting.jpg",
        description: "Position task lighting to eliminate shadows in work areas. Consider under-cabinet lights for kitchens and adjustable desk lamps for home offices.",
        category: "Lighting",
        readTime: "3 min",
        authorTip: "Install under-cabinet lighting slightly toward the front to avoid countertop glare",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "l5",
        title: "Mood Lighting Techniques",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mood-lighting.jpg",
        description: "Create atmosphere with strategic accent lighting. Use wall sconces, picture lights, and LED strips to highlight architectural features and artwork.",
        category: "Lighting",
        readTime: "3 min",
        authorTip: "Install LED strips behind mirrors or shelving for a floating effect",
        difficulty: "Medium",
        impact: "Medium"
      }
    ],
    color: [
      {
        id: "c1",
        title: "Color Psychology",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/color-psychology.jpg",
        description: "Use colors strategically to influence mood and perception. Cool tones create calm, while warm colors energize spaces.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Start with a neutral base and add color through accessories",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c2",
        title: "60-30-10 Color Rule",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/color-rule.jpg",
        description: "Apply the 60-30-10 rule: 60% dominant color, 30% secondary color, and 10% accent color for balanced room design.",
        category: "Color",
        readTime: "3 min",
        authorTip: "Use the dominant color for walls, secondary for furniture, and accent for accessories",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c3",
        title: "Color Flow Between Rooms",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/color-flow.jpg",
        description: "Create cohesive color transitions between rooms using complementary or analogous color schemes.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Pick one color to repeat in each room for visual continuity",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "c4",
        title: "Paint Finish Selection",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/paint-finish.jpg",
        description: "Choose appropriate paint finishes for different areas: matte for low-traffic areas, semi-gloss for high-traffic and moisture-prone spaces.",
        category: "Color",
        readTime: "3 min",
        authorTip: "Use eggshell finish for main living areas as it hides imperfections well",
        difficulty: "Easy",
        impact: "Medium"
      }
    ],
    space: [
      {
        id: "s1",
        title: "Visual Space Expansion",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/visual-space.jpg",
        description: "Make rooms appear larger using visual tricks like vertical stripes, light colors, and strategic furniture placement.",
        category: "Space Planning",
        readTime: "3 min",
        authorTip: "Use mirrors to create the illusion of more space",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "s2",
        title: "Zoning Open Spaces",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/zoning.jpg",
        description: "Define different areas in open-plan spaces using rugs, lighting, and furniture arrangement to create distinct functional zones.",
        category: "Space Planning",
        readTime: "4 min",
        authorTip: "Use area rugs to anchor different functional spaces",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "s3",
        title: "Vertical Storage Solutions",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/vertical-storage.jpg",
        description: "Maximize vertical space with wall-mounted storage, floating shelves, and floor-to-ceiling cabinets.",
        category: "Space Planning",
        readTime: "3 min",
        authorTip: "Install shelves at varying heights for visual interest and functionality",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "s4",
        title: "Traffic Flow Optimization",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/traffic-flow.jpg",
        description: "Plan furniture placement to create clear pathways and maintain good traffic flow throughout the space.",
        category: "Space Planning",
        readTime: "3 min",
        authorTip: "Leave at least 36 inches for major walkways",
        difficulty: "Medium",
        impact: "High"
      }
    ],
    furniture: [
      {
        id: "f1",
        title: "Furniture Arrangement",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/furniture-arrangement.jpg",
        description: "Create conversation areas and maintain flow with proper furniture placement. Consider traffic patterns and focal points.",
        category: "Furniture",
        readTime: "5 min",
        authorTip: "Leave at least 30 inches of walking space in traffic areas",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "f2",
        title: "Scale and Proportion",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/furniture-scale.jpg",
        description: "Choose furniture that fits the scale of your room. Avoid oversized pieces in small spaces and ensure proper proportions.",
        category: "Furniture",
        readTime: "4 min",
        authorTip: "Measure your space and create a floor plan before purchasing furniture",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "f3",
        title: "Multi-functional Furniture",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/multifunctional-furniture.jpg",
        description: "Maximize space with dual-purpose furniture like ottoman storage, murphy beds, and expandable dining tables.",
        category: "Furniture",
        readTime: "3 min",
        authorTip: "Look for coffee tables with hidden storage compartments",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "f4",
        title: "Upholstery Selection",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/upholstery.jpg",
        description: "Choose appropriate fabrics based on usage, durability needs, and maintenance requirements.",
        category: "Furniture",
        readTime: "4 min",
        authorTip: "Select performance fabrics for high-traffic areas and homes with children or pets",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "f5",
        title: "Statement Pieces",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/statement-furniture.jpg",
        description: "Incorporate eye-catching furniture pieces that serve as focal points and conversation starters.",
        category: "Furniture",
        readTime: "3 min",
        authorTip: "Limit statement pieces to one per room to avoid visual competition",
        difficulty: "Easy",
        impact: "Medium"
      }
    ],
    accessories: [
      {
        id: "a1",
        title: "Plant Styling",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/plant-styling.jpg",
        description: "Incorporate indoor plants to add life, color, and improve air quality. Mix different sizes and varieties for visual interest.",
        category: "Accessories",
        readTime: "3 min",
        authorTip: "Group plants in odd numbers for better visual appeal",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "a2",
        title: "Art Placement",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/art-placement.jpg",
        description: "Hang artwork at eye level and create gallery walls with proper spacing and arrangement.",
        category: "Accessories",
        readTime: "4 min",
        authorTip: "Position art at 57-60 inches from the floor to center",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "a3",
        title: "Textile Layering",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/textile-layering.jpg",
        description: "Add depth and comfort with layered textiles. Mix textures and patterns in throws, pillows, and rugs.",
        category: "Accessories",
        readTime: "3 min",
        authorTip: "Use the rule of three when mixing patterns: large, medium, and small scale",
        difficulty: "Easy",
        impact: "Medium"
      }
    ],
    organization: [
      {
        id: "o1",
        title: "Decluttering Strategies",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/decluttering.jpg",
        description: "Implement effective decluttering methods to maintain organized and peaceful spaces.",
        category: "Organization",
        readTime: "4 min",
        authorTip: "Follow the one-in-one-out rule when acquiring new items",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "o2",
        title: "Hidden Storage",
        image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/hidden-storage.jpg",
        description: "Incorporate clever storage solutions that maintain clean aesthetics while maximizing space.",
        category: "Organization",
        readTime: "3 min",
        authorTip: "Use furniture with built-in storage capabilities",
        difficulty: "Medium",
        impact: "High"
      }
    ]
  };

  const categories: Category[] = [
    { id: CategoryId.Lighting, name: 'Lighting', icon: Lightbulb },
    { id: CategoryId.Color, name: 'Color & Paint', icon: Palette },
    { id: CategoryId.Space, name: 'Space Planning', icon: Maximize },
    { id: CategoryId.Furniture, name: 'Furniture', icon: Sofa },
    { id: CategoryId.Accessories, name: 'Accessories', icon: Flower },
    { id: CategoryId.Organization, name: 'Organization', icon: Box }
  ];

const TipCard = memo(function TipCard({ tip, onSave, isSaved, onShare }: TipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-stone-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={tip.image}
          alt={tip.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <h3 className="text-white text-xl font-medium">{tip.title}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onShare(tip)}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => onSave(tip.id)}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              {isSaved ? (
                <BookmarkPlus className="w-4 h-4 text-blue-400" />
              ) : (
                <Bookmark className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-700 text-sm text-stone-600 dark:text-stone-300">
            {tip.category}
          </span>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {tip.readTime}
          </span>
        </div>
        <p className="text-stone-600 dark:text-stone-300 mb-4">
          {tip.description}
        </p>
        <div className="bg-stone-50 dark:bg-stone-700/50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 mt-1" />
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-100 mb-1">Pro Tip</p>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                {tip.authorTip}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-stone-500 dark:text-stone-400">Difficulty: </span>
              <span className="text-stone-700 dark:text-stone-200">{tip.difficulty}</span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400">Impact: </span>
              <span className="text-stone-700 dark:text-stone-200">{tip.impact}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const InteriorTipsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(CategoryId.Lighting);
  const [savedTips, setSavedTips] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async (tip: Tip): Promise<void> => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: tip.title,
          text: tip.description,
          url: window.location.href
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, []);

  const toggleSave = useCallback((tipId: string): void => {
    setSavedTips(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(tipId)) {
        newSaved.delete(tipId);
      } else {
        newSaved.add(tipId);
      }
      return newSaved;
    });
  }, []);

  const filteredTips = useMemo(() => {
    const tips = interiorTips[selectedCategory] ?? [];
    const searchLower = searchTerm.toLowerCase();
    
    return tips.filter(tip =>
      tip.title.toLowerCase().includes(searchLower) ||
      tip.description.toLowerCase().includes(searchLower)
    );
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = useCallback((categoryId: CategoryId): void => {
    setSelectedCategory(categoryId);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = categoriesRef.current;
    if (container) {
      const scrollAmount = 200; // Adjust this value as needed
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-16 bg-stone-50 dark:bg-stone-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-serif text-stone-800 dark:text-stone-100 mb-4">
            Interior Design Tips & Tricks
          </h2>
          <p className="text-stone-600 dark:text-stone-300">
            Discover expert tips and creative ideas to transform your space
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
          </div>
        </div>

        {/* Updated Categories Section */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white dark:bg-stone-800 shadow-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            </button>
          </div>

          <div 
            ref={categoriesRef}
            className="flex gap-4 overflow-x-hidden scroll-smooth px-10"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white dark:bg-stone-800 shadow-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-stone-600 dark:text-stone-300" />
            </button>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onSave={toggleSave}
              isSaved={savedTips.has(tip.id)}
              onShare={handleShare}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteriorTipsSection;