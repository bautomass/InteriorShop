"use client";

import { NavigationHeader } from '@/components/layout/navigation-header';
import { Footer } from '@/components/layout/site-footer';
import { Clock, Leaf, Package, PackageCheck, Shield, Truck } from 'lucide-react';

export default function ShippingPage() {
  return (
    <>
      <NavigationHeader />
      
      <main className="min-h-screen bg-[#FAF9F6]">
        {/* Hero Section */}
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] text-center">
              Our Shipping Process
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A] max-w-2xl mx-auto">
              Free worldwide shipping on all orders. Quality takes time - here's how we ensure 
              your items arrive in perfect condition.
            </p>
          </div>
        </div>

        {/* Shipping Journey */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-semibold text-[#6B5E4C] text-center mb-12">
            Our Unique Shipping Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <PackageCheck className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#6B5E4C]">Artisanal Production</h3>
              </div>
              <p className="text-[#8C7E6A]">
                Each piece is carefully crafted to order, ensuring the highest quality and reducing waste.
                This attention to detail is essential for our handcrafted items.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <Shield className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#6B5E4C]">Quality Control</h3>
              </div>
              <p className="text-[#8C7E6A]">
                Multiple inspection points guarantee that only perfect items leave our facility.
                Every product undergoes thorough checking before shipping.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <Leaf className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h3 className="text-xl font-semibold text-[#6B5E4C]">Eco-Conscious Shipping</h3>
              </div>
              <p className="text-[#8C7E6A]">
                We use cost-effective sea freight to reduce our carbon footprint and keep prices affordable,
                prioritizing environmental responsibility.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-[#EDE8E3]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] text-center mb-12">
              Shipping Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#6B5E4C]" />
                  <h3 className="text-lg font-medium text-[#6B5E4C]">Delivery Timeline</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  Standard delivery takes approximately 25-40 days, including:
                </p>
                <ul className="mt-2 space-y-2 text-[#8C7E6A]">
                  <li>• 3-5 days processing time</li>
                  <li>• 30-35 days shipping time</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-[#6B5E4C]" />
                  <h3 className="text-lg font-medium text-[#6B5E4C]">Free Worldwide Shipping</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  We offer free shipping to all countries worldwide. No minimum order required.
                  All orders include tracking and insurance.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-[#6B5E4C]" />
                  <h3 className="text-lg font-medium text-[#6B5E4C]">Shipping Protection</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  Every shipment includes:
                </p>
                <ul className="mt-2 space-y-2 text-[#8C7E6A]">
                  <li>• Full insurance coverage</li>
                  <li>• Tracking information</li>
                  <li>• Secure packaging</li>
                  <li>• Buyer protection policy</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-5 h-5 text-[#6B5E4C]" />
                  <h3 className="text-lg font-medium text-[#6B5E4C]">Order Updates</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  You'll receive email notifications at key stages:
                </p>
                <ul className="mt-2 space-y-2 text-[#8C7E6A]">
                  <li>• Order confirmation</li>
                  <li>• Processing completion</li>
                  <li>• Shipping confirmation with tracking</li>
                  <li>• Delivery confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 