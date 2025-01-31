// /components/home/components/ShareButtons.tsx
import { Pinterest } from '@/components/icons/Pinterest';
import { Facebook, LinkIcon, Mail, X as Twitter } from 'lucide-react';
import { memo } from 'react';
import type { ShareButtonsProps } from './types';

export const ShareButtons = memo(function ShareButtons({
  product,
  shareCount,
  onShare
}: ShareButtonsProps) {
  return (
    <div className="mt-6 pt-6 border-t border-[#6B5E4C]/10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6B5E4C]">Share this product:</span>
          <span className="text-xs text-[#8C7E6A] bg-[#6B5E4C]/5 px-2 py-0.5 rounded-full">
            {shareCount} shares
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {[
            { platform: 'facebook', Icon: Facebook },
            { platform: 'twitter', Icon: Twitter },
            { platform: 'pinterest', Icon: Pinterest },
            { platform: 'email', Icon: Mail }
          ].map(({ platform, Icon }) => (
            <button
              key={platform}
              onClick={() => onShare(platform)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
              aria-label={`Share on ${platform}`}
            >
              <Icon className="w-5 h-5 text-[#6B5E4C]" />
            </button>
          ))}
          <div className="w-px h-5 bg-[#6B5E4C]/10" />
          <button
            onClick={() => onShare('copy')}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[#6B5E4C]/5 transition-colors duration-200"
            aria-label="Copy link to clipboard"
          >
            <LinkIcon className="w-5 h-5 text-[#6B5E4C]" />
          </button>
        </div>
      </div>
    </div>
  );
});

ShareButtons.displayName = 'ShareButtons';