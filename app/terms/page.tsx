import { NavigationHeader } from '@/components/layout/navigation-header';
import { Footer } from '@/components/layout/site-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Simple Interior Ideas',
  description: 'Terms and conditions for using Simple Interior Ideas services and products. Read our policies, rights, and obligations.',
  openGraph: {
    title: 'Terms of Service | Simple Interior Ideas',
    description: 'Our terms of service outline the rules, guidelines, and policies for using Simple Interior Ideas products and services.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/terms',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function TermsPage() {
  return (
    <>
      <NavigationHeader />
      
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-[#6B5E4C] text-center">
              Terms of Service
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="prose prose-stone max-w-none">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              1. Agreement to Terms
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              By accessing or using Simple Interior Ideas services, you agree to be bound by these Terms. 
              If you disagree with any part of the terms, you may not access our services.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              2. Products and Services
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              All products are subject to availability. We reserve the right to discontinue any product 
              at any time. Prices are subject to change without notice. Product images are representative 
              only; actual items may vary due to the handcrafted nature of our products.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              3. Orders and Payment
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              By placing an order, you warrant that you are legally capable of entering binding contracts. 
              We reserve the right to refuse any order without stating reasons. Payment must be received 
              in full before order processing begins.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              4. Account Management
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              You are responsible for maintaining the confidentiality of your account credentials. 
              We reserve the right to suspend or terminate accounts that violate our terms. 
              You must provide accurate and complete information when creating an account.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              5. Pricing and Payments
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              All prices are in USD unless otherwise stated. We reserve the right to modify pricing 
              without notice. Payment processing is handled by secure third-party providers. 
              By making a purchase, you warrant that you have authorization to use the payment method.
              Promotional codes are subject to our discretion and may be revoked at any time.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              6. Shipping and Delivery
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Shipping times are estimates only. International orders may be subject to customs duties. 
              We are not responsible for delays due to customs processing or local delivery services. 
              Risk of loss transfers upon delivery to the carrier. Signature may be required for 
              high-value items.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              7. Returns and Cancellations
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Returns must be initiated within 30 days and approved by our team. Items must be unused, 
              undamaged, and in original packaging. Custom orders are non-returnable. Refunds exclude 
              original shipping costs. We reserve the right to refuse returns that don't meet our criteria. 
              Cancellations after order processing may incur fees.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              8. Product Warranty and Disclaimers
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              30-day limited warranty covers manufacturing defects only. Natural variations, minor 
              imperfections, and wear from normal use are not covered. Colors may vary from digital 
              representations. Warranty is void if product is modified or improperly maintained. 
              Replacement or repair decision is at our discretion.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              9. Intellectual Property Rights
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              All content, including images, text, logos, and designs, is our exclusive property. 
              No content may be reproduced, modified, or distributed without written permission. 
              Product reviews and feedback may be used by us for promotional purposes. User-submitted 
              content must not infringe on third-party rights.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              10. Privacy and Data Protection
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We collect and process data in accordance with our Privacy Policy and applicable laws. 
              By using our services, you consent to data collection and processing. We use industry-standard 
              security measures but cannot guarantee absolute security. You have rights regarding your 
              personal data as outlined in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              11. Dispute Resolution
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Any disputes shall be resolved through arbitration in [Your Jurisdiction]. Class action 
              waiver applies. You agree to attempt informal resolution before initiating formal proceedings. 
              Choice of law is [Your State/Country] law. Time limit for claims is one year from incident.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              12. Limitation of Liability
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Our liability is limited to the purchase price of the product. We are not liable for 
              indirect, consequential, or punitive damages. Force majeure events excuse performance. 
              Some jurisdictions may not allow liability limitations, so these may not fully apply to you.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              13. Website Use and Security
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              You agree not to use automated systems without permission. We may monitor usage for security. 
              You must not attempt to breach security measures. Website availability is not guaranteed. 
              We reserve the right to restrict access based on geographic location.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              14. Modifications to Terms
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We may modify these terms at any time without individual notice. Changes are effective 
              immediately upon posting. Continued use constitutes acceptance of modified terms. 
              Material changes may be announced through our website or email.
            </p>

            <div className="mt-12 p-6 bg-[#EDE8E3] rounded-lg">
              <p className="text-[#6B5E4C] font-medium mb-4">
                Contact Us
              </p>
              <p className="text-[#8C7E6A]">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@simpleinteriorideas.com" 
                   className="text-[#6B5E4C] hover:underline">
                  legal@simpleinteriorideas.com
                </a>
              </p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
} 