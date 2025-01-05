import { Cart } from '@/lib/shopify/types';
import { useState } from 'react';
import { z } from 'zod';

const invoiceSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  vatNumber: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  phone: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function InvoiceForm({ cart, onSubmit }: { cart: Cart; onSubmit: (data: InvoiceFormData) => void }) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    vatNumber: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = invoiceSchema.parse(formData);
      onSubmit(validated);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#6B5E4C]">Invoice Details</h2>
        <p className="text-sm text-[#8C7E6A]">Please fill in your billing information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          className="form-input rounded-lg"
          required
        />
        {/* Add similar inputs for all other fields */}
      </div>

      <div className="text-sm text-[#8C7E6A] mt-4">
        <p>* Required fields</p>
        <p>Note: This information is used only for invoice generation and is not stored.</p>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#6B5E4C] text-white rounded-lg hover:bg-[#8C7E6A] transition-colors"
      >
        Generate Invoice
      </button>
    </form>
  );
} 