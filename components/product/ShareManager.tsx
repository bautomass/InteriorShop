// ShareManager.tsx
'use client';
import { Pinterest } from '@/components/icons/Pinterest';
import { X } from '@/components/icons/X';
import { Facebook, Link as LinkIcon, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ShareManagerProps {
  product: any;
  images: any[];
}

export const ShareManager: React.FC<ShareManagerProps> = ({ product, images }) => {
  const [shareCount, setShareCount] = useState(67);

  const getStoredShareCount = () => {
    if (typeof window === 'undefined') return 67;
    
    const stored = localStorage.getItem('pendantShareCount');
    if (!stored) {
      const initialCount = 67;
      localStorage.setItem('pendantShareCount', JSON.stringify({
        count: initialCount,
        lastUpdated: new Date().toISOString()
      }));
      return initialCount;
    }

    const { count, lastUpdated } = JSON.parse(stored);
    const lastUpdate = new Date(lastUpdated);
    const today = new Date();
    
    if (lastUpdate.toDateString() !== today.toDateString()) {
      const increment = Math.floor(Math.random() * 3) + 1;
      const newCount = count + increment;
      localStorage.setItem('pendantShareCount', JSON.stringify({
        count: newCount,
        lastUpdated: today.toISOString()
      }));
      return newCount;
    }

    return count;
  };

  const handleShare = async (platform: string, images?: any[]) => {
    const shareUrl = window.location.href;
    const shareTitle = `Check out this ${product?.title || 'product'}`;
    const shareText = product?.description || "Check out this amazing product!";

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
        const firstImageUrl = images?.[0]?.url;
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(firstImageUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
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

  useEffect(() => {
    setShareCount(getStoredShareCount());
  }, []);

  return (
  <div className="mt-6 pt-6 border-t border-[#6B5E4C]/10">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-[#6B5E4C]">Share this product:</span>
        <span className="text-xs text-[#8C7E6A] bg-[#6B5E4C]/5 px-2 py-0.5 rounded-full">
          {shareCount} shares
        </span>
      </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share on X (formerly Twitter)"
          >
            <X className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <button
            onClick={() => handleShare('pinterest')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share on Pinterest"
          >
            <Pinterest className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <button
            onClick={() => handleShare('email')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share via Email"
          >
            <Mail className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <div className="w-px h-5 bg-[#6B5E4C]/10" />
          <button
            onClick={() => handleShare('copy')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Copy link"
          >
            <LinkIcon className="w-5 h-5 text-[#6B5E4C]" />
          </button>
        </div>
      </div>
    </div>
  );
};