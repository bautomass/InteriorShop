'use client';

import { Cart } from '@/lib/shopify/types';
import { InvoiceFormData, calculateTotals, formatDate, generateInvoiceNumber } from '@/types/invoice';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const InvoiceTemplate = dynamic(() => import('./InvoiceTemplate'), { ssr: false });
const InvoiceModalContent = dynamic(() => import('./InvoiceModalContent'), { ssr: false });

interface InvoiceModalProps {
 isOpen: boolean;
 onClose: () => void;
 cart: Cart;
 onSubmit: (formData: any) => void;
}

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

 useEffect(() => {
   const container = document.createElement('div');
   container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:800px;height:0;overflow:hidden;opacity:0;pointer-events:none;background-color:white;padding:20px;z-index:-1;';
   document.body.appendChild(container);
   setPortalContainer(container);
   return () => {
     document.body.removeChild(container);
   };
 }, []);

 useEffect(() => {
   document.body.style.overflow = isOpen ? 'hidden' : 'unset';
   const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && !isLoading && onClose();
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

 const generateInvoice = useCallback(() => ({
   ...formData,
   invoiceNumber: generateInvoiceNumber(),
   date: formatDate(new Date()),
   cart,
   ...calculateTotals(cart)
 }), [formData, cart]);

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
   
   const html2canvas = (await import('html2canvas')).default;
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
     const invoiceData = generateInvoice();
     onSubmit(invoiceData);
     
     // Allow time for template to render
     await new Promise(resolve => setTimeout(resolve, 500));
     const canvas = await captureElement();
     
     if (!canvas) {
       throw new Error('Canvas generation failed');
     }
     
     if (format === 'pdf') {
       const { default: jsPDF } = await import('jspdf');
       const pdf = new jsPDF({
         orientation: 'portrait',
         unit: 'mm',
         format: 'a4'
       });

       const imgData = canvas.toDataURL('image/jpeg', 1.0);
       const pdfWidth = pdf.internal.pageSize.getWidth();
       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

       await pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
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
               <InvoiceModalContent 
                 formData={formData}
                 handleInputChange={handleInputChange}
                 handleDownload={handleDownload}
                 isLoading={isLoading}
                 onClose={onClose}
               />
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