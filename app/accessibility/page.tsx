import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement | Simple Interior Ideas',
  description: 'Learn about our commitment to digital accessibility and the measures we take to ensure our website is accessible to all users.',
  openGraph: {
    title: 'Accessibility Statement | Simple Interior Ideas',
    description: 'Our commitment to providing an accessible website experience for all users.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/accessibility',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function AccessibilityPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-[#6B5E4C] text-center">
              Accessibility Statement
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="prose prose-stone max-w-none">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Our Commitment
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Simple Interior Ideas is committed to ensuring digital accessibility for people with 
              disabilities. We are continually improving the user experience for everyone and 
              applying the relevant accessibility standards.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Conformance Status
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA 
              standards. These guidelines explain how to make web content more accessible for 
              people with disabilities and more user-friendly for everyone.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Accessibility Features
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Our website includes the following accessibility features:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Semantic HTML for clear document structure</li>
              <li>ARIA landmarks and labels where appropriate</li>
              <li>Sufficient color contrast ratios</li>
              <li>Clear focus indicators</li>
              <li>Alt text for images</li>
              <li>Keyboard navigation support</li>
              <li>Resizable text without loss of functionality</li>
              <li>Skip navigation links</li>
              <li>Consistent navigation structure</li>
              <li>Form labels and error messages</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Assistive Technology Support
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Our website is designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Known Limitations
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              While we strive for comprehensive accessibility, some content may have limitations:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>PDF documents may not be fully accessible</li>
              <li>Some older product images may lack complete descriptions</li>
              <li>Third-party content may not meet our accessibility standards</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Alternative Formats
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We are happy to provide alternative formats of any information on our website. 
              Please contact us with your request and preferred format.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Continuous Improvement
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We are committed to:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Regular accessibility audits</li>
              <li>Staff training on accessibility</li>
              <li>User feedback incorporation</li>
              <li>Staying current with accessibility standards</li>
              <li>Testing with assistive technologies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Testing
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Our website is regularly tested using:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Manual keyboard navigation testing</li>
              <li>Screen reader testing</li>
              <li>Automated accessibility tools</li>
              <li>Color contrast analyzers</li>
              <li>User testing with people who have disabilities</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Feedback and Support
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We welcome your feedback on the accessibility of our website. If you experience any 
              accessibility barriers or have suggestions for improvement, please contact us.
            </p>

            <div className="mt-12 p-6 bg-[#EDE8E3] rounded-lg">
              <p className="text-[#6B5E4C] font-medium mb-4">
                Contact Us About Accessibility
              </p>
              <p className="text-[#8C7E6A] mb-4">
                Email:{' '}
                <a href="mailto:accessibility@simpleinteriorideas.com" 
                   className="text-[#6B5E4C] hover:underline">
                  info@simpleinteriorideas.com
                </a>
              </p>
              <p className="text-[#8C7E6A]">
                We aim to respond to accessibility feedback within 2 business days.
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
} 