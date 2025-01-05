import type { Cart } from '@/lib/shopify/types';
import type { InvoiceData } from 'types/invoice';
import { BlobProvider } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

export default function PDFGenerator({ cart, invoiceData, fileName }: { 
  cart: Cart; 
  invoiceData: InvoiceData;
  fileName: string;
}) {
  return (
    <BlobProvider document={<InvoicePDF cart={cart} invoiceData={invoiceData} />}>
      {({ blob, url, loading }) => (
        <a 
          href={url || ''} 
          download={fileName}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#6B5E4C] hover:bg-[#8C7E6A] transition-colors duration-200"
        >
          {loading ? 'Preparing Invoice...' : 'Download Invoice'}
        </a>
      )}
    </BlobProvider>
  );
} 