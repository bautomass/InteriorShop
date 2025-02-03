
import { Heart, Sparkles, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Simple Interior Ideas - Join Our Team',
  description: 'Join our team at Simple Interior Ideas and be part of a company dedicated to sustainable home decor and artisanal craftsmanship. Discover our company culture and values.',
  openGraph: {
    title: 'Join Our Team | Simple Interior Ideas',
    description: 'Be part of our mission to bring sustainable, handcrafted home decor to mindful homes worldwide.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/careers',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function CareersPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] text-center">
              Join Our Team
            </h1>
            <p className="mt-6 text-center text-[#8C7E6A] max-w-2xl mx-auto">
              Be part of a team passionate about sustainable living and beautiful design.
            </p>
          </div>
        </div>

        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Company Culture */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Our Culture
            </h2>
            <p className="text-[#8C7E6A] mb-8 leading-relaxed">
              At Simple Interior Ideas, we foster a culture of creativity, sustainability, and 
              collaboration. Our team is united by a shared passion for beautiful design and 
              environmental consciousness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-5 h-5 text-[#6B5E4C]" />
                  <h3 className="font-medium text-[#6B5E4C]">Purpose-Driven</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  Make a positive impact on homes and the environment through sustainable design.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-[#6B5E4C]" />
                  <h3 className="font-medium text-[#6B5E4C]">Collaborative</h3>
                </div>
                <p className="text-[#8C7E6A]">
                  Work with passionate individuals who value teamwork and shared success.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Why Join Us
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <ul className="space-y-4 text-[#8C7E6A]">
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#6B5E4C] mt-1" />
                  <span>Flexible work arrangements and remote options</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#6B5E4C] mt-1" />
                  <span>Competitive compensation and benefits package</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#6B5E4C] mt-1" />
                  <span>Professional development opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#6B5E4C] mt-1" />
                  <span>Employee discount on our products</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#6B5E4C] mt-1" />
                  <span>Health and wellness programs</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Current Openings */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Current Openings
            </h2>
            <div className="bg-[#EDE8E3] p-8 rounded-lg text-center">
              <p className="text-[#6B5E4C] font-medium mb-4">
                No Current Openings
              </p>
              <p className="text-[#8C7E6A]">
                While we don't have any positions available at the moment, we're always 
                interested in connecting with talented individuals who share our values.
              </p>
            </div>
          </section>

          {/* Future Opportunities */}
          <section>
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Future Opportunities
            </h2>
            <p className="text-[#8C7E6A] mb-8 leading-relaxed">
              We're growing and occasionally have openings in these areas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg text-[#8C7E6A]">
                • Product Design & Development
              </div>
              <div className="bg-white p-4 rounded-lg text-[#8C7E6A]">
                • Customer Experience
              </div>
              <div className="bg-white p-4 rounded-lg text-[#8C7E6A]">
                • Marketing & Content Creation
              </div>
              <div className="bg-white p-4 rounded-lg text-[#8C7E6A]">
                • Operations & Logistics
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <div className="mt-16 text-center pt-8 border-t border-[#E5E0DB]">
            <p className="text-[#6B5E4C] font-medium mb-4">
              Interested in joining our team?
            </p>
            <p className="text-[#8C7E6A] mb-6">
              Send your resume and a cover letter to:
              <br />
              <a href="mailto:careers@simpleinteriorideas.com" 
                 className="text-[#6B5E4C] hover:underline">
                careers@simpleinteriorideas.com
              </a>
            </p>
            <p className="text-[#8C7E6A] text-sm">
              We'll keep your information on file for future opportunities.
            </p>
          </div>
        </div>
      </main>
    </>
  );
} 