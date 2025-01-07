import { NavigationHeader } from '@/components/layout/navigation-header';
import { Footer } from '@/components/layout/site-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Simple Interior Ideas - Natural & Eco-Friendly Home Decor',
  description: 'Discover the journey of Simple Interior Ideas, from our humble beginnings to becoming a leading provider of natural, eco-friendly home decor. Learn about our commitment to sustainability, artisanal craftsmanship, and mindful living.',
  openGraph: {
    title: 'Our Story | Simple Interior Ideas',
    description: 'Join us on our journey of bringing sustainable, handcrafted home decor to mindful homes worldwide. Discover how we\'re making a difference through eco-friendly practices and artisanal partnerships.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/story',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function StoryPage() {
  return (
    <>
      <NavigationHeader />
      
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] text-center">
              Our Story
            </h1>
          </div>
        </div>

        <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              The Beginning of Simple Interior Ideas
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              Simple Interior Ideas was born from a profound appreciation for natural materials and 
              traditional craftsmanship. Our journey began with a simple observation: in a world of 
              mass-produced furniture and decor, there was a growing desire for authentic, sustainably 
              crafted pieces that tell a story.
            </p>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We started by partnering with local artisans who shared our vision of creating beautiful, 
              functional pieces while respecting nature and traditional craftsmanship. These early 
              collaborations laid the foundation for what would become our signature approach to 
              home decor.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Our Philosophy
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              At the heart of Simple Interior Ideas lies a deep commitment to three core principles: 
              sustainability, craftsmanship, and mindful living. We believe that our homes should be 
              sanctuaries that reflect these values, creating spaces that are not only beautiful but 
              also environmentally conscious.
            </p>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              Every piece in our collection is carefully selected to align with these principles. 
              We work exclusively with materials that are either sustainable or recycled, ensuring 
              that our environmental impact is minimized while maximizing the beauty and functionality 
              of each item.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Artisanal Partnerships
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              Our network of artisans spans across multiple regions, each bringing their unique 
              cultural heritage and crafting traditions to our collections. These partnerships are 
              more than business relationships – they're collaborations that preserve traditional 
              crafting techniques while providing sustainable livelihoods for skilled artisans.
            </p>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We regularly visit our artisan partners, working closely with them to develop new 
              pieces that blend traditional techniques with contemporary design sensibilities. 
              This hands-on approach ensures that every item meets our high standards for quality 
              and sustainability.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Environmental Commitment
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              Our commitment to the environment extends beyond our products. We've implemented 
              sustainable practices throughout our operations, from eco-friendly packaging to 
              carbon-neutral shipping options. We're constantly exploring new ways to reduce 
              our environmental footprint while maintaining the quality our customers expect.
            </p>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We believe that beautiful homes shouldn't come at the expense of our planet. 
              That's why we're transparent about our materials, manufacturing processes, and 
              shipping practices, allowing our customers to make informed decisions about their 
              purchases.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Looking Forward
            </h2>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              As we continue to grow, our commitment to sustainability, craftsmanship, and 
              mindful living remains unwavering. We're excited about expanding our artisanal 
              network, introducing new sustainable materials, and developing innovative ways 
              to bring nature's beauty into your home.
            </p>
            <p className="text-[#8C7E6A] mb-6 leading-relaxed">
              We're grateful for our community of customers who share our values and vision. 
              Your support enables us to continue our mission of creating beautiful, sustainable 
              homes while supporting traditional craftsmanship and environmental conservation.
            </p>
          </section>

          <div className="text-center pt-8 border-t border-[#E5E0DB]">
            <p className="text-[#6B5E4C] font-medium mb-4">
              Join us in creating homes that tell stories of sustainability, craftsmanship, and mindful living.
            </p>
            <p className="text-[#8C7E6A]">
              Together, we can make a difference – one beautifully crafted piece at a time.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
} 