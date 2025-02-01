import { useCallback, useState } from 'react';
import type { ViewSettings } from '../types/lamp-types';

export const useLampCardsView = (settings: ViewSettings) => {
  const [cardsToShow, setCardsToShow] = useState(settings.defaultCards);

  const handleViewChange = useCallback((value: number) => {
    setCardsToShow(value);
  }, []);

  return { cardsToShow, handleViewChange };
};