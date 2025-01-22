// components/filter/PriceRangeFilter.tsx
type PriceRange = {
  min: number;
  max: number | null;
  label: string;
};

const priceRanges: PriceRange[] = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: null, label: '$200+' },
];

export function PriceRangeFilter({ 
  selectedRange, 
  onChange 
}: {
  selectedRange: string | null;
  onChange: (range: string | null) => void;
}) {
  return (
    <div className="space-y-2">
      {priceRanges.map((range) => (
        <label key={range.label} className="flex items-center space-x-2">
          <input
            type="radio"
            name="price-range"
            checked={selectedRange === range.label}
            onChange={() => onChange(range.label)}
            className="text-[#9e896c] focus:ring-[#9e896c]"
          />
          <span className="text-sm text-neutral-700">{range.label}</span>
        </label>
      ))}
      {selectedRange && (
        <button
          onClick={() => onChange(null)}
          className="text-sm text-[#9e896c] hover:underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}