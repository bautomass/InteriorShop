export type InvoiceData = {
  invoiceNumber: string;
  date: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    company?: string;
    vatNumber?: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    email: string;
    phone?: string;
  };
}; 