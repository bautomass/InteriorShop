// components/invoice/InvoiceModal.tsx
'use client';

import { Cart } from '@/lib/shopify/types';
import { InvoiceFormData, calculateTotals, formatDate, generateInvoiceNumber } from '@/types/invoice';
import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FileDown, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import InvoiceTemplate from './InvoiceTemplate';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  onSubmit: (formData: any) => void;
}

const CustomInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  className = ''
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}) => (
  <div className={`grid gap-2 ${className}`}>
    <label 
      htmlFor={name}
      className="text-sm font-medium text-[#6B5E4C]"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="px-3 py-2 rounded-lg border border-[#6B5E4C]/20 focus:outline-none focus:ring-2 focus:ring-[#6B5E4C]/20 focus:border-[#6B5E4C]/40 bg-white text-[#6B5E4C] placeholder-[#6B5E4C]/40 transition-all duration-200"
    />
  </div>
);

const CustomButton = ({ 
  onClick, 
  disabled, 
  variant = 'primary',
  children,
  className = '',
  type = 'button'
}: {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
      ${variant === 'primary' 
        ? 'bg-[#6B5E4C] text-white hover:bg-[#8C7E6A] active:bg-[#5A4E3C]' 
        : 'bg-white text-[#6B5E4C] border border-[#6B5E4C]/20 hover:bg-[#F8F6F3] active:bg-[#F0EDE8]'}
      ${className}
    `}
  >
    {children}
  </button>
);

export default function InvoiceModal({ isOpen, onClose, cart, onSubmit }: InvoiceModalProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    companyName: '',
    phone: '',
    vatNumber: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      width: 800px;
      height: 0;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      background-color: white;
      padding: 20px;
      z-index: -1;
    `;
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const generateInvoice = useCallback(() => {
    return {
      ...formData,
      invoiceNumber: generateInvoiceNumber(),
      date: formatDate(new Date()),
      cart,
      ...calculateTotals(cart)
    };
  }, [formData, cart]);

  const validateForm = useCallback(() => {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'country', 'postalCode', 'phone'] as const;
    const emptyField = requiredFields.find(field => !formData[field]);
    
    if (emptyField) {
      alert(`Please fill in the ${emptyField.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return false;
    }
    return true;
  }, [formData]);

  const captureElement = useCallback(async () => {
    const element = document.getElementById('invoice-template');
    if (!element) throw new Error('Invoice template element not found');

    await new Promise(resolve => setTimeout(resolve, 100));

    return html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: element.offsetHeight,
      logging: false
    });
  }, []);

  const handleDownload = useCallback(async (format: 'pdf' | 'image') => {
    if (!validateForm() || !portalContainer) return;

    setIsLoading(true);
    setShowTemplate(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const invoiceData = generateInvoice();
      onSubmit(invoiceData);
      
      const canvas = await captureElement();
      
      if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
      } else {
        const link = document.createElement('a');
        link.download = `invoice-${invoiceData.invoiceNumber}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    } catch (error) {
      console.error(`Error generating ${format}:`, error);
      alert(`Failed to generate ${format}. Please try again.`);
    } finally {
      setShowTemplate(false);
      setIsLoading(false);
    }
  }, [validateForm, portalContainer, generateInvoice, onSubmit, captureElement]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isLoading && onClose()}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-[500px] max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-xl"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-[#6B5E4C]/10 bg-white">
                  <h2 className="text-lg font-semibold text-[#6B5E4C]">Generate Invoice</h2>
                  <button
                    onClick={() => !isLoading && onClose()}
                    className="p-1.5 text-[#6B5E4C] hover:bg-[#F8F6F3] rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[#8C7E6A] mb-4">
                    Note: These details are used only for invoice generation and are not stored.
                  </p>

                  <div className="space-y-4">
                    {/* Personal Info */}
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

                  {/* Actions */}
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
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {showTemplate && portalContainer && createPortal(
        <InvoiceTemplate data={generateInvoice()} />,
        portalContainer
      )}
    </>
  );
}