import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Simple Interior Ideas',
  description: 'Learn how Simple Interior Ideas collects, uses, and protects your personal information. Read our detailed privacy policy.',
  openGraph: {
    title: 'Privacy Policy | Simple Interior Ideas',
    description: 'Our commitment to protecting your privacy and personal information.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/privacy',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-[#6B5E4C] text-center">
              Privacy Policy
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="prose prose-stone max-w-none">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              1. Information We Collect
            </h2>
            <h3 className="text-xl text-[#6B5E4C] mb-4">Personal Information</h3>
            <p className="text-[#8C7E6A] mb-6">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Name and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information</li>
              <li>Email address</li>
              <li>Account credentials</li>
              <li>Order history</li>
            </ul>

            <h3 className="text-xl text-[#6B5E4C] mb-4">Automatically Collected Information</h3>
            <p className="text-[#8C7E6A] mb-6">
              When you visit our website, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>IP address and device information</li>
              <li>Browser type and settings</li>
              <li>Browsing activity and patterns</li>
              <li>Shopping preferences</li>
              <li>Cookie data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              2. How We Use Your Information
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We use the collected information for:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Processing and fulfilling orders</li>
              <li>Providing customer support</li>
              <li>Sending order updates and tracking information</li>
              <li>Marketing communications (with consent)</li>
              <li>Improving our website and services</li>
              <li>Analyzing shopping trends</li>
              <li>Preventing fraud and maintaining security</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              3. Information Sharing
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Payment processors and shipping providers</li>
              <li>Analytics and marketing service providers</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners (with your consent)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              4. Data Security
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We implement appropriate security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>SSL encryption for data transmission</li>
              <li>Secure data storage systems</li>
              <li>Regular security assessments</li>
              <li>Limited employee access to personal data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              5. Your Rights and Choices
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Disable cookies through your browser</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              6. Cookies and Tracking
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Remember your preferences</li>
              <li>Analyze website usage</li>
              <li>Personalize your experience</li>
              <li>Provide targeted advertising</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              7. Children's Privacy
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Our services are not directed to children under 13. We do not knowingly collect 
              information from children under 13. If we discover we have collected information 
              from a child under 13, we will delete it.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              8. International Data Transfers
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              9. Changes to This Policy
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We may update this policy periodically. We will notify you of material changes 
              through our website or email. Continued use of our services after changes 
              constitutes acceptance of the updated policy.
            </p>

            <div className="mt-12 p-6 bg-[#EDE8E3] rounded-lg">
              <p className="text-[#6B5E4C] font-medium mb-4">
                Contact Us About Privacy
              </p>
              <p className="text-[#8C7E6A]">
                If you have questions about this Privacy Policy, please contact our Privacy Team at{' '}
                <a href="mailto:privacy@simpleinteriorideas.com" 
                   className="text-[#6B5E4C] hover:underline">
                  privacy@simpleinteriorideas.com
                </a>
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
} 