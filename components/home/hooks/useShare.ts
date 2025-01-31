// /components/home/hooks/useShare.ts
import { useEffect, useState } from 'react';
import { PRODUCT_CONSTANTS } from '../constants';
import type { ShareState } from '../types';

export const useShare = () => {
  const [shareCount, setShareCount] = useState<number>(PRODUCT_CONSTANTS.INITIAL_SHARE_COUNT);

  useEffect(() => {
    const stored = localStorage.getItem('pendantShareCount');
    if (!stored) {
      const initialState: ShareState = {
        count: PRODUCT_CONSTANTS.INITIAL_SHARE_COUNT,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('pendantShareCount', JSON.stringify(initialState));
      setShareCount(PRODUCT_CONSTANTS.INITIAL_SHARE_COUNT);
      return;
    }

    const { count, lastUpdated }: ShareState = JSON.parse(stored);
    const lastUpdate = new Date(lastUpdated);
    const today = new Date();
    
    if (lastUpdate.toDateString() !== today.toDateString()) {
      const increment = Math.floor(Math.random() * 3) + 1;
      const newCount = count + increment;
      const newState: ShareState = {
        count: newCount,
        lastUpdated: today.toISOString()
      };
      localStorage.setItem('pendantShareCount', JSON.stringify(newState));
      setShareCount(newCount);
    } else {
      setShareCount(count);
    }
  }, []);

  const handleShare = async (platform: string, productHandle: string) => {
    const shareUrl = `${window.location.origin}/products/${productHandle}#featured-pendant`;
    const shareTitle = `Check out this amazing product`;
    const shareText = "Beautiful Japanese-inspired pendant light, handcrafted by skilled artisans.";

    const newCount = shareCount + 1;
    setShareCount(newCount);
    
    localStorage.setItem('pendantShareCount', JSON.stringify({
      count: newCount,
      lastUpdated: new Date().toISOString()
    }));

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        break;
    }
  };

  return { shareCount, handleShare };
};