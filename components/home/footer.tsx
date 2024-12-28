"use client"

import {
    ArrowRight,
    Facebook,
    Headphones as HeadphonesIcon,
    Instagram,
    Linkedin,
    Lock as LockIcon,
    Mail,
    MapPin,
    RefreshCcw as RefreshCcwIcon,
    Star as StarIcon,
    Twitter
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const mainLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'Living Room', href: '/category/living-room' },
        { name: 'Dining Room', href: '/category/dining-room' },
        { name: 'Bedroom', href: '/category/bedroom' },
        { name: 'Outdoor', href: '/category/outdoor' },
      ]
    },
    {
      title: 'Collections',
      links: [
        { name: 'Japandi Style', href: '/collections/japandi' },
        { name: 'Minimalist Living', href: '/collections/minimalist' },
        { name: 'Artisan Crafted', href: '/collections/artisan' },
        { name: 'Sustainable Series', href: '/collections/sustainable' },
        { name: 'Limited Editions', href: '/collections/limited' },
      ]
    },
    {
      title: 'Customer Care',
      links: [
        { name: 'Track Order', href: '/track-order' },
        { name: 'Shipping & Returns', href: '/shipping-returns' },
        { name: 'Care Instructions', href: '/care-instructions' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact Us', href: '/contact' },
      ]
    },
    {
      title: 'About',
      links: [
        { name: 'Our Story', href: '/about' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Artisans', href: '/artisans' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com' },
    { icon: <Facebook className="h-5 w-5" />, href: 'https://facebook.com' },
    { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com' },
  ];

  const trustElements = [
    { 
      title: "Secure Shopping",
      description: "Protected by industry-leading encryption",
      icon: <LockIcon className="h-6 w-6" />,
      ariaLabel: "Security feature"
    },
    {
      title: "Trusted by Thousands",
      description: "Join our 10,000+ happy customers",
      icon: <StarIcon className="h-6 w-6" />,
      ariaLabel: "Customer satisfaction"
    },
    {
      title: "Hassle-free Returns",
      description: "30-day satisfaction guarantee",
      icon: <RefreshCcwIcon className="h-6 w-6" />,
      ariaLabel: "Returns policy"
    },
    {
      title: "24/7 Design Support",
      description: "Expert guidance always available",
      icon: <HeadphonesIcon className="h-6 w-6" />,
      ariaLabel: "Customer support"
    }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-950" role="contentinfo">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100 dark:bg-primary-800 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[40rem] w-[40rem] translate-x-1/2 translate-y-1/2 rounded-full bg-primary-100 dark:bg-primary-800 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16">
        {/* Trust Indicators Section */}
        <div className="mb-16 grid gap-8 border-b border-primary-200/50 pb-16 dark:border-primary-700/50 sm:grid-cols-2 lg:grid-cols-4">
          {trustElements.map((element, index) => (
            <div
              key={index}
              className="group relative flex items-start space-x-4 rounded-xl p-4 transition-all hover:bg-white/50 dark:hover:bg-primary-800/50"
            >
              <div 
                className="rounded-full bg-primary-100 p-3 text-primary-900 shadow-sm transition-transform group-hover:scale-110 dark:bg-primary-800 dark:text-primary-100"
                aria-hidden="true"
              >
                {element.icon}
              </div>
              <div>
                <h3 className="font-medium text-primary-900 dark:text-primary-50">
                  {element.title}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-300">
                  {element.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Brand Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-primary-900 dark:text-primary-50">
                Simple Interior Ideas
              </h2>
              <p className="mt-4 max-w-md text-lg text-primary-600 dark:text-primary-300">
                Transforming spaces into harmonious sanctuaries through thoughtful design and sustainable solutions.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-600 dark:text-primary-300">
                <MapPin className="h-5 w-5" aria-hidden="true" />
                <span>Rīga, Latvia</span>
              </div>
              <div className="flex items-center gap-3 text-primary-600 dark:text-primary-300">
                <Mail className="h-5 w-5" aria-hidden="true" />
                <a 
                  href="mailto:info@simpleinteriorideas.com"
                  className="transition-colors hover:text-accent-500 hover:underline dark:hover:text-accent-400"
                >
                  info@simpleinteriorideas.com
                </a>
              </div>
            </div>
          </div>

          {/* Links Grid - Fixed alignment */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
            {mainLinks.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-primary-900 dark:text-primary-50">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-sm text-primary-600 transition-colors hover:text-accent-500 dark:text-primary-300 dark:hover:text-accent-400"
                      >
                        <ArrowRight 
                          className="mr-2 h-4 w-4 opacity-0 transition-transform group-hover:translate-x-1 group-hover:opacity-100" 
                          aria-hidden="true"
                        />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-primary-200/50 py-8 dark:border-primary-700/50">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Social Links */}
            <nav 
              className="flex items-center gap-6"
              aria-label="Social media links"
            >
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 transition-colors hover:text-accent-500 dark:text-primary-500 dark:hover:text-accent-400"
                  aria-label={`Visit our ${social.href.split('.com')[0].split('//')[1]} page`}
                >
                  {social.icon}
                </a>
              ))}
            </nav>
            
            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-600 dark:text-primary-300">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text) => (
                <Link
                  key={text}
                  href={`/${text.toLowerCase().replace(/\s+/g, '-')}`}
                  className="transition-colors hover:text-accent-500 dark:hover:text-accent-400"
                >
                  {text}
                </Link>
              ))}
              <span>© {new Date().getFullYear()} Simple Interior Ideas. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;