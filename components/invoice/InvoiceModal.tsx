'use client';

import { Cart } from '@/lib/shopify/types';
import { InvoiceFormData, calculateTotals, formatDate, generateInvoiceNumber } from '@/types/invoice';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDocumentGenerator } from './DocumentGenerator';

const InvoiceTemplate = dynamic(() => import('./InvoiceTemplate'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-100 w-full h-[800px]" />
});

const InvoiceModalContent = dynamic(() => import('./InvoiceModalContent'), { 
  ssr: false,
  loading: () => <div className="animate-pulse space-y-4 p-6">
    <div className="h-8 bg-gray-100 rounded w-3/4" />
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded" />
      ))}
    </div>
  </div>
});

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  onSubmit: (formData: InvoiceFormData) => void;
}

export interface InvoiceModalContentProps {
  formData: InvoiceFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: (format: 'pdf' | 'image') => void;
  isLoading: boolean;
  onClose: () => void;
  error: string | null;
}

const DEFAULT_FORM_DATA: InvoiceFormData = {
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
};

export default function InvoiceModal({ isOpen, onClose, cart, onSubmit }: InvoiceModalProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const { generateDocument } = useDocumentGenerator();

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
    portalRef.current = container;
    
    return () => {
      document.body.contains(container) && document.body.removeChild(container);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isLoading, onClose]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
    setError(null);
  }, []);

  const validateForm = useCallback(() => {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'country', 'postalCode', 'phone'] as const;
    const emptyField = requiredFields.find(field => !formData[field]?.trim());
    
    if (emptyField) {
      setError(`Please fill in the ${emptyField.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError(null);
    return true;
  }, [formData]);

  const handleDownload = useCallback(async (format: 'pdf' | 'image') => {
    if (!validateForm() || !portalRef.current) return;

    setIsLoading(true);
    setShowTemplate(true);
    
    try {
      const invoiceData = {
        ...formData,
        invoiceNumber: generateInvoiceNumber(),
        date: formatDate(new Date()),
        cart,
        ...calculateTotals(cart)
      };

      onSubmit(invoiceData);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = document.getElementById('invoice-template');
      if (!element) throw new Error('Invoice template element not found');

      const success = await generateDocument(
        element,
        format,
        `invoice-${invoiceData.invoiceNumber}.${format === 'pdf' ? 'pdf' : 'png'}`
      );

      if (!success) throw new Error(`Failed to generate ${format}`);

    } catch (err) {
      console.error('Document generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate document');
    } finally {
      setShowTemplate(false);
      setIsLoading(false);
    }
  }, [validateForm, formData, cart, onSubmit, generateDocument]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <AnimatePresence mode="wait">
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
                <InvoiceModalContent 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleDownload={handleDownload}
                  isLoading={isLoading}
                  onClose={onClose}
                  error={error}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {showTemplate && portalRef.current && createPortal(
        <InvoiceTemplate data={{
          ...formData,
          invoiceNumber: generateInvoiceNumber(),
          date: formatDate(new Date()),
          cart,
          ...calculateTotals(cart)
        }} />,
        portalRef.current
      )}
    </>
  );
}