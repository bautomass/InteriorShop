// types/invoice.ts
import { Cart } from '@/lib/shopify/types';

export interface InvoiceFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  companyName: string;
  phone: string;
  vatNumber: string;
}

export interface InvoiceData extends InvoiceFormData {
  invoiceNumber: string;
  date: string;
  cart: Cart;
  total: number;
  subtotal: number;
  tax: number;
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp}-${random}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function calculateTotals(cart: Cart) {
  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  const tax = parseFloat(cart.cost.totalTaxAmount?.amount || '0');
  const total = parseFloat(cart.cost.totalAmount.amount);

  return {
    subtotal,
    tax,
    total
  };
}