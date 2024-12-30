'use client';

import { useState } from 'react';

export function useActionState<T>(
  action: (...args: any[]) => Promise<T>,
  initialState: T | null = null
) {
  const [state, setState] = useState<T | null>(initialState);

  const formAction = async (...args: any[]) => {
    try {
      const result = await action(...args);
      setState(result);
      return result;
    } catch (error) {
      console.error('Action error:', error);
      throw error;
    }
  };

  return [state, formAction] as const;
}
