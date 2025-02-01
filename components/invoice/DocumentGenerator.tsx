// components/invoice/DocumentGenerator.tsx
'use client';

import { useCallback } from 'react';

export function useDocumentGenerator() {
  const generateDocument = useCallback(async (element: HTMLElement, format: 'pdf' | 'image', filename: string) => {
    try {
      const { default: html2canvas } = await import(
        'html2canvas'
      );

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: element.offsetHeight,
        logging: false
      });

      if (format === 'pdf') {
        const { default: jsPDF } = await import(
          'jspdf'
        );

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        await pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
      } else {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }

      return true;
    } catch (error) {
      console.error('Error generating document:', error);
      return false;
    }
  }, []);

  return { generateDocument };
}