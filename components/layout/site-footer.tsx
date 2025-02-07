'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, MapPin, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const footerLinks: Record<'shop' | 'support' | 'company' | 'legal', { label: string; href: string; }[]> = {
  shop: [
    { label: 'All Products', href: '/collections/all-products' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Best Sellers', href: '/collections/best-sellers' },
    { label: 'Collections', href: '/collections' },
    { label: 'Sale Items', href: '/collections/sale' }
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Track Order', href: '/track-order' }
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/story' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Terms of Service', href: '/terms' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' }
  ]
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

const MobileDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('shop');

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity z-40 lg:hidden
                   ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Bottom Drawer - Tab Version */}
      <div 
        className={`fixed bottom-0 left-0 right-0 w-full bg-[#FAF7F2] z-50 
                   transform transition-all duration-300 ease-in-out lg:hidden
                   rounded-t-2xl shadow-2xl
                   ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Drawer Handle */}
        <div className="w-full flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-[#B5A48B]/30 rounded-full" />
        </div>

        {/* Close Button - Only render if the drawer is open */}
        {isOpen && (
          <button 
            onClick={onClose}
            className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm
                       px-8 py-2.5 rounded-full shadow-lg text-[#6B5E4C] hover:text-[#8C7E6A]
                       transition-all duration-200 hover:bg-white group"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>
        )}

        {/* Tab Navigation - Centered with max-width */}
        <div className="px-4 pt-2">
          <div className="flex justify-center border-b border-[#B5A48B]/20">
            <div className="flex space-x-2 sm:space-x-4">
              {['shop', 'support', 'company'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-6 text-base font-medium transition-all duration-200 
                            min-w-[80px] max-w-[250px] flex-1
                            ${activeTab === tab 
                              ? 'text-[#6B5E4C] border-b-2 border-[#6B5E4C]' 
                              : 'text-[#8C7E6A] hover:text-[#6B5E4C]/80'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Content - Active Tab */}
        <div className="px-6 py-8">
          <div className="flex flex-col items-center gap-5 max-w-md mx-auto">
            {footerLinks[activeTab as keyof typeof footerLinks].map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-lg text-[#8C7E6A] hover:text-[#6B5E4C] 
                         transition-all duration-200 hover:scale-105
                         py-1 w-full text-center font-medium"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export function Footer() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <footer ref={ref} className="bg-[#FAF7F2] border-t border-[#B5A48B]/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 lg:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <motion.div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <img 
                  src="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/LOGO-SVG.svg?v=1738779893"
                  alt="Simple Interior Ideas"
                  width={190}
                  height={45}
                  className="inline-block"
                />
              </Link>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden w-12 h-12 rounded-full bg-[#6B5E4C]/5 flex items-center justify-center
                          hover:bg-[#6B5E4C]/10 transition-all duration-200 hover:scale-105"
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7 text-[#6B5E4C]" />
              </button>
            </div>
            <p className="text-[#8C7E6A] text-sm mb-6 max-w-md">
              We blend minimalist design with natural beauty, partnering with artisans to create sustainable, handcrafted home pieces that transform spaces into mindful sanctuaries of comfort and authenticity.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#8C7E6A]">
                <MapPin className="w-4 h-4 text-[#B5A48B]" />
                <span>Brivibas Street 432, Riga, LV-1024</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8C7E6A]">
                <Mail className="w-4 h-4 text-[#B5A48B]" />
                <span>info@simpleinteriorideas.com</span>
              </div>
            </div>
          </motion.div>

          {/* Mobile Drawer */}
          <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

          {/* Desktop Links */}
          <div className="hidden lg:grid lg:col-span-3 lg:grid-cols-3 lg:gap-8">
            <motion.div>
              <h3 className="text-[#6B5E4C] font-medium mb-4">Shop</h3>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-[#8C7E6A] hover:text-[#6B5E4C] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div>
              <h3 className="text-[#6B5E4C] font-medium mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-[#8C7E6A] hover:text-[#6B5E4C] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div>
              <h3 className="text-[#6B5E4C] font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-[#8C7E6A] hover:text-[#6B5E4C] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="py-8 border-t border-[#B5A48B]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div>
              <h3 className="text-[#6B5E4C] font-medium mb-2">Stay Updated</h3>
              <p className="text-sm text-[#8C7E6A] mb-4">
                Subscribe to our newsletter for exclusive offers and updates.
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md border border-[#B5A48B]/20 
                           focus:outline-none focus:border-[#6B5E4C] 
                           bg-white/50 text-[#6B5E4C]"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6B5E4C] text-white rounded-md 
                           hover:bg-[#5A4D3B] transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>

            <motion.div className="flex justify-start md:justify-end items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#6B5E4C]/5 flex items-center justify-center
                             hover:bg-[#6B5E4C]/10 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-[#6B5E4C]" />
                  </a>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#B5A48B]/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[#8C7E6A]">
              © {new Date().getFullYear()} Simple Interior Ideas. All rights reserved.
            </div>
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-xs text-[#8C7E6A] hover:text-[#6B5E4C] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
