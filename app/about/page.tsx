"use client";
import { Heart, Leaf, Sparkles } from 'lucide-react';
import Image from 'next/image';
export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FAF9F6]">
        {/* Hero Section */}
        <div className="relative w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] mb-6">
                Bringing Nature's Warmth Into Your Home
              </h1>
              <p className="text-lg text-[#8C7E6A] leading-relaxed">
                Simple Interior Ideas beautifully merges minimalist aesthetics with warm, earthy nuances, 
                celebrating simplicity, functionality, and natural beauty in every piece we offer.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/about-hero.jpg"
                alt="Cozy interior setting"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-[#6B5E4C] mb-6">Our Story</h2>
              <p className="text-[#8C7E6A] mb-6 leading-relaxed">
                We're passionate about creating serene, cozy, and thoughtfully designed spaces. 
                Our journey began with a simple belief: your home should be a sanctuary that 
                reflects both nature's beauty and mindful living.
              </p>
              <p className="text-[#8C7E6A] leading-relaxed">
                We source our products from artisans and small businesses who prioritize quality 
                and sustainability. Every piece in our collection tells a story of craftsmanship, 
                environmental consciousness, and timeless design.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-[#EDE8E3] py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-[#6B5E4C] text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="w-6 h-6 text-[#6B5E4C]" />
                  <h3 className="text-xl font-medium text-[#6B5E4C]">Sustainability First</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  Every product is chosen with environmental consciousness in mind, 
                  from materials to packaging.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-[#6B5E4C]" />
                  <h3 className="text-xl font-medium text-[#6B5E4C]">Artisanal Quality</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  We partner with skilled artisans who pour their heart into creating 
                  unique, handcrafted pieces.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-[#6B5E4C]" />
                  <h3 className="text-xl font-medium text-[#6B5E4C]">Cozy Living</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  We believe in creating spaces that embrace comfort and tranquility, 
                  bringing warmth to minimalist design.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Collections */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-semibold text-[#6B5E4C] text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <h3 className="text-xl font-medium text-[#6B5E4C] mb-4">Furniture</h3>
              <p className="text-[#8C7E6A]">
                Low-profile tables and minimalist pieces that blend wood, bamboo, and subtle metal accents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <h3 className="text-xl font-medium text-[#6B5E4C] mb-4">Textiles</h3>
              <p className="text-[#8C7E6A]">
                Natural linen curtains, woolen throws, and cotton rugs that embrace comfort and texture.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <h3 className="text-xl font-medium text-[#6B5E4C] mb-4">Decorative Accents</h3>
              <p className="text-[#8C7E6A]">
                Artisanal vases, rattan baskets, and wall art that celebrate organic forms and earthy tones.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <h3 className="text-xl font-medium text-[#6B5E4C] mb-4">Lighting</h3>
              <p className="text-[#8C7E6A]">
                Soft, ambient lighting solutions that create warm and inviting atmospheres.
              </p>
            </div>
          </div>
        </div>

        {/* Join Our Journey */}
        <div className="bg-[#EDE8E3] py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold text-[#6B5E4C] mb-6">Join Our Journey</h2>
            <p className="text-[#8C7E6A] max-w-2xl mx-auto mb-8">
              Be part of our community that celebrates mindful living and beautiful spaces. 
              Let's create homes that tell stories of nature, craftsmanship, and sustainable choices.
            </p>
            <button className="bg-[#6B5E4C] text-white px-8 py-3 rounded-full 
                           hover:bg-[#5A4D3B] transition-colors duration-200">
              Explore Our Collections
            </button>
          </div>
        </div>
      </main>
    </>
  );
} 