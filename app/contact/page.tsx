import { Clock, MessageSquare, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FAF9F6]">
        {/* Hero Section */}
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] text-center">
              Let's Connect
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A] max-w-2xl mx-auto">
              We're here to help you create your perfect space. Our dedicated team is ready 
              to assist you with any questions about our extensive collection of home decor, 
              furniture, textiles, accessories, and more.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Support */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <MessageSquare className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h2 className="text-xl font-semibold text-[#6B5E4C]">Customer Support</h2>
              </div>
              <p className="text-[#8C7E6A] mb-4">
                Our support team is available to help you with product inquiries, orders, 
                and delivery information across our entire range of home decor and accessories.
              </p>
              <p className="text-[#6B5E4C] font-medium">
                info@simpleinteriors.com
              </p>
            </div>

            {/* Quick Contact */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <Phone className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h2 className="text-xl font-semibold text-[#6B5E4C]">Quick Contact</h2>
              </div>
              <p className="text-[#8C7E6A] mb-4">
                For immediate assistance, reach out to us directly:
              </p>
              <p className="text-[#6B5E4C] font-medium">+371 26 123 456</p>
            </div>

            {/* Availability */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#EDE8E3] rounded-full">
                  <Clock className="w-6 h-6 text-[#6B5E4C]" />
                </div>
                <h2 className="text-xl font-semibold text-[#6B5E4C]">Response Time</h2>
              </div>
              <p className="text-[#8C7E6A] mb-4">
                We aim to respond to all inquiries within:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8C7E6A]">Emails</span>
                  <span className="text-[#6B5E4C] font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C7E6A]">Phone Calls</span>
                  <span className="text-[#6B5E4C] font-medium">Immediate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-16 bg-white p-8 rounded-lg shadow-sm border border-[#E5E0DB]">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">Specialized Inquiries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-[#6B5E4C] mb-2">Business Partnerships</h3>
                <p className="text-[#8C7E6A]">
                  Interested in collaborating or wholesale opportunities?<br />
                  <span className="text-[#6B5E4C] font-medium">business@simpleinteriors.com</span>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#6B5E4C] mb-2">Media Inquiries</h3>
                <p className="text-[#8C7E6A]">
                  For press and media related questions:<br />
                  <span className="text-[#6B5E4C] font-medium">press@simpleinteriors.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 