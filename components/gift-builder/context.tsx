// components/gift-builder/context.tsx
'use client';

import { BoxSelectionPayload, GiftBuilderState, GiftProduct } from '@/types/gift-builder';
import { createContext, ReactNode, useContext, useReducer } from 'react';

type Action =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SELECT_BOX'; payload: BoxSelectionPayload }
  | { type: 'ADD_PRODUCT'; payload: GiftProduct }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'EDIT_PRODUCT'; payload: string }
  | { type: 'RESET' };

const initialState: GiftBuilderState = {
  step: 1,
  selectedBox: null,
  selectedProducts: [],
  editingProductId: null,
  totalPrice: 0,
  discount: 0
};

// Progressive discount calculation
const calculateDiscount = (totalPrice: number, productCount: number): number => {
  if (productCount >= 10) return totalPrice * 0.2;
  if (productCount >= 7) return totalPrice * 0.15;
  if (productCount >= 5) return totalPrice * 0.1;
  if (productCount >= 3) return totalPrice * 0.05;
  return 0;
};

function giftBuilderReducer(state: GiftBuilderState, action: Action): GiftBuilderState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };

    case 'SELECT_BOX':
      return {
        ...state,
        selectedBox: action.payload,
        totalPrice:
          action.payload.price +
          state.selectedProducts.reduce((sum, product) => sum + product.price, 0)
      };

    case 'ADD_PRODUCT': {
      if (!state.selectedBox || state.selectedProducts.length >= state.selectedBox.maxProducts) {
        return state;
      }

      const newProducts = [...state.selectedProducts, action.payload];
      const newTotalPrice =
        (state.selectedBox?.price || 0) +
        newProducts.reduce((sum, product) => sum + (product.price || 0), 0);
      const newDiscount = calculateDiscount(newTotalPrice, newProducts.length);

      return {
        ...state,
        selectedProducts: newProducts,
        totalPrice: newTotalPrice,
        discount: newDiscount
      };
    }

    case 'REMOVE_PRODUCT': {
      const newProducts = state.selectedProducts.filter((p) => p.id !== action.payload);
      const newTotalPrice =
        (state.selectedBox?.price || 0) +
        newProducts.reduce((sum, product) => sum + product.price, 0);
      const newDiscount = calculateDiscount(newTotalPrice, newProducts.length);

      return {
        ...state,
        selectedProducts: newProducts,
        totalPrice: newTotalPrice,
        discount: newDiscount
      };
    }

    case 'EDIT_PRODUCT':
      return {
        ...state,
        editingProductId: action.payload,
        step: 2
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

const GiftBuilderContext = createContext<
  | {
      state: GiftBuilderState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export function GiftBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(giftBuilderReducer, initialState);

  return (
    <GiftBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </GiftBuilderContext.Provider>
  );
}

export function useGiftBuilder() {
  const context = useContext(GiftBuilderContext);
  if (context === undefined) {
    throw new Error('useGiftBuilder must be used within a GiftBuilderProvider');
  }
  return context;
}
