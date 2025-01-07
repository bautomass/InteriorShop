// components/invoice/InvoiceTemplate.tsx
import { InvoiceData } from '@/types/invoice';
import { memo } from 'react';

interface InvoiceTemplateProps {
  data: InvoiceData;
}

const CompanyLogo = memo(() => (
  <div className="h-[60px]">
    <img 
      src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/logo-invoice_1.png?v=1736192741"
      alt="Simple Interior Ideas Logo"
      className="h-full object-contain"
    />
  </div>
));
CompanyLogo.displayName = 'CompanyLogo';

const TableHeader = memo(() => (
  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Item</th>
    <th className="py-3 px-6 text-right text-sm font-semibold text-gray-700">Quantity</th>
    <th className="py-3 px-6 text-right text-sm font-semibold text-gray-700">Price</th>
    <th className="py-3 px-6 text-right text-sm font-semibold text-gray-700">Total</th>
  </tr>
));
TableHeader.displayName = 'TableHeader';

const BillToSection = memo(({ data }: { data: InvoiceData }) => (
  <div className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-100">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Bill To:</h2>
    <div className="text-gray-700 space-y-1">
      <p className="font-medium">{data.firstName} {data.lastName}</p>
      {data.companyName && <p className="text-gray-600">{data.companyName}</p>}
      <p className="text-gray-600">{data.address}</p>
      <p className="text-gray-600">{data.city}, {data.postalCode}</p>
      <p className="text-gray-600">{data.country}</p>
      <p className="text-gray-600">Email: {data.email}</p>
      <p className="text-gray-600">Phone: {data.phone}</p>
      {data.vatNumber && <p className="text-gray-600">VAT: {data.vatNumber}</p>}
    </div>
  </div>
));
BillToSection.displayName = 'BillToSection';

const TotalSection = memo(({ data }: { data: InvoiceData }) => (
  <div className="flex justify-end mb-8">
    <div className="w-72 bg-gray-50 p-6 rounded-lg border border-gray-100">
      <div className="flex justify-between mb-3 text-gray-600">
        <span>Subtotal:</span>
        <span>${data.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg text-gray-800 pt-3 border-t border-gray-200">
        <span>Total:</span>
        <span>${data.total.toFixed(2)}</span>
      </div>
    </div>
  </div>
));
TotalSection.displayName = 'TotalSection';

const InvoiceTemplate = ({ data }: InvoiceTemplateProps) => {
  return (
    <div id="invoice-template" className="bg-white p-10 max-w-4xl mx-auto shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">INVOICE</h1>
          <div className="space-y-1">
            <p className="text-gray-600">Invoice Number: <span className="font-medium text-gray-800">{data.invoiceNumber}</span></p>
            <p className="text-gray-600">Date: <span className="font-medium text-gray-800">{data.date}</span></p>
          </div>
        </div>
        <div className="text-right">
          <CompanyLogo />
          <div className="mt-3 space-y-1">
            <p className="text-sm text-gray-600">Simple Interior Ideas</p>
            <p className="text-sm text-gray-600">Brivibas Street 432, Riga, LV-1024</p>
            <p className="text-sm text-gray-600">info@simpleinteriorideas.com</p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <BillToSection data={data} />

      {/* Items Table */}
      <div className="mb-10 overflow-hidden rounded-lg border border-gray-100">
        <table className="w-full">
          <thead>
            <TableHeader />
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.cart.lines.map((line) => {
              const price = line.cost?.totalAmount?.amount || '0';
              const quantity = line.quantity || 0;
              const total = parseFloat(price) / quantity;

              return (
                <tr key={line.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">{line.merchandise?.product?.title || 'Unknown Product'}</td>
                  <td className="py-4 px-6 text-right">{quantity}</td>
                  <td className="py-4 px-6 text-right">
                    ${total.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right font-medium">
                    ${parseFloat(price).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <TotalSection data={data} />

      {/* Footer */}
      <div className="text-sm text-gray-600 text-center mt-12 pt-8 border-t border-gray-100">
        <p className="mb-2 font-medium text-gray-700">Thank you for your business!</p>
        <p className="text-gray-500">This is a computer-generated invoice. No signature is required.</p>
      </div>
    </div>
  );
};

export default memo(InvoiceTemplate);