//components/cart/close-cart.tsx

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function CloseCart({ className }: { className?: string }) {
  return (
    <div className="border-primary-200 text-primary-900 dark:border-primary-700 dark:text-primary-50 relative flex h-11 w-11 items-center justify-center rounded-md border transition-colors">
      <XMarkIcon className={clsx('h-6 transition-all ease-in-out hover:scale-110', className)} />
    </div>
  );
}
