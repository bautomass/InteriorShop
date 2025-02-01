import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const useMaterialState = () => {
  const [selectedMaterial, setSelectedMaterial] = useState(2);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const handleMaterialSelect = (index: number) => {
    setSelectedMaterial(index);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleCardExpand = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return {
    selectedMaterial,
    isImageLoaded,
    expandedCard,
    inView,
    ref,
    handleMaterialSelect,
    handleImageLoad,
    handleCardExpand
  };
};