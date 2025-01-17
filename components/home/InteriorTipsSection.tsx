'use client';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkPlus,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Feather,
  Heart,
  Home,
  Lightbulb,
  Maximize,
  Palette,
  Search,
  Share2,
  Sofa,
  Sun,
  Target
} from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

enum CategoryId {
  Lighting = 'lighting',
  Color = 'color',
  Space = 'space',
  Furniture = 'furniture',
  Accessories = 'accessories',
  Organization = 'organization',
  Photography = 'photography',
  Styling = 'styling',
  Balance = 'balance',
  Atmosphere = 'atmosphere'
}

interface Tip {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  authorTip: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'High' | 'Medium' | 'Low';
  tags?: string[];
  seasons?: string[];
  roomTypes?: string[];
}

interface InteriorTipsData {
  [CategoryId.Lighting]: Tip[];
  [CategoryId.Color]: Tip[];
  [CategoryId.Space]: Tip[];
  [CategoryId.Furniture]: Tip[];
  [CategoryId.Accessories]: Tip[];
  [CategoryId.Organization]: Tip[];
  [CategoryId.Photography]: Tip[];
  [CategoryId.Styling]: Tip[];
  [CategoryId.Balance]: Tip[];
  [CategoryId.Atmosphere]: Tip[];
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
        description: "Create atmosphere with strategic accent lighting. Use wall sconces, picture lights, and LED strips to highlight architectural features and artwork.",
        category: "Lighting",
        readTime: "3 min",
        authorTip: "Install LED strips behind mirrors or shelving for a floating effect",
        difficulty: "Medium",
        impact: "Medium"
      },
      {
        id: "l6",
        title: "Circadian Lighting Design",
        description: "Design lighting that supports natural sleep-wake cycles by adjusting color temperature throughout the day. Implement warmer lights for evening and cooler lights for daytime.",
        category: "Lighting",
        readTime: "4 min",
        authorTip: "Install tunable white LED systems to adjust from 2700K (warm) to 5000K (cool)",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "l7",
        title: "Outdoor Lighting Integration",
        description: "Create seamless transitions between indoor and outdoor spaces with strategic lighting placement. Enhance security and ambiance simultaneously.",
        category: "Lighting",
        readTime: "3 min",
        authorTip: "Use uplighting on trees to create depth and drama in outdoor views",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "l8",
        title: "Energy-Efficient Lighting",
        description: "Optimize your lighting setup for maximum energy efficiency without compromising on style or functionality. Incorporate LED technology and smart controls.",
        category: "Lighting",
        readTime: "4 min",
        authorTip: "Replace halogen bulbs with LED alternatives to reduce energy consumption by up to 85%",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "l9",
        title: "Architectural Lighting Features",
        description: "Highlight architectural elements using sophisticated lighting techniques. Emphasize structural features and create visual interest through light and shadow.",
        category: "Lighting",
        readTime: "5 min",
        authorTip: "Use cove lighting to highlight ceiling details and create indirect ambient light",
        difficulty: "Hard",
        impact: "High"
      }
    ],
    color: [
      {
        id: "c1",
        title: "Color Psychology",
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
        description: "Choose appropriate paint finishes for different areas: matte for low-traffic areas, semi-gloss for high-traffic and moisture-prone spaces.",
        category: "Color",
        readTime: "3 min",
        authorTip: "Use eggshell finish for main living areas as it hides imperfections well",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "c5",
        title: "Color Temperature Balance",
        description: "Master the use of warm and cool colors to create balanced, harmonious spaces. Learn how to mix temperatures effectively.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Add warm accents to cool-toned rooms to prevent them from feeling sterile",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c6",
        title: "Color for Small Spaces",
        description: "Use color strategically to make small spaces feel larger and more inviting. Learn techniques for color placement and proportion.",
        category: "Color",
        readTime: "3 min",
        authorTip: "Paint the ceiling a lighter shade than walls to create the illusion of height",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c7",
        title: "Bold Color Integration",
        description: "Incorporate bold colors confidently into your design scheme. Learn how to use statement colors without overwhelming the space.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Use the boldest color on the wall furthest from the entrance to draw the eye through",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c8",
        title: "Historical Color Palettes",
        description: "Draw inspiration from historical color schemes to create timeless interiors. Adapt traditional palettes for modern spaces.",
        category: "Color",
        readTime: "5 min",
        authorTip: "Reference architectural style when selecting historical color schemes",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "c9",
        title: "Color for Multi-Functional Spaces",
        description: "Design color schemes that support different activities and moods in multi-purpose rooms. Create visual zones through color.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Use color blocking to define different functional areas within the same space",
        difficulty: "Medium",
        impact: "High"
      }
    ],
    space: [
      {
        id: "s1",
        title: "Visual Space Expansion",
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
        description: "Plan furniture placement to create clear pathways and maintain good traffic flow throughout the space.",
        category: "Space Planning",
        readTime: "3 min",
        authorTip: "Leave at least 36 inches for major walkways",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c5",
        title: "Color Temperature Balance",
        description: "Master the use of warm and cool colors to create balanced, harmonious spaces. Learn how to mix temperatures effectively.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Add warm accents to cool-toned rooms to prevent them from feeling sterile",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c6",
        title: "Color for Small Spaces",
        description: "Use color strategically to make small spaces feel larger and more inviting. Learn techniques for color placement and proportion.",
        category: "Color",
        readTime: "3 min",
        authorTip: "Paint the ceiling a lighter shade than walls to create the illusion of height",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c7",
        title: "Bold Color Integration",
        description: "Incorporate bold colors confidently into your design scheme. Learn how to use statement colors without overwhelming the space.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Use the boldest color on the wall furthest from the entrance to draw the eye through",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "c8",
        title: "Historical Color Palettes",
        description: "Draw inspiration from historical color schemes to create timeless interiors. Adapt traditional palettes for modern spaces.",
        category: "Color",
        readTime: "5 min",
        authorTip: "Reference architectural style when selecting historical color schemes",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "c9",
        title: "Color for Multi-Functional Spaces",
        description: "Design color schemes that support different activities and moods in multi-purpose rooms. Create visual zones through color.",
        category: "Color",
        readTime: "4 min",
        authorTip: "Use color blocking to define different functional areas within the same space",
        difficulty: "Medium",
        impact: "High"
      }
    ],
    furniture: [
      {
        id: "f1",
        title: "Furniture Arrangement",
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
        description: "Incorporate eye-catching furniture pieces that serve as focal points and conversation starters.",
        category: "Furniture",
        readTime: "3 min",
        authorTip: "Limit statement pieces to one per room to avoid visual competition",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "f6",
        title: "Custom Furniture Planning",
        description: "Design and specify custom furniture pieces for challenging spaces. Maximize functionality with tailored solutions.",
        category: "Furniture",
        readTime: "5 min",
        authorTip: "Always create detailed drawings with all dimensions before commissioning custom pieces",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "f7",
        title: "Furniture Restoration",
        description: "Learn techniques for restoring and updating existing furniture. Give old pieces new life through refinishing and reupholstery.",
        category: "Furniture",
        readTime: "6 min",
        authorTip: "Test refinishing products on hidden areas first",
        difficulty: "Hard",
        impact: "Medium"
      },
      {
        id: "f8",
        title: "Sustainable Furniture",
        description: "Source and select eco-friendly furniture options. Consider environmental impact and longevity in furniture choices.",
        category: "Furniture",
        readTime: "4 min",
        authorTip: "Look for FSC-certified wood and low-VOC finishes",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "f9",
        title: "Furniture Mixing Styles",
        description: "Successfully combine different furniture styles and periods. Create eclectic yet cohesive spaces.",
        category: "Furniture",
        readTime: "4 min",
        authorTip: "Use consistent finish tones to unite different furniture styles",
        difficulty: "Medium",
        impact: "High"
      }      
    ],
    accessories: [
      {
        id: "a1",
        title: "Plant Styling",
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
        description: "Add depth and comfort with layered textiles. Mix textures and patterns in throws, pillows, and rugs.",
        category: "Accessories",
        readTime: "3 min",
        authorTip: "Use the rule of three when mixing patterns: large, medium, and small scale",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "a4",
        title: "Mirror Placement",
        description: "Strategic mirror placement for both functionality and visual impact. Use mirrors to enhance light and create illusions of space.",
        category: "Accessories",
        readTime: "3 min",
        authorTip: "Position mirrors to reflect pleasant views rather than clutter",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "a5",
        title: "Sculptural Elements",
        description: "Incorporate three-dimensional art and sculptural pieces. Create visual interest through form and texture.",
        category: "Accessories",
        readTime: "4 min",
        authorTip: "Mix organic and geometric shapes for balanced compositions",
        difficulty: "Medium",
        impact: "Medium"
      },
      {
        id: "a6",
        title: "Seasonal Accessories",
        description: "Rotate accessories seasonally to keep spaces fresh and relevant. Create versatile base designs that adapt to seasonal changes.",
        category: "Accessories",
        readTime: "3 min",
        authorTip: "Store off-season accessories in labeled containers by season",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "a7",
        title: "Statement Collections",
        description: "Display collections effectively without creating clutter. Create impactful arrangements of collected items.",
        category: "Accessories",
        readTime: "4 min",
        authorTip: "Group similar items in odd numbers for visual interest",
        difficulty: "Medium",
        impact: "Medium"
      },
      {
        id: "a8",
        title: "Lighting Accessories",
        description: "Select and place decorative lighting fixtures as accessories. Use table lamps, floor lamps, and sconces as decorative elements.",
        category: "Accessories",
        readTime: "3 min",
        authorTip: "Vary light heights to create layered illumination",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "a9",
        title: "Natural Elements",
        description: "Incorporate natural elements like branches, stones, and shells. Create organic displays that connect interior spaces with nature.",
        category: "Accessories",
        readTime: "3 min",
        authorTip: "Rotate natural elements seasonally for freshness",
        difficulty: "Easy",
        impact: "Medium"
      }
    ],
    organization: [
      {
        id: "o1",
        title: "Decluttering Strategies",
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
        description: "Incorporate clever storage solutions that maintain clean aesthetics while maximizing space.",
        category: "Organization",
        readTime: "3 min",
        authorTip: "Use furniture with built-in storage capabilities",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "o3",
        title: "Closet Systems",
        description: "Design and implement effective closet organization systems. Maximize storage space with custom solutions.",
        category: "Organization",
        readTime: "5 min",
        authorTip: "Install adjustable shelving for flexibility as needs change",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "o4",
        title: "Kitchen Organization",
        description: "Create efficient kitchen storage and workflow systems. Optimize cabinet and pantry space for functionality.",
        category: "Organization",
        readTime: "4 min",
        authorTip: "Use clear containers to easily identify pantry items",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "o5",
        title: "Paper Management",
        description: "Develop systems for managing paperwork and documents. Create organized home office spaces.",
        category: "Organization",
        readTime: "3 min",
        authorTip: "Implement a one-touch rule for incoming mail",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "o6",
        title: "Seasonal Storage",
        description: "Plan and execute seasonal storage rotations. Organize off-season items efficiently.",
        category: "Organization",
        readTime: "4 min",
        authorTip: "Use vacuum storage bags for bulky winter items",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "o7",
        title: "Small Space Solutions",
        description: "Maximize organization in compact spaces. Learn creative storage solutions for small apartments and rooms.",
        category: "Organization",
        readTime: "4 min",
        authorTip: "Use vertical space with wall-mounted organizers and over-door solutions",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "o8",
        title: "Digital Organization",
        description: "Create organized systems for charging stations and electronic storage. Manage cord clutter and device storage.",
        category: "Organization",
        readTime: "3 min",
        authorTip: "Label cords with washi tape for easy identification",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "o9",
        title: "Maintenance Systems",
        description: "Develop routines and systems for maintaining organization. Create sustainable organizational habits.",
        category: "Organization",
        readTime: "4 min",
        authorTip: "Schedule 15-minute daily reset sessions to maintain organization",
        difficulty: "Medium",
        impact: "High"
      }
    ],
    photography: [
      {
        id: "p1",
        title: "Natural Light Photography",
        description: "Master the art of capturing interiors using natural light. Learn the best times of day and camera settings for stunning room photography.",
        category: "Photography",
        readTime: "4 min",
        authorTip: "Shoot during golden hour (1-2 hours before sunset) for warm, flattering light",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "p2",
        title: "Composition Techniques",
        description: "Learn essential composition techniques for interior photography, including the rule of thirds, leading lines, and framing through doorways.",
        category: "Photography",
        readTime: "5 min",
        authorTip: "Use doorways and windows as natural frames to add depth to your shots",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "p3",
        title: "Equipment Setup",
        description: "Essential equipment guide for interior photography, including tripod usage, lens selection, and proper camera settings for different scenarios.",
        category: "Photography",
        readTime: "4 min",
        authorTip: "Use a wide-angle lens (16-35mm) for small spaces, but avoid fisheye distortion",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "p4",
        title: "Advanced Camera Techniques",
        description: "Master advanced camera settings for interior photography. Learn about exposure, white balance, and HDR techniques.",
        category: "Photography",
        readTime: "5 min",
        authorTip: "Use bracketing for challenging lighting situations",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "p5",
        title: "Styling for Photography",
        description: "Prepare spaces for professional-looking photography. Learn styling techniques specific to interior photography.",
        category: "Photography",
        readTime: "4 min",
        authorTip: "Remove personal items and declutter surfaces before shooting",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "p6",
        title: "Post-Processing",
        description: "Edit interior photos to enhance their impact. Learn essential post-processing techniques for interior photography.",
        category: "Photography",
        readTime: "5 min",
        authorTip: "Use selective adjustments to balance mixed lighting sources",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "p7",
        title: "Mobile Photography",
        description: "Take professional-quality interior photos with your smartphone. Master mobile photography techniques and apps.",
        category: "Photography",
        readTime: "3 min",
        authorTip: "Use HDR mode for high-contrast scenes",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "p8",
        title: "Detail Photography",
        description: "Capture compelling detail shots of interior elements. Focus on textures, materials, and small vignettes.",
        category: "Photography",
        readTime: "4 min",
        authorTip: "Use macro mode for texture and material close-ups",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "p9",
        title: "Virtual Tour Photography",
        description: "Create comprehensive virtual tours of interior spaces. Learn 360-degree photography techniques.",
        category: "Photography",
        readTime: "6 min",
        authorTip: "Use a tripod with panoramic head for consistent rotation",
        difficulty: "Hard",
        impact: "High"
      }
    ],
    styling: [
      {
        id: "st1",
        title: "Vignette Creation",
        description: "Master the art of creating beautiful vignettes - small, curated displays that tell a story and add personality to your space.",
        category: "Styling",
        readTime: "3 min",
        authorTip: "Group objects in odd numbers and vary heights for visual interest",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "st2",
        title: "Bookshelf Styling",
        description: "Transform bookshelves into designer displays by mixing books, objects, and artwork. Learn proper spacing and arrangement techniques.",
        category: "Styling",
        readTime: "4 min",
        authorTip: "Alternate vertical and horizontal book stacking for visual rhythm",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "st3",
        title: "Coffee Table Arrangements",
        description: "Create eye-catching coffee table displays using books, trays, and decorative objects while maintaining functionality.",
        category: "Styling",
        readTime: "3 min",
        authorTip: "Start with a large tray to anchor your arrangement and create zones",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "st4",
        title: "Seasonal Styling",
        description: "Adapt your styling for different seasons. Create fresh looks throughout the year while maintaining core design elements.",
        category: "Styling",
        readTime: "4 min",
        authorTip: "Keep 70% of styling consistent and change 30% seasonally",
        difficulty: "Medium",
        impact: "Medium"
      },
      {
        id: "st5",
        title: "Table Setting Design",
        description: "Create stunning table settings for different occasions. Master the art of tablescaping and place settings.",
        category: "Styling",
        readTime: "4 min",
        authorTip: "Layer different textures and heights for visual interest",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "st6",
        title: "Window Treatment Styling",
        description: "Style windows to enhance natural light and views. Learn proper curtain hanging and layering techniques.",
        category: "Styling",
        readTime: "3 min",
        authorTip: "Hang curtains high and wide to make windows appear larger",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "st7",
        title: "Minimalist Styling",
        description: "Create impact with minimal elements. Master the art of purposeful styling with fewer items.",
        category: "Styling",
        readTime: "3 min",
        authorTip: "Choose items with strong silhouettes for maximum impact",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "st8",
        title: "Color Story Styling",
        description: "Develop cohesive color stories through styling. Create visual flow with coordinated accessories and decor.",
        category: "Styling",
        readTime: "4 min",
        authorTip: "Use the 60-30-10 rule for color distribution in styling",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "st9",
        title: "Styling for Photos",
        description: "Style spaces for maximum impact in photographs. Learn techniques for creating photo-ready vignettes.",
        category: "Styling",
        readTime: "4 min",
        authorTip: "Style in triangle formations for balanced compositions",
        difficulty: "Hard",
        impact: "High"
      }
    ],
    balance: [
      {
        id: "b1",
        title: "Symmetrical Balance",
        description: "Create formal, harmonious spaces using symmetrical balance. Learn when and how to use mirror arrangements effectively.",
        category: "Balance",
        readTime: "3 min",
        authorTip: "Use matching pairs of furniture or decor items on either side of a focal point",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "b2",
        title: "Asymmetrical Harmony",
        description: "Master the art of asymmetrical balance by understanding visual weight and creating interest without perfect symmetry.",
        category: "Balance",
        readTime: "4 min",
        authorTip: "Balance a large piece on one side with several smaller pieces on the other",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "b3",
        title: "Vertical Balance",
        description: "Learn to balance elements vertically in a room, from floor to ceiling, creating visual flow and preventing bottom-heavy spaces.",
        category: "Balance",
        readTime: "3 min",
        authorTip: "Draw the eye upward with tall plants, artwork, or pendant lights",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "b4",
        title: "Color Balance",
        description: "Create harmony through balanced color distribution. Learn to distribute colors effectively throughout a space.",
        category: "Balance",
        readTime: "4 min",
        authorTip: "Repeat accent colors at least three times in a room",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "b5",
        title: "Scale Balance",
        description: "Balance different scales of furniture and decor. Create harmonious relationships between large and small elements.",
        category: "Balance",
        readTime: "3 min",
        authorTip: "Mix large statement pieces with smaller supporting elements",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "b6",
        title: "Texture Balance",
        description: "Create interest through balanced texture combinations. Learn to mix different textures effectively.",
        category: "Balance",
        readTime: "3 min",
        authorTip: "Include at least three different textures in each room",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "b7",
        title: "Pattern Balance",
        description: "Mix patterns successfully while maintaining visual balance. Learn pattern scaling and distribution techniques.",
        category: "Balance",
        readTime: "4 min",
        authorTip: "Use patterns in descending size order: large, medium, small",
        difficulty: "Hard",
        impact: "High"
      },
      {
        id: "b8",
        title: "Functional Balance",
        description: "Balance aesthetic and functional elements in a space. Create rooms that are both beautiful and practical.",
        category: "Balance",
        readTime: "4 min",
        authorTip: "Ensure every decorative item serves a purpose",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "b9",
        title: "Light Balance",
        description: "Create balanced lighting schemes using natural and artificial light. Learn to distribute light sources effectively.",
        category: "Balance",
        readTime: "4 min",
        authorTip: "Position light sources at different heights for balanced illumination",
        difficulty: "Medium",
        impact: "High"
      }
    ],
    atmosphere: [
      {
        id: "at1",
        title: "Sensory Design",
        description: "Create multi-sensory experiences in your space using texture, scent, sound, and visual elements to enhance the overall atmosphere.",
        category: "Atmosphere",
        readTime: "4 min",
        authorTip: "Layer different textures in throws and pillows for tactile interest",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "at2",
        title: "Mood Enhancement",
        description: "Learn to create specific moods through the strategic use of color, lighting, and material choices.",
        category: "Atmosphere",
        readTime: "5 min",
        authorTip: "Use warm metals and soft textures for a cozy, inviting atmosphere",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "at3",
        title: "Natural Elements",
        description: "Incorporate natural elements like wood, stone, and plants to create a calming, grounded atmosphere in any space.",
        category: "Atmosphere",
        readTime: "3 min",
        authorTip: "Mix different wood tones to create a collected, organic feel",
        difficulty: "Easy",
        impact: "High"
      },
      {
        id: "at4",
        title: "Seasonal Atmosphere",
        description: "Adapt your space's atmosphere to different seasons using color, texture, and decorative elements while maintaining a cohesive style.",
        category: "Atmosphere",
        readTime: "4 min",
        authorTip: "Use removable elements like throws and pillows for seasonal changes",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "at5",
        title: "Sound Management",
        description: "Create appropriate acoustic environments. Learn to manage sound reflection and absorption.",
        category: "Atmosphere",
        readTime: "4 min",
        authorTip: "Use soft furnishings and textiles to reduce echo in large spaces",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "at6",
        title: "Aromatherapy Integration",
        description: "Incorporate appropriate scents into different spaces. Create signature home fragrances.",
        category: "Atmosphere",
        readTime: "3 min",
        authorTip: "Layer scents using different delivery methods like diffusers and candles",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        id: "at7",
        title: "Temperature Control",
        description: "Manage thermal comfort through design choices. Create comfortable spaces year-round.",
        category: "Atmosphere",
        readTime: "4 min",
        authorTip: "Use thermal curtains and rugs to regulate room temperature",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "at8",
        title: "Biophilic Design",
        description: "Connect interior spaces with nature. Incorporate natural elements and patterns.",
        category: "Atmosphere",
        readTime: "5 min",
        authorTip: "Use natural materials and organic shapes to create a connection with nature",
        difficulty: "Medium",
        impact: "High"
      },
      {
        id: "at9",
        title: "Energy Flow",
        description: "Create spaces with positive energy flow. Apply principles of feng shui and energy management.",
        category: "Atmosphere",
        readTime: "4 min",
        authorTip: "Keep pathways clear and arrange furniture to promote smooth movement",
        difficulty: "Medium",
        impact: "High"
      }
    ]
  };

  const categories: Category[] = [
    { id: CategoryId.Lighting, name: 'Lighting Design', icon: Sun },
    { id: CategoryId.Color, name: 'Color Theory', icon: Palette },
    { id: CategoryId.Space, name: 'Space Planning', icon: Maximize },
    { id: CategoryId.Furniture, name: 'Furniture Layout', icon: Sofa },
    { id: CategoryId.Styling, name: 'Styling Secrets', icon: Heart },
    { id: CategoryId.Balance, name: 'Visual Balance', icon: Compass },
    { id: CategoryId.Photography, name: 'Room Photography', icon: Camera },
    { id: CategoryId.Atmosphere, name: 'Atmosphere', icon: Feather },
  ];

const TipCard = memo(function TipCard({ tip, onSave, isSaved, onShare }: TipCardProps) {
  return (
    <div className="bg-[#FAF7F2] rounded-lg overflow-hidden
                 border border-[#B5A48B]/20
                 hover:shadow-lg transition-all duration-500
                 group"
    >
      <div className="p-6">
        {/* Header with actions */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-serif text-[#6B5E4C]">{tip.title}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onShare(tip)}
              className="p-2 rounded-full bg-white hover:bg-[#EBE7E0] transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#8C7E6A]" />
            </button>
            <button
              onClick={() => onSave(tip.id)}
              className="p-2 rounded-full bg-white hover:bg-[#EBE7E0] transition-colors"
            >
              {isSaved ? (
                <BookmarkPlus className="w-4 h-4 text-[#9C826B]" />
              ) : (
                <Bookmark className="w-4 h-4 text-[#8C7E6A]" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Tags with Icons */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                         bg-white text-sm text-[#8C7E6A]">
            <Clock className="w-3.5 h-3.5" />
            {tip.readTime}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                         bg-white text-sm text-[#8C7E6A]">
            <Target className="w-3.5 h-3.5" />
            {tip.difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#8C7E6A] mb-4">
          {tip.description}
        </p>

        {/* Pro Tip Box */}
        <div className="bg-white p-4 rounded-lg border border-[#B5A48B]/20">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-[#9C826B] mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#6B5E4C] mb-1">Pro Tip</p>
              <p className="text-sm text-[#8C7E6A]">
                {tip.authorTip}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {(tip.seasons || tip.roomTypes) && (
          <div className="mt-4 pt-4 border-t border-[#B5A48B]/20">
            <div className="flex flex-wrap gap-4">
              {tip.seasons && (
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#B5A48B]" />
                  <span className="text-sm text-[#8C7E6A]">
                    {tip.seasons.join(", ")}
                  </span>
                </div>
              )}
              {tip.roomTypes && (
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#B5A48B]" />
                  <span className="text-sm text-[#8C7E6A]">
                    {tip.roomTypes.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const InteriorTipsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(CategoryId.Lighting);
  const [savedTips, setSavedTips] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const TIPS_PER_PAGE = 3;
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const updateScrollButtons = useCallback(() => {
    const container = categoriesRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        Math.ceil(container.scrollLeft + container.clientWidth) < container.scrollWidth
      );
    }
  }, []);

  useEffect(() => {
    updateScrollButtons();
    
    const handleResize = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(updateScrollButtons, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [updateScrollButtons]);

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(updateScrollButtons, 100);
  }, [updateScrollButtons]);

  useEffect(() => {
    const container = categoriesRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = categoriesRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newPosition = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  }, []);

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

  const totalPages = Math.ceil(filteredTips.length / TIPS_PER_PAGE);

  const currentTips = useMemo(() => {
    const startIndex = (currentPage - 1) * TIPS_PER_PAGE;
    return filteredTips.slice(startIndex, startIndex + TIPS_PER_PAGE);
  }, [filteredTips, currentPage]);

  const handleCategoryChange = useCallback((categoryId: CategoryId): void => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when changing category
  }, []);

  // Add pagination controls component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${
            currentPage === 1
              ? 'text-[#B5A48B]/50 cursor-not-allowed'
              : 'text-[#8C7E6A] hover:bg-[#EBE7E0]'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-8 h-8 rounded-lg ${
              currentPage === pageNum
                ? 'bg-[#9C826B] text-white'
                : 'text-[#8C7E6A] hover:bg-[#EBE7E0]'
            }`}
          >
            {pageNum}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${
            currentPage === totalPages
              ? 'text-[#B5A48B]/50 cursor-not-allowed'
              : 'text-[#8C7E6A] hover:bg-[#EBE7E0]'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-serif text-[#6B5E4C] mb-4">
            Interior Design Inspiration
          </h2>
          <div className="h-0.5 w-24 mx-auto mb-6 bg-gradient-to-r from-[#B5A48B]/20 via-[#B5A48B]/40 to-[#B5A48B]/20" />
          <p className="text-[#8C7E6A]">
            Discover expert tips and creative ideas to transform your space
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg bg-white border border-[#B5A48B]/20 
                       focus:outline-none focus:border-[#9C826B] transition-colors"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#B5A48B]" />
          </div>
        </div>

        {/* Categories - Desktop */}
        <div className="hidden md:block relative max-w-4xl mx-auto mb-12">
          <div className="relative">
            <div 
              ref={categoriesRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            >
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-[#9C826B] text-white'
                        : 'bg-white text-[#8C7E6A] hover:bg-[#EBE7E0]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="group absolute left-0 top-1/2 z-20 hidden [@media(min-width:700px)]:flex h-10 w-10 -translate-x-full -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF7F2] shadow-md transition-all duration-300 hover:bg-white"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="h-5 w-5 text-[#8C7E6A] transition-transform group-hover:-translate-x-0.5" />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="group absolute right-0 top-1/2 z-20 hidden [@media(min-width:700px)]:flex h-10 w-10 translate-x-full -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF7F2] shadow-md transition-all duration-300 hover:bg-white"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="h-5 w-5 text-[#8C7E6A] transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

            {/* Gradient Fades */}
            {canScrollLeft && (
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#FAF7F2] to-transparent" />
            )}
            {canScrollRight && (
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#FAF7F2] to-transparent" />
            )}
          </div>
        </div>

        {/* Categories - Mobile */}
        <div className="md:hidden mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value as CategoryId)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-[#B5A48B]/20 
                     focus:outline-none focus:border-[#9C826B] transition-colors
                     text-[#8C7E6A] appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238C7E6A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tips Grid - Updated to use currentTips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {currentTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onSave={toggleSave}
              isSaved={savedTips.has(tip.id)}
              onShare={handleShare}
            />
          ))}
        </div>

        {/* Add Pagination Controls */}
        <PaginationControls />
      </div>
    </section>
  );
};

export default InteriorTipsSection;