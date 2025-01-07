//components/cart/edit-item-quantity-button.tsx

'use client';

import { useActionState } from '@/hooks/useActionState';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateItemQuantity } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useState } from 'react';

interface SubmitButtonProps {
  type: 'plus' | 'minus';
  isPending: boolean;
}

interface EditItemQuantityButtonProps {
  item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate: (merchandiseId: string, type: 'plus' | 'minus') => void;
}

function SubmitButton({ type, isPending }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-primary-800 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50',
        {
          'ml-auto': type === 'minus'
        }
      )}
    >
      {type === 'plus' ? (
        <PlusIcon
          className={clsx('h-4 w-4 text-primary-600 dark:text-primary-400', {
            'opacity-50': isPending
          })}
        />
      ) : (
        <MinusIcon
          className={clsx('h-4 w-4 text-primary-600 dark:text-primary-400', {
            'opacity-50': isPending
          })}
        />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate
}: EditItemQuantityButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, formAction] = useActionState(updateItemQuantity, null);

  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
  };

  const actionWithVariant = formAction.bind(null, payload);

  const clientAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    try {
      setIsPending(true);
      optimisticUpdate(payload.merchandiseId, type);
      await actionWithVariant();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={clientAction}>
      <SubmitButton type={type} isPending={isPending} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
