//components/cart/open-cart.tsx
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function OpenCart({
  className,
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="border-primary-200 text-primary-900 dark:border-primary-700 dark:text-primary-50 relative flex h-11 w-11 items-center justify-center rounded-md border transition-colors">
      <ShoppingCartIcon
        className={clsx('h-4 transition-all ease-in-out hover:scale-110', className)}
      />
      {quantity ? (
        <div className="bg-accent-600 text-primary-50 absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded text-[11px] font-medium">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
