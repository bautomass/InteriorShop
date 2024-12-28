import { ChevronDown } from 'lucide-react';

type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { label: 'Newest', value: 'created_desc' },
  { label: 'Oldest', value: 'created_asc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export function SortSelect({ value, onChange }: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full px-4 py-2 pr-8 bg-neutral-100 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9e896c] cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
    </div>
  );
}
