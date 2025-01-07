import { NavigationHeader } from '@/components/layout/navigation-header';
import { Footer } from '@/components/layout/site-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Simple Interior Ideas',
  description: 'Learn about how Simple Interior Ideas uses cookies and similar technologies to enhance your browsing experience.',
  openGraph: {
    title: 'Cookie Policy | Simple Interior Ideas',
    description: 'Understanding our use of cookies and your choices regarding cookie preferences.',
    type: 'website',
    url: 'https://simpleinteriorideas.com/cookies',
    siteName: 'Simple Interior Ideas',
    images: [{
      url: 'https://simpleinteriorideas.com/og-image.jpg',
    }],
  }
};

export default function CookiePolicyPage() {
  return (
    <>
      <NavigationHeader />
      
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-[#6B5E4C] text-center">
              Cookie Policy
            </h1>
            <p className="mt-4 text-center text-[#8C7E6A]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="prose prose-stone max-w-none">
            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              What Are Cookies?
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              analyzing site usage, and assisting with our marketing efforts.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Types of Cookies We Use
            </h2>

            <h3 className="text-xl text-[#6B5E4C] mb-4">Essential Cookies</h3>
            <p className="text-[#8C7E6A] mb-6">
              These cookies are necessary for the website to function properly. They enable basic 
              functions like page navigation, secure areas access, and shopping cart functionality. 
              The website cannot function properly without these cookies.
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Authentication cookies</li>
              <li>Shopping cart cookies</li>
              <li>Security cookies</li>
              <li>Load balancing cookies</li>
            </ul>

            <h3 className="text-xl text-[#6B5E4C] mb-4">Performance Cookies</h3>
            <p className="text-[#8C7E6A] mb-6">
              These cookies help us understand how visitors interact with our website by collecting 
              and reporting information anonymously.
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Google Analytics cookies</li>
              <li>Page load time tracking</li>
              <li>Error logging cookies</li>
              <li>User behavior analytics</li>
            </ul>

            <h3 className="text-xl text-[#6B5E4C] mb-4">Functionality Cookies</h3>
            <p className="text-[#8C7E6A] mb-6">
              These cookies enable enhanced functionality and personalization, such as remembering 
              your preferences and choices.
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Language preferences</li>
              <li>Region settings</li>
              <li>Personalized recommendations</li>
              <li>User interface customization</li>
            </ul>

            <h3 className="text-xl text-[#6B5E4C] mb-4">Marketing Cookies</h3>
            <p className="text-[#8C7E6A] mb-6">
              These cookies track your browsing habits to deliver advertising more relevant to you 
              and your interests.
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Retargeting cookies</li>
              <li>Social media cookies</li>
              <li>Advertisement cookies</li>
              <li>Campaign effectiveness tracking</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Third-Party Cookies
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We use services from these third parties that may set cookies:
            </p>
            <ul className="list-disc pl-6 text-[#8C7E6A] mb-6">
              <li>Google Analytics (analytics)</li>
              <li>Stripe (payment processing)</li>
              <li>Facebook Pixel (marketing)</li>
              <li>Hotjar (user behavior)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Cookie Duration
            </h2>
            <div className="space-y-4 text-[#8C7E6A] mb-6">
              <p><strong>Session Cookies:</strong> These temporary cookies are erased when you close your browser.</p>
              <p><strong>Persistent Cookies:</strong> These remain on your device until they expire or you delete them.</p>
            </div>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Managing Your Cookie Preferences
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              You can control and/or delete cookies as you wish. You can delete all cookies that are 
              already on your computer and you can set most browsers to prevent them from being placed.
            </p>

            <div className="bg-[#EDE8E3] p-6 rounded-lg mb-6">
              <h3 className="text-xl text-[#6B5E4C] mb-4">Browser Settings</h3>
              <p className="text-[#8C7E6A] mb-4">
                To manage cookies through your browser settings:
              </p>
              <ul className="list-disc pl-6 text-[#8C7E6A]">
                <li>Chrome: Settings → Privacy and Security → Cookies</li>
                <li>Firefox: Options → Privacy & Security → Cookies</li>
                <li>Safari: Preferences → Privacy → Cookies</li>
                <li>Edge: Settings → Privacy & Security → Cookies</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Impact of Disabling Cookies
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              Please note that disabling certain cookies may impact the functionality of our website. 
              Essential cookies cannot be disabled as they are necessary for basic site operations.
            </p>

            <h2 className="text-2xl font-semibold text-[#6B5E4C] mb-6">
              Updates to This Policy
            </h2>
            <p className="text-[#8C7E6A] mb-6">
              We may update this Cookie Policy periodically. Changes will become effective immediately 
              upon posting. Continued use of our website after changes constitutes acceptance of the 
              updated policy.
            </p>

            <div className="mt-12 p-6 bg-[#EDE8E3] rounded-lg">
              <p className="text-[#6B5E4C] font-medium mb-4">
                Questions About Cookies?
              </p>
              <p className="text-[#8C7E6A]">
                If you have questions about our Cookie Policy, please contact us at{' '}
                <a href="mailto:privacy@simpleinteriorideas.com" 
                   className="text-[#6B5E4C] hover:underline">
                  privacy@simpleinteriorideas.com
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