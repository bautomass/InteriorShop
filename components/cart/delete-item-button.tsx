//components/cart/delete-item-button.tsx

'use client';

import { useActionState } from '@/hooks/useActionState';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { removeItem } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
// Remove useFormStatus for now as it's causing build issues
// We'll handle loading state through our custom hook

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

  const clientAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      optimisticUpdate(merchandiseId, 'delete');
      await actionWithVariant();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <form>
      <button
        onClick={clientAction}
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-primary-400 hover:bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-primary-50" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}