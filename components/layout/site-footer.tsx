'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

const footerLinks = {
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

export function Footer() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <footer ref={ref} className="bg-[#FAF7F2] border-t border-[#B5A48B]/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="block mb-6">
              <span className="text-[#6B5E4C] text-xl font-medium">
                Simple Interior Ideas
              </span>
            </Link>
            <p className="text-[#8C7E6A] text-sm mb-6 max-w-md">
              Crafting sustainable and beautiful pieces for your home. Every product tells a story of artisanal craftsmanship and environmental consciousness.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#8C7E6A]">
                <MapPin className="w-4 h-4 text-[#B5A48B]" />
                <span>Brivibas Street 432, Riga, LV-1040</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8C7E6A]">
                <Mail className="w-4 h-4 text-[#B5A48B]" />
                <span>info@simpleinteriors.com</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
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

        {/* Newsletter & Social */}
        <div className="py-8 border-t border-[#B5A48B]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-[#6B5E4C] font-medium mb-2">Stay Updated</h3>
              <p className="text-sm text-[#8C7E6A] mb-4">
                Subscribe to our newsletter for exclusive offers and updates.
              </p>
              <form className="flex gap-2">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex justify-start md:justify-end items-center gap-4"
            >
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