import { Box, CheckCircle2, Package, Truck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order | Simple Interior Ideas',
  description: 'Track the status and location of your Simple Interior Ideas order with our real-time tracking system.',
  openGraph: {
    title: 'Track Your Order | Simple Interior Ideas',
    description: 'Stay updated on your order status with our easy-to-use tracking system.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/track-order',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function TrackOrderPage() {
  return (
    <>  
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-[#6B5E4C] text-center">
              Track Your Order
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A]">
              Enter your order number to see real-time status and delivery updates
            </p>
          </div>
        </div>

        <div className="max-w-[600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Tracking Form */}
          <form className="bg-white p-8 rounded-lg shadow-sm mb-12">
            <div className="mb-6">
              <label htmlFor="orderNumber" 
                     className="block text-[#6B5E4C] font-medium mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                placeholder="Enter your order number (e.g., SII-12345)"
                className="w-full px-4 py-3 rounded-md border border-[#B5A48B]/20 
                         focus:outline-none focus:border-[#6B5E4C] 
                         bg-white/50 text-[#6B5E4C] placeholder-[#8C7E6A]/50"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" 
                     className="block text-[#6B5E4C] font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter the email used for order"
                className="w-full px-4 py-3 rounded-md border border-[#B5A48B]/20 
                         focus:outline-none focus:border-[#6B5E4C] 
                         bg-white/50 text-[#6B5E4C] placeholder-[#8C7E6A]/50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#6B5E4C] text-white py-3 rounded-md 
                       hover:bg-[#5A4D3B] transition-colors duration-200"
            >
              Track Order
            </button>
          </form>

          {/* Example Tracking Status (to be replaced with API data) */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#6B5E4C]">
                Order Status
              </h2>
              <span className="text-sm text-[#8C7E6A]">
                Order #: SII-12345
              </span>
            </div>

            {/* Status Timeline */}
            <div className="relative">
              <div className="absolute left-[17px] top-0 h-full w-[2px] bg-[#B5A48B]/20" />
              
              {/* Completed Steps */}
              <div className="relative flex items-start mb-8">
                <div className="absolute left-0 w-9 h-9 rounded-full bg-[#6B5E4C] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="ml-16">
                  <h3 className="text-[#6B5E4C] font-medium">Order Confirmed</h3>
                  <p className="text-sm text-[#8C7E6A]">March 15, 2024 - 10:30 AM</p>
                  <p className="text-sm text-[#8C7E6A] mt-1">
                    Your order has been received and confirmed
                  </p>
                </div>
              </div>

              <div className="relative flex items-start mb-8">
                <div className="absolute left-0 w-9 h-9 rounded-full bg-[#6B5E4C] flex items-center justify-center">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <div className="ml-16">
                  <h3 className="text-[#6B5E4C] font-medium">Processing</h3>
                  <p className="text-sm text-[#8C7E6A]">March 16, 2024 - 2:45 PM</p>
                  <p className="text-sm text-[#8C7E6A] mt-1">
                    Your order is being prepared for shipping
                  </p>
                </div>
              </div>

              {/* Current Step */}
              <div className="relative flex items-start mb-8">
                <div className="absolute left-0 w-9 h-9 rounded-full bg-[#B5A48B] flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="ml-16">
                  <h3 className="text-[#6B5E4C] font-medium">Shipping</h3>
                  <p className="text-sm text-[#8C7E6A]">Expected: March 18, 2024</p>
                  <p className="text-sm text-[#8C7E6A] mt-1">
                    Your order is on its way
                  </p>
                </div>
              </div>

              {/* Pending Steps */}
              <div className="relative flex items-start">
                <div className="absolute left-0 w-9 h-9 rounded-full bg-[#EDE8E3] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#B5A48B]" />
                </div>
                <div className="ml-16">
                  <h3 className="text-[#8C7E6A] font-medium">Delivery</h3>
                  <p className="text-sm text-[#8C7E6A]">Expected: March 20, 2024</p>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="mt-12 pt-8 border-t border-[#B5A48B]/20">
              <h3 className="text-[#6B5E4C] font-medium mb-4">
                Delivery Information
              </h3>
              <div className="space-y-2 text-sm text-[#8C7E6A]">
                <p>Carrier: Premium Logistics</p>
                <p>Tracking Number: PL123456789</p>
                <p>Estimated Delivery: March 20, 2024</p>
                <p>Shipping Address: 123 Example St, City, Country</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 