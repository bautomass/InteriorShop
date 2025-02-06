// components/product/care-instructions.tsx
'use client';

import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';

type InstructionType = 'daily' | 'maintenance' | 'warnings';

type CareCategory = {
  id: string;
  title: string;
  instructions: Record<InstructionType, string[]>;
};

// Normalize ID function to ensure consistent case handling
const normalizeId = (id: string) => id.toUpperCase().replace(/-/g, '_');

const careInstructions: Record<string, CareCategory> = {
  ALL: {
    id: 'ALL',
    title: 'All Products',
    instructions: {
      daily: [
        'Dust regularly with a soft, lint-free cloth',
        'Keep away from direct sunlight to prevent fading',
        'Maintain consistent room temperature (18-24°C)',
        'Ensure proper ventilation in storage areas',
        'Clean spills immediately to prevent staining'
      ],
      maintenance: [
        'Clean according to specific material guidelines',
        'Inspect regularly for signs of wear or damage',
        'Store properly when not in use',
        'Document any repairs or maintenance performed',
        'Rotate items periodically to ensure even wear'
      ],
      warnings: [
        'Avoid extreme temperature fluctuations',
        'Keep away from high moisture areas',
        'Handle with clean, dry hands',
        'Do not use harsh chemical cleaners',
        'Avoid placing heavy items on delicate surfaces'
      ]
    }
  },
  ACCESSORIES: {
    id: 'ACCESSORIES',
    title: 'Accessories',
    instructions: {
      daily: [
        'Dust with a soft, dry microfiber cloth',
        'Store in designated containers or displays',
        'Avoid direct sunlight exposure',
        'Remove when exercising or sleeping',
        'Check clasps and fastenings daily'
      ],
      maintenance: [
        'Clean with appropriate metal/material cleaner',
        'Inspect joints and connections monthly',
        'Polish metals with suitable products',
        'Store in anti-tarnish bags when not in use',
        'Maintain proper humidity levels in storage'
      ],
      warnings: [
        'Avoid contact with perfumes and chemicals',
        'Do not use abrasive cleaning materials',
        'Keep away from extreme temperatures',
        'Remove before swimming or bathing',
        'Avoid exposure to household cleaning products'
      ]
    }
  },
  BASKETS: {
    id: 'BASKETS',
    title: 'Baskets',
    instructions: {
      daily: [
        'Dust with a soft brush or vacuum attachment',
        'Keep in well-ventilated spaces',
        'Monitor weight distribution',
        'Check for moisture accumulation',
        'Maintain proper positioning'
      ],
      maintenance: [
        'Clean with a slightly damp cloth monthly',
        'Reshape gently if deformed',
        'Check weaving for loose strands',
        'Apply protective coating annually',
        'Rotate usage to prevent wear'
      ],
      warnings: [
        'Avoid prolonged moisture exposure',
        'Keep away from direct heat sources',
        'Do not exceed weight capacity',
        'Prevent contact with sharp objects',
        'Avoid stacking heavy items'
      ]
    }
  },
  CANDLES: {
    id: 'CANDLES',
    title: 'Candles',
    instructions: {
      daily: [
        'Trim wick to 1/4 inch before lighting',
        'Burn for 2-4 hours maximum',
        'Keep away from drafts',
        'Center wick after each use',
        'Clean soot from container'
      ],
      maintenance: [
        'Store in a cool, dark place',
        'Keep wax pool free of debris',
        'Maintain proper wick position',
        'Check for container damage',
        'Clean surface before lighting'
      ],
      warnings: [
        'Never leave burning unattended',
        'Keep away from flammable materials',
        'Use on heat-resistant surfaces',
        'Keep out of reach of children and pets',
        'Maintain proper ventilation'
      ]
    }
  },
  CANVAS: {
    id: 'CANVAS',
    title: 'Canvas',
    instructions: {
      daily: [
        'Dust with a soft, dry brush',
        'Monitor environmental conditions',
        'Check frame alignment',
        'Maintain proper spacing from walls',
        'Inspect for signs of damage'
      ],
      maintenance: [
        'Professional cleaning when needed',
        'Check stretcher keys quarterly',
        'Monitor canvas tension',
        'Inspect backing and frame',
        'Document condition changes'
      ],
      warnings: [
        'Avoid direct water contact',
        'No harsh cleaning solutions',
        'Prevent physical impact',
        'Avoid extreme humidity',
        'Handle only with clean, dry hands'
      ]
    }
  },
  CARPETS: {
    id: 'CARPETS',
    title: 'Carpets',
    instructions: {
      daily: [
        'Vacuum high-traffic areas daily',
        'Rotate periodically for even wear',
        'Blot spills immediately',
        'Remove debris promptly',
        'Check for loose fibers'
      ],
      maintenance: [
        'Deep clean professionally annually',
        'Use appropriate carpet protectors',
        'Brush in pile direction',
        'Check for moth damage',
        'Clean edges and corners thoroughly'
      ],
      warnings: [
        'Avoid harsh cleaning chemicals',
        'Prevent direct sunlight exposure',
        'Do not rub stains aggressively',
        'Keep away from heat sources',
        'Avoid walking with outdoor shoes'
      ]
    }
  },
  CURTAINS: {
    id: 'CURTAINS',
    title: 'Curtains',
    instructions: {
      daily: [
        'Dust with appropriate fabric brush',
        'Open and close gently',
        'Check hanging position',
        'Remove surface dust',
        'Maintain proper pleating'
      ],
      maintenance: [
        'Professional cleaning bi-annually',
        'Check hardware monthly',
        'Steam if needed',
        'Rotate exposure to sun',
        'Inspect for damage'
      ],
      warnings: [
        'Avoid aggressive pulling',
        'Keep away from radiators',
        'Follow care label exactly',
        'Prevent pet damage',
        'Avoid direct sunlight'
      ]
    }
  },
  DRIED_FLOWERS: {
    id: 'DRIED_FLOWERS',
    title: 'Dried Flowers',
    instructions: {
      daily: [
        'Dust with soft feather duster',
        'Monitor humidity levels',
        'Check for color preservation',
        'Maintain arrangement position',
        'Protect from air movement'
      ],
      maintenance: [
        'Use compressed air cleaning',
        'Check stem stability',
        'Refresh arrangement monthly',
        'Monitor for pest activity',
        'Document color changes'
      ],
      warnings: [
        'Never add water',
        'Avoid humid environments',
        'Handle with extreme care',
        'Keep away from heat sources',
        'Prevent direct touching'
      ]
    }
  },
  FOR_KITCHEN: {
    id: 'FOR_KITCHEN',
    title: 'For Kitchen',
    instructions: {
      daily: [
        'Clean after each use thoroughly',
        'Sanitize food contact surfaces',
        'Check for damage or wear',
        'Store in designated areas',
        'Maintain proper organization'
      ],
      maintenance: [
        'Deep clean weekly',
        'Sharpen knives regularly',
        'Check appliance functionality',
        'Descale water-using items',
        'Organize storage systems'
      ],
      warnings: [
        'Follow food safety guidelines',
        'Use appropriate cleaners',
        'Check electrical safety',
        'Prevent cross-contamination',
        'Monitor for pest activity'
      ]
    }
  },
  FURNITURE: {
    id: 'FURNITURE',
    title: 'Furniture',
    instructions: {
      daily: [
        'Dust with appropriate cloth',
        'Use coasters and protective pads',
        'Check stability daily',
        'Remove spills immediately',
        'Maintain proper positioning'
      ],
      maintenance: [
        'Polish wood monthly',
        'Tighten hardware regularly',
        'Clean upholstery professionally',
        'Rotate cushions weekly',
        'Check joint stability'
      ],
      warnings: [
        'Avoid dragging on floor',
        'Prevent sun damage',
        'Use proper cleaning products',
        'Do not exceed weight limits',
        'Keep away from heat sources'
      ]
    }
  },
  GIFT_BOXES: {
    id: 'GIFT_BOXES',
    title: 'Gift Boxes',
    instructions: {
      daily: [
        'Store in dry conditions',
        'Handle with clean hands',
        'Maintain shape integrity',
        'Check ribbon condition',
        'Keep dust-free'
      ],
      maintenance: [
        'Clean with dry cloth',
        'Store flat when possible',
        'Reinforce corners',
        'Check decoration security',
        'Monitor for damage'
      ],
      warnings: [
        'Avoid moisture exposure',
        'Prevent heavy stacking',
        'Keep at room temperature',
        'Handle corners carefully',
        'Protect from crushing'
      ]
    }
  },
  GIFTS: {
    id: 'GIFTS',
    title: 'Gifts',
    instructions: {
      daily: [
        'Follow specific item care',
        'Store appropriately',
        'Monitor condition',
        'Maintain cleanliness',
        'Check packaging integrity'
      ],
      maintenance: [
        'Clean according to material',
        'Regular condition checks',
        'Document care history',
        'Update storage as needed',
        'Verify proper environment'
      ],
      warnings: [
        'Follow item-specific warnings',
        'Maintain proper conditions',
        'Handle with appropriate care',
        'Check for damage regularly',
        'Store safely'
      ]
    }
  },
  LAMPS: {
    id: 'LAMPS',
    title: 'Lamps',
    instructions: {
      daily: [
        'Dust with microfiber cloth',
        'Check bulb operation',
        'Inspect cord condition',
        'Clean lamp base',
        'Monitor stability'
      ],
      maintenance: [
        'Clean shade thoroughly',
        'Check electrical connections',
        'Replace bulbs properly',
        'Verify switch operation',
        'Test stability monthly'
      ],
      warnings: [
        'Unplug before cleaning',
        'Use correct bulb type',
        'Keep away from water',
        'Check cord integrity',
        'Maintain proper ventilation'
      ]
    }
  },
  LANTERNS: {
    id: 'LANTERNS',
    title: 'Lanterns',
    instructions: {
      daily: [
        'Clean glass surfaces',
        'Remove dust buildup',
        'Check candle holder',
        'Verify door operation',
        'Monitor metal finish'
      ],
      maintenance: [
        'Polish metal components',
        'Deep clean monthly',
        'Inspect for rust',
        'Clean ventilation holes',
        'Check hanging hardware'
      ],
      warnings: [
        'Use correct candle size',
        'Keep away from flammables',
        'Handle with care when hot',
        'Ensure proper ventilation',
        'Check stability before use'
      ]
    }
  },
  TEXTILES: {
    id: 'TEXTILES',
    title: 'Textiles',
    instructions: {
      daily: [
        'Air out regularly',
        'Remove surface dust',
        'Check for damage',
        'Maintain proper folding',
        'Monitor for stains'
      ],
      maintenance: [
        'Wash according to labels',
        'Iron at proper temperature',
        'Store with cedar blocks',
        'Rotate stored items',
        'Check for moth damage'
      ],
      warnings: [
        'Follow care labels strictly',
        'Avoid harsh detergents',
        'Test cleaning products',
        'Prevent color bleeding',
        'Store properly'
      ]
    }
  },
  VASES: {
    id: 'VASES',
    title: 'Vases',
    instructions: {
      daily: [
        'Clean after flower removal',
        'Dry thoroughly',
        'Check for chips',
        'Monitor water level',
        'Clean exterior surface'
      ],
      maintenance: [
        'Deep clean monthly',
        'Remove mineral deposits',
        'Check for cracks',
        'Clean narrow openings',
        'Verify stability'
      ],
      warnings: [
        'Handle with dry hands',
        'Avoid temperature shock',
        'No abrasive cleaners',
        'Prevent hard impacts',
        'Clean carefully'
      ]
    }
  },
  WALL_DECORS: {
    id: 'WALL_DECORS',
    title: 'Wall Decors',
    instructions: {
      daily: [
        'Dust gently',
        'Check mounting security',
        'Monitor alignment',
        'Inspect for damage',
        'Clean frame surfaces'
      ],
      maintenance: [
        'Verify wall attachments',
        'Clean according to material',
        'Check frame integrity',
        'Adjust positioning',
        'Document condition'
      ],
      warnings: [
        'Use proper wall anchors',
        'Avoid direct sunlight',
        'Handle carefully',
        'Check wall integrity',
        'Monitor humidity exposure'
      ]
    }
  },
  WOODEN_STOOLS: {
    id: 'WOODEN_STOOLS',
    title: 'Wooden Stools',
    instructions: {
      daily: [
        'Wipe with dry cloth',
        'Check stability',
        'Avoid wet surfaces',
        'Monitor leg condition',
        'Clean seat surface'
      ],
      maintenance: [
        'Polish wood monthly',
        'Tighten all hardware',
        'Check leg alignment',
        'Apply wood conditioner',
        'Inspect joints'
      ],
      warnings: [
        'Avoid excessive weight',
        'Keep away from moisture',
        'Prevent dragging',
        'Check weight capacity',
        'Monitor for splits'
      ]
    }
  }
};

export function CareInstructions() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Memoize sorted categories
  const sortedCategories = useMemo(() => {
    return Object.values(careInstructions).sort((a, b) => {
      if (a.id === 'ALL') return -1;
      if (b.id === 'ALL') return 1;
      return a.title.localeCompare(b.title);
    });
  }, []);

  // Memoize sections
  const sections = [
    { title: 'Daily Care', key: 'daily' },
    { title: 'Maintenance', key: 'maintenance' },
    { title: 'Warnings', key: 'warnings' }
  ] as const;

  // Memoize category selection handler
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(normalizeId(categoryId));
  }, []);

  // Get selected category data
  const selectedCategoryData = careInstructions[selectedCategory];

  if (!selectedCategoryData) {
    console.error(`Category not found: ${selectedCategory}`);
    return null;
  }

  // Animation variants for smooth transitions
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 space-y-8">
      {/* Categories - Horizontal scroll on mobile */}
      <motion.div className="relative">
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar min-[865px]:flex-wrap">
          {sortedCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`flex-shrink-0 whitespace-nowrap px-2 py-2 rounded text-sm transition-all
                ${selectedCategory === normalizeId(category.id)
                  ? 'bg-[#6B5E4C] text-white shadow-sm' 
                  : 'bg-[#F5F3F0] text-[#6B5E4C] hover:bg-[#E8E4DE]'}`}
            >
              {category.title}
            </motion.button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white pointer-events-none min-[865px]:hidden" />
      </motion.div>

      {/* Instructions - Stacked on mobile, grid on desktop */}
      <div className="grid grid-cols-1 min-[865px]:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.key}
            layout
            className="bg-white rounded-xl p-6"
          >
            <h4 className="text-[#6B5E4C] font-medium mb-4 flex items-center gap-2">
              {section.title}
            </h4>
            <ul className="space-y-3">
              {selectedCategoryData.instructions[section.key].map((instruction, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className="text-sm text-[#8C7E6A] flex items-start gap-3 group"
                >
                  <span className="text-[#4A8B4A] mt-1 opacity-75 group-hover:opacity-100 transition-opacity">
                    ●
                  </span>
                  <span className="group-hover:text-[#6B5E4C] transition-colors leading-relaxed">
                    {instruction}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}