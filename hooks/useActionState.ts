//hooks/useActionState.ts
'use client';

import { useCallback, useState, useTransition } from 'react';

export function useActionState<TInput, TOutput>(
  action: (prevState: TOutput | null, data: TInput) => Promise<TOutput>,
  initialState: TOutput | null = null
) {
  const [state, setState] = useState<TOutput | null>(initialState);
  const [isPending, startTransition] = useTransition();

  const dispatch = useCallback(
    async (data: TInput) => {
      return new Promise((resolve) => {
        startTransition(() => {
          action(state, data)
            .then((result) => {
              setState(result);
              resolve(result);
            })
            .catch((error) => {
              console.error('Action Error:', error);
              throw error;
            });
        });
      });
    },
    [action, state]
  );

  return [state, dispatch] as const;
}
