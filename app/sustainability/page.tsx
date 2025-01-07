import { NavigationHeader } from '@/components/layout/navigation-header';
import { Footer } from '@/components/layout/site-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sustainability | Simple Interior Ideas - Eco-Friendly Home Decor',
  description: 'Learn about our commitment to sustainability, from eco-friendly materials and ethical production to carbon-neutral shipping and zero-waste packaging.',
  openGraph: {
    title: 'Our Sustainability Promise | Simple Interior Ideas',
    description: 'Discover how we\'re making a positive environmental impact through sustainable materials, ethical production, and eco-conscious shipping practices.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/sustainability',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function SustainabilityPage() {
  return (
    <>
      <NavigationHeader />
      
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] text-center">
              Our Commitment to Sustainability
            </h1>
            <p className="mt-6 text-center text-[#8C7E6A] max-w-2xl mx-auto">
              Every decision we make is guided by our commitment to environmental stewardship 
              and sustainable practices.
            </p>
          </div>
        </div>

        <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Sustainable Materials
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We carefully select materials that have minimal environmental impact. Our products 
              feature sustainably sourced wood from certified forests, organic textiles, and 
              recycled materials whenever possible.
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] space-y-2">
              <li>FSC-certified wood from responsibly managed forests</li>
              <li>GOTS-certified organic cotton and natural fibers</li>
              <li>Recycled metals and glass</li>
              <li>Natural dyes and non-toxic finishes</li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Ethical Production
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We partner with artisans and workshops that share our commitment to environmental 
              responsibility. Our production processes prioritize:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] space-y-2">
              <li>Energy-efficient manufacturing</li>
              <li>Water conservation practices</li>
              <li>Waste reduction and recycling</li>
              <li>Fair labor practices and safe working conditions</li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Packaging & Shipping
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We're committed to minimizing our carbon footprint through thoughtful packaging 
              and shipping practices:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] space-y-2">
              <li>100% plastic-free packaging</li>
              <li>Recycled and recyclable materials</li>
              <li>Carbon-neutral shipping options</li>
              <li>Consolidated shipping to reduce trips</li>
              <li>Local warehousing to minimize transport distances</li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Product Lifecycle
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We design our products with longevity in mind, reducing the need for frequent 
              replacements. Our approach includes:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] space-y-2">
              <li>Timeless designs that transcend trends</li>
              <li>Durable construction for extended product life</li>
              <li>Repairable and maintainable products</li>
              <li>End-of-life recycling guidance</li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Environmental Partnerships
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We actively support environmental initiatives and partner with organizations 
              dedicated to conservation and sustainability:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] space-y-2">
              <li>Tree planting programs</li>
              <li>Ocean cleanup initiatives</li>
              <li>Renewable energy projects</li>
              <li>Artisan community support</li>
            </ul>
          </section>

          <div className="text-center pt-8 border-t border-[#E5E0DB]">
            <p className="text-[#6B5E4C] font-medium mb-4">
              Our Sustainability Promise
            </p>
            <p className="text-[#8C7E6A]">
              We're committed to continuous improvement in our environmental practices. 
              By choosing Simple Interior Ideas, you're supporting sustainable and ethical 
              home decor that respects our planet.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
} 