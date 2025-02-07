'use client';
import { Pinterest } from '@/components/icons/Pinterest';
import { X } from '@/components/icons/X';
import { Facebook, Link as LinkIcon, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ShareManagerProps {
  product: {
    id: string;
    title?: string;
    description?: string;
  };
  images?: { url: string }[];
}

export const ShareManager: React.FC<ShareManagerProps> = ({ product, images }) => {
  const [shareCount, setShareCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const generatePseudoRandomNumber = (seed: string): number => {
    let hash = Array.from(seed).reduce(
      (hash, char) => ((hash << 5) - hash) + char.charCodeAt(0),
      0
    );
    
    const normalizedHash = Math.abs(hash) % 44 + 3;
    return normalizedHash;
  };

  const getStoredShareCount = async (productId: string): Promise<number> => {
    // Artificial small delay to prevent flash of loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (typeof window === 'undefined') return 3;
    
    const storageKey = `product_shares_${productId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      const baseCount = generatePseudoRandomNumber(productId);
      
      localStorage.setItem(storageKey, JSON.stringify({
        count: baseCount,
        lastUpdated: new Date().toISOString()
      }));
      
      return baseCount;
    }

    return JSON.parse(stored).count;
  };

  const handleShare = async (platform: string) => {
    if (!product.id || shareCount === null) return;
    
    const shareUrl = window.location.href;
    const shareTitle = `Check out this ${product.title || 'product'}`;
    const shareText = product.description || "Check out this amazing product!";

    const storageKey = `product_shares_${product.id}`;
    const newCount = shareCount + 1;
    
    setShareCount(newCount);
    localStorage.setItem(storageKey, JSON.stringify({
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
        if (firstImageUrl) {
          window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(firstImageUrl)}&description=${encodeURIComponent(shareText)}`, '_blank');
        }
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
    if (product.id) {
      setIsLoading(true);
      getStoredShareCount(product.id)
        .then(count => {
          setShareCount(count);
          setIsLoading(false);
        });
    }
  }, [product.id]);

  return (
    <div className="mt-6 pt-6 border-t border-[#6B5E4C]/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm text-[#6B5E4C]">Share this product:</span>
          <span className="text-xs text-[#8C7E6A] bg-[#6B5E4C]/5 px-2 py-0.5 rounded-full min-w-[60px] text-center">
            {isLoading ? (
              <span className="inline-block w-4 h-2 bg-[#6B5E4C]/20 animate-pulse rounded" />
            ) : (
              `${shareCount} shares`
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share on Facebook"
            disabled={isLoading}
          >
            <Facebook className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share on X (formerly Twitter)"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <button
            onClick={() => handleShare('pinterest')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share on Pinterest"
            disabled={isLoading}
          >
            <Pinterest className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <button
            onClick={() => handleShare('email')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Share via Email"
            disabled={isLoading}
          >
            <Mail className="w-5 h-5 text-[#6B5E4C]" />
          </button>
          <div className="w-px h-5 bg-[#6B5E4C]/10" />
          <button
            onClick={() => handleShare('copy')}
            className="p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Copy link"
            disabled={isLoading}
          >
            <LinkIcon className="w-5 h-5 text-[#6B5E4C]" />
          </button>
        </div>
      </div>
    </div>
  );
};