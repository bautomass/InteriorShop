import { CircleOff, Leaf, ShieldCheck, Sprout } from 'lucide-react';
import type { Material, WellnessFeature } from '../types';

export const MATERIALS: Material[] = [
    {
        name: 'Wild Sage',
        description: 'Hand-harvested Mediterranean herbs, naturally dried and preserved',
        color: '#E5E0DB',
        specs: {
            origin: 'Mediterranean hillsides',
            sustainability: 'Seasonal harvesting cycles',
            properties: ['Aromatherapeutic', 'Long-lasting', 'Natural fragrance']
        }
    },
  {
    name: 'Organic Clay',
    description: 'Pure earthen clay, shaped and finished by artisan hands',
    color: '#BEB5A7',
    specs: {
      origin: 'Local quarries',
      sustainability: 'Natural material, zero waste processing',
      properties: ['Temperature regulating', 'Moisture balancing', 'Non-toxic']
    }
  },
    {
      name: 'Natural Wood',
      description: 'Sustainably sourced raw timber, celebrating natural grain patterns',
      color: '#D4C4B5',
      specs: {
        origin: 'FSC-certified forests',
        sustainability: 'Renewable resource with minimal processing',
        properties: ['Durable', 'Breathable', 'Natural grain variety']
      }
    },
];

export const WELLNESS_FEATURES: WellnessFeature[] = [
    {
        icon: Leaf,
        title: 'Natural Harmony',
        description: 'Materials that bring nature\'s calming presence into your space',
        expandedContent: {
          title: 'The Science of Biophilic Design',
          highlights: [
            'Research shows exposure to natural materials reduces cortisol levels by up to 60%',
            'Increases cognitive function and creativity by 15% through improved air quality',
            'Natural textures trigger parasympathetic nervous system response'
          ],
          keyBenefit: 'Proven to reduce stress and anxiety while improving sleep quality by up to 40%',
          citation: 'Based on Environmental Health Perspectives studies'
        }
      },
      {
        icon: ShieldCheck,
        title: 'Health Conscious',
        description: 'Non-toxic materials promoting better indoor air quality',
        expandedContent: {
          title: 'Advanced Air Purification',
          highlights: [
            'Natural materials actively filter up to 85% of indoor air pollutants',
            'Reduces respiratory irritants by naturally regulating humidity levels',
            'Eliminates off-gassing common in synthetic materials'
          ],
          keyBenefit: 'Creates medical-grade air quality, reducing respiratory issues by up to 30%',
          citation: 'Validated by Indoor Air Quality studies'
        }
      },
      {
        icon: Sprout,
        title: 'Sustainable Living',
        description: 'Eco-friendly choices for a better tomorrow',
        expandedContent: {
          title: 'Environmental Impact',
          highlights: [
            'Carbon negative manufacturing process absorbs more CO2 than produced',
            'Zero waste production cycle with 100% biodegradable materials',
            'Supports regenerative farming practices'
          ],
          keyBenefit: 'Each piece removes 50kg of CO2 from the atmosphere over its lifetime',
          citation: 'Certified by Environmental Product Declaration'
        }
      },
      {
        icon: CircleOff,
        title: 'Zero Toxins',
        description: 'Free from harmful chemicals and synthetic treatments',
        expandedContent: {
          title: 'Clinical Purity Standards',
          highlights: [
            'Exceeds medical-grade material purity requirements',
            'Zero VOCs, formaldehyde, or synthetic binding agents',
            'Antimicrobial properties through natural compounds'
          ],
          keyBenefit: 'Creates a clinical-grade hypoallergenic environment, safe for sensitive individuals',
          citation: 'Verified by Independent Laboratory Testing'
        }
      }
];

export const MATERIAL_POSITIONS = [
  'left-[30%] top-[32.5%]',
  'right-[45%] top-[45%] lg:right-[30%] lg:top-[45%]',
  'left-[30%] bottom-[35%]'
];