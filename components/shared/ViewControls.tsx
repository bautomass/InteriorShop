// ViewControls.tsx
'use client';

import { LayoutGrid, LayoutList } from 'lucide-react';

interface ViewControlsProps {
  current: number;
  min: number;
  max: number;
  onChange: (count: number) => void;
  isGridView: boolean;
  onViewChange: (isGrid: boolean) => void;
  showCardCount: boolean;
}

export function ViewControls({
  current,
  min,
  max,
  onChange,
  isGridView,
  onViewChange
}: ViewControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 border rounded-md p-1 bg-white">
        <button
          onClick={() => onChange(Math.max(min, current - 1))}
          disabled={current <= min}
          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Show fewer items"
        >
          -
        </button>
        <span className="min-w-[2rem] text-center font-medium text-gray-900">
          {current}
        </span>
        <button
          onClick={() => onChange(Math.min(max, current + 1))}
          disabled={current >= max}
          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Show more items"
        >
          +
        </button>
      </div>

      <div className="flex gap-2 border rounded-md p-1 bg-white">
        <button
          onClick={() => onViewChange(true)}
          className={`p-2 rounded-md transition-colors ${
            isGridView 
              ? 'text-gray-900 bg-gray-100' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
        <button
          onClick={() => onViewChange(false)}
          className={`p-2 rounded-md transition-colors ${
            !isGridView 
              ? 'text-gray-900 bg-gray-100' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          aria-label="List view"
        >
          <LayoutList className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
