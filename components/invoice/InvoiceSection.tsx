// components/invoice/InvoiceSection.tsx
'use client';

import { Cart } from '@/lib/shopify/types';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useCallback, useState } from 'react';
import InvoiceModal from './InvoiceModal';

interface InvoiceSectionProps {
  cart: Cart;
  onDownloadPDF?: () => void;
  onDownloadCSV?: () => void;
}

export default function InvoiceSection({ cart, onDownloadPDF, onDownloadCSV }: InvoiceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const handleGenerateInvoice = useCallback(async (formData: any) => {
    try {
      console.log('Generating invoice with form data:', formData);
      // Here you can add any additional logic needed when the invoice is generated
      onDownloadPDF?.();
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  }, [onDownloadPDF]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md ring-1 ring-[#6B5E4C]/10 p-4 max-w-md mx-auto hover:shadow-lg transition-shadow duration-200"
      >
        <h2 className="text-lg font-semibold text-[#6B5E4C] mb-3">Download Invoice</h2>
        
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleOpenModal}
            className="group flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md 
              bg-[#F8F6F3] shadow-sm ring-1 ring-[#6B5E4C]/10 transition-all duration-200 
              hover:shadow-md hover:bg-[#F0EDE8] text-[#6B5E4C] focus:outline-none 
              focus:ring-2 focus:ring-[#6B5E4C]/20 flex-shrink-0"
          >
            <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Generate Invoice</span>
          </button>
          
          <div className="text-sm text-[#8C7E6A]">
            PDF & Image formats available
          </div>
        </div>

        <div className="text-xs text-[#8C7E6A] border-t border-[#6B5E4C]/5 pt-2">
          Information used for invoice generation only
        </div>
      </motion.div>

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleGenerateInvoice}
        cart={cart}
      />
    </>
  );
}