import type { Product } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Eye, Info, Leaf, Sparkles, TreePine, Hammer, Shield, X } from 'lucide-react'
import { useState } from 'react'

const badges = [
  {
    id: 'natural-wood',
    title: 'Natural Wood',
    icon: <TreePine className="h-4 w-4 text-primary-600 dark:text-primary-300" />,
    benefits: [
      'Sustainably sourced wood',
      'Natural grain patterns',
      'Durable construction',
      'Timeless appeal'
    ],
    keywords: [
      'wood', 'wooden', 'oak', 'pine', 'maple', 'walnut', 'birch', 'teak', 
      'mahogany', 'bamboo', 'timber', 'solid wood', 'hardwood'
    ]
  },
  {
    id: 'artisan-metal',
    title: 'Artisan Metal',
    icon: <Hammer className="h-4 w-4 text-primary-600 dark:text-primary-300" />,
    benefits: [
      'Hand-forged details',
      'Premium metal finish',
      'Corrosion resistant',
      'Industrial strength'
    ],
    keywords: [
      'metal', 'brass', 'copper', 'steel', 'iron', 'aluminum', 'bronze',
      'metallic', 'chrome', 'stainless', 'forged', 'wrought iron'
    ]
  },
  {
    id: 'natural-fiber',
    title: 'Natural Fiber',
    icon: <Leaf className="h-4 w-4 text-primary-600 dark:text-primary-300" />,
    benefits: [
      'Eco-friendly materials',
      'Handwoven details',
      'Natural textures',
      'Sustainable choice'
    ],
    keywords: [
      'rattan', 'wicker', 'bamboo', 'jute', 'seagrass', 'cane', 'fiber',
      'woven', 'natural', 'organic', 'handwoven', 'weave'
    ]
  },
  {
    id: 'premium-design',
    title: 'Premium Design',
    icon: <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-300" />,
    benefits: [
      'Designer crafted',
      'Luxury materials',
      'Modern aesthetics',
      'Unique details'
    ],
    keywords: [
      'luxury', 'premium', 'designer', 'modern', 'contemporary', 'elegant',
      'high-end', 'exclusive', 'artisan', 'handcrafted', 'bespoke', 'custom'
    ]
  },
  {
    id: 'eye-comfort',
    title: 'Eye Comfort',
    icon: <Eye className="h-4 w-4 text-primary-600 dark:text-primary-300" />,
    benefits: [
      'Reduced eye strain',
      'Anti-glare technology',
      'Adjustable brightness',
      'Optimal light distribution'
    ],
    keywords: [
      'LED', 'eye-friendly', 'dimmable', 'adjustable', 'glare-free',
      'flicker-free', 'comfort', 'strain', 'brightness', 'lighting'
    ]
  },
  {
    id: 'quality-certified',
    title: 'Quality Certified',
    icon: <Shield className="h-4 w-4 text-primary-600 dark:text-primary-300" />,
    benefits: [
      'Safety certified',
      'Quality tested',
      'UL listed',
      'CE certified'
    ],
    keywords: [
      'certified', 'UL listed', 'CE marked', 'safety', 'tested', 'approved',
      'quality', 'standard', 'certification', 'compliance', 'warranty'
    ]
  },
  {
    id: 'stone-marble',
    title: 'Premium Stone',
    icon: <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-300" />,
    benefits: [
      'Natural stone finish',
      'Unique patterns',
      'Durable material',
      'Timeless elegance'
    ],
    keywords: [
      'marble', 'stone', 'granite', 'travertine', 'slate', 'onyx',
      'limestone', 'concrete', 'terrazzo', 'ceramic', 'porcelain'
    ]
  }
]

const selectRelevantBadges = (product: Product) => {
  if (!product?.title && !product?.description) return []

  const text = `${product.title || ''} ${product.description || ''}`.toLowerCase()
  
  // Score each badge based on keyword matches with weighted importance
  const badgeScores = badges.map(badge => {
    const keywordMatches = badge.keywords.reduce((score, keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'g')
      const matches = (text.match(regex) || []).length
      
      // Give extra weight to material matches in the title
      const titleMatches = (product.title?.toLowerCase().match(regex) || []).length
      return score + matches + (titleMatches * 2) // Title matches count double
    }, 0)

    return {
      ...badge,
      score: keywordMatches
    }
  })

  // Sort by score and take top 2 badges, but only if they have matches
  return badgeScores
    .filter(badge => badge.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
}

export const TrustBadges = ({ product }: { product: Product }) => {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const displayedBadges = selectRelevantBadges(product)

  if (!product || displayedBadges.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {displayedBadges.map((badge) => (
          <button
            key={badge.id}
            onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs",
              "bg-primary-50 dark:bg-primary-900",
              "border border-primary-200 dark:border-primary-800",
              "hover:border-primary-300 dark:hover:border-primary-700",
              "transition-all duration-200"
            )}
          >
            <span>{badge.icon}</span>
            <span className="text-primary-800 dark:text-primary-200">{badge.title}</span>
            <Info className="h-3 w-3 text-primary-400" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden"
          >
            <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-4 pr-12">
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute right-2 top-2 p-1 text-primary-400 hover:text-primary-600"
              >
                <X className="h-4 w-4" />
              </button>
              <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
                {badges.find(b => b.id === selectedBadge)?.title}
              </h4>
              <ul className="space-y-1">
                {badges.find(b => b.id === selectedBadge)?.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-primary-600 dark:text-primary-300">
                    • {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 