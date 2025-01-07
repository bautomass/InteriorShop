import { Cart } from "../shopify/types";

// utils/invoice.ts
export const generateInvoiceNumber = (): string => {
    const randomNumbers = Array.from({ length: 9 }, () => 
      Math.floor(Math.random() * 10)
    ).join('');
    return `AT${randomNumbers}`;
  };
  
  export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  export const calculateTotals = (cart: Cart) => {
    const subtotal = cart.lines.reduce((acc, line) => {
      return acc + (parseFloat(line.cost.totalAmount.amount) * line.quantity);
    }, 0);
    
    const tax = subtotal * 0.20; // Assuming 20% tax rate
    const total = subtotal + tax;
    
    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  };