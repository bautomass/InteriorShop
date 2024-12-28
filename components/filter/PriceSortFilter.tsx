// components/filter/PriceSortFilter.tsx
type PriceSortFilterProps = {
  onSort: (direction: 'asc' | 'desc') => void;
};

export function PriceSortFilter({ onSort }: PriceSortFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onSort('asc')}
        className="px-3 py-1.5 text-sm font-medium rounded-md
                 border border-primary-900/20 dark:border-primary-100/20
                 bg-primary-100/50 dark:bg-primary-800/50
                 text-primary-900 dark:text-primary-100
                 hover:bg-primary-800/10 dark:hover:bg-primary-100/10
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Price: Low to High
      </button>
      <button
        onClick={() => onSort('desc')}
        className="px-3 py-1.5 text-sm font-medium rounded-md
                 border border-primary-900/20 dark:border-primary-100/20
                 bg-primary-100/50 dark:bg-primary-800/50
                 text-primary-900 dark:text-primary-100
                 hover:bg-primary-800/10 dark:hover:bg-primary-100/10
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Price: High to Low
      </button>
    </div>
  );
}
