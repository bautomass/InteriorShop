import { InvoiceFormData } from '@/types/invoice';
import { FileDown, X } from 'lucide-react';
import { CustomButton, CustomInput } from './CustomComponents';

interface InvoiceModalContentProps {
  formData: InvoiceFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: (format: 'pdf' | 'image') => void;
  isLoading: boolean;
  onClose: () => void;
}

export default function InvoiceModalContent({
  formData,
  handleInputChange,
  handleDownload,
  isLoading,
  onClose
}: InvoiceModalContentProps) {
  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-[#6B5E4C]/10 bg-white">
        <h2 className="text-lg font-semibold text-[#6B5E4C]">Generate Invoice</h2>
        <button
          onClick={() => !isLoading && onClose()}
          className="p-1.5 text-[#6B5E4C] hover:bg-[#F8F6F3] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-[#8C7E6A] mb-4">
          Note: These details are used only for invoice generation and are not stored.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <CustomInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <CustomInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <CustomInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <CustomInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <CustomInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <CustomInput
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <CustomInput
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />

          <CustomInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          <div className="pt-2 border-t border-[#6B5E4C]/10">
            <CustomInput
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
            />

            <CustomInput
              label="VAT Number"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleInputChange}
              className="mt-3"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <CustomButton
            onClick={() => handleDownload('image')}
            disabled={isLoading}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4" />
            Download as Image
          </CustomButton>
          <CustomButton
            onClick={() => handleDownload('pdf')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4" />
            Download as PDF
          </CustomButton>
        </div>
      </div>
    </>
  );
}