"use client";
import { AlertCircle, ArrowLeftRight, Calendar, ShieldCheck } from 'lucide-react';
export default function ReturnsPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FAF9F6]">
        {/* Hero Section */}
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] text-center">
              Returns & Exchanges
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A] max-w-2xl mx-auto">
              We stand behind the quality of our products with a 30-day money-back guarantee, 
              subject to our fair usage policy.
            </p>
          </div>
        </div>

        {/* Main Policy Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <Calendar className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#6B5E4C]">30-Day Window</h3>
              </div>
              <p className="text-[#8C7E6A]">
                Return requests must be initiated within 30 days of delivery. Items must be unused, 
                in their original packaging, with all tags attached.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <ShieldCheck className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#6B5E4C]">Quality Guarantee</h3>
              </div>
              <p className="text-[#8C7E6A]">
                We carefully inspect all items before shipping. Any quality issues must be reported 
                with photos within 48 hours of delivery.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <ArrowLeftRight className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#6B5E4C]">Exchange Options</h3>
              </div>
              <p className="text-[#8C7E6A]">
                We offer exchanges for different sizes or colors when available. Original shipping 
                costs are non-refundable.
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-8">Return Policy Details</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E0DB]">
                <h3 className="text-lg font-medium text-[#6B5E4C] mb-3">Return Conditions</h3>
                <ul className="space-y-2 text-[#8C7E6A]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Items must be unused, unwashed, and unaltered
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Original packaging must be intact and included
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    All tags and labels must be attached
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Return shipping costs are the responsibility of the customer
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E0DB]">
                <h3 className="text-lg font-medium text-[#6B5E4C] mb-3">Non-Returnable Items</h3>
                <ul className="space-y-2 text-[#8C7E6A]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Items marked as "Final Sale" or purchased at a discount
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Personal care items and candles for hygiene reasons
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Custom or personalized orders
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Items showing signs of use or wear
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E0DB]">
                <h3 className="text-lg font-medium text-[#6B5E4C] mb-3">Refund Process</h3>
                <ul className="space-y-2 text-[#8C7E6A]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Refunds are processed within 5-7 business days after inspection
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Original shipping costs are non-refundable
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    Refunds are issued to the original payment method
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B5A48B] mt-1">•</span>
                    A 15% restocking fee may apply to returns without original packaging
                  </li>
                </ul>
              </div>

              {/* Important Notice */}
              <div className="bg-[#EDE8E3] p-6 rounded-lg border border-[#B5A48B]/20">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-[#6B5E4C]" />
                  <h3 className="text-lg font-medium text-[#6B5E4C]">Important Notice</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  We reserve the right to deny returns that don't meet our conditions. To ensure a smooth 
                  return process, please carefully review our policy before making a purchase. All return 
                  decisions are final after our inspection process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 