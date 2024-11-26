'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useActionState } from 'react';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const actionWithVariant = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, 'delete');
        await actionWithVariant();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="bg-primary-400 hover:bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500 flex h-[24px] w-[24px] items-center justify-center rounded-full"
      >
        <XMarkIcon className="text-primary-50 mx-[1px] h-4 w-4" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
