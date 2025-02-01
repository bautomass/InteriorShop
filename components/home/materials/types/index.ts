import { LucideIcon } from 'lucide-react';

export interface Material {
  name: string;
  description: string;
  color: string;
  specs: {
    origin: string;
    sustainability: string;
    properties: string[];
  };
}

export interface WellnessFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  expandedContent: {
    title: string;
    highlights: string[];
    keyBenefit: string;
    citation: string;
  };
}

export interface FeatureCardProps {
  feature: WellnessFeature;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

export interface MaterialIndicatorProps {
  material: Material;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  position: string;
}

export interface MaterialSelectionPillsProps {
  materials: Material[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}