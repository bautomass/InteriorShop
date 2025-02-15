import MobileHeader from '@/components/home/mobile-header-hero/MobileHeader';
import LargeScreenNavBar from '@/components/layout/navbar/LargeScreenNavBar';
import { Footer } from '@/components/layout/site-footer';
import { AuthProvider } from '@/providers/AuthProvider';
import { CurrencyProvider } from '@/providers/CurrencyProvider';
import { QueryProvider } from '@/providers/query-provider';
import { CartProvider } from 'components/cart/cart-context';
import { ThemeProvider } from 'components/theme-provider';
import { GeistSans } from 'geist/font/sans';
import { getCart, getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const SITE_NAME = process.env.SITE_NAME || 'Simple Interior Ideas';
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

// Optimized viewport settings
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Changed from 1 to 5 for better accessibility
  themeColor: '#6B5E4C', // Changed to your brand color
  colorScheme: 'light'
};

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  icons: {
    icon: '/images/favicon.svg',
  },
  description: 'Transform your space with our curated collection of minimalist, sustainable, and artisanal home furnishings. Discover pieces that blend modern aesthetics with mindful living.',
  keywords: 'modern interior design, sustainable furniture, minimalist home decor, contemporary living, artisanal furnishings, luxury home accessories, eco-friendly decor, scandinavian design, natural materials, premium home furnishings',
  robots: {
    index: true,
    follow: true,
    'max-snippet': 155,
    'max-image-preview': 'large',
    'max-video-preview': -1
  },
  alternates: {
    canonical: baseUrl
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630
    }]
  },
  twitter: {
    card: 'summary_large_image'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);
  const menu = (await getMenu('next-js-frontend-header-menu')) as Menu[];

  return (
    <AuthProvider>
      <html lang="en" className={GeistSans.variable}>
      <head>
          <link 
            rel="preload" 
            as="image" 
            href="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile-hero-image.webp?v=1736699557"
            type="image/webp"
            media="(max-width: 1023px)"
          />
          <link 
            rel="preload" 
            as="image" 
            href="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2_624ad208-26bc-4437-a2d2-857726a8a421.png?v=1738429094"
            type="image/png"
            media="(min-width: 1024px)"
          />
          <link 
            rel="preconnect" 
            href="https://cdn.shopify.com" 
            crossOrigin="anonymous" 
          />
          <link 
            rel="dns-prefetch" 
            href="https://cdn.shopify.com" 
          />
        </head>
        <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
          <ThemeProvider>
            <QueryProvider>
              <CurrencyProvider>
                <CartProvider cartPromise={cartPromise}>
                  <div className="hidden lg:block">
                    <LargeScreenNavBar />
                  </div>
                  <div className="lg:hidden">
                    <MobileHeader/>
                  </div>
                  <main>{children}</main>
                  <Footer />
                  <Toaster closeButton />
                </CartProvider>
              </CurrencyProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}














// import LargeScreenNavBar from '@/components/layout/navbar/LargeScreenNavBar';
// import MobileHeader from '@/components/home/mobile-header-hero/MobileHeader';
// import { Footer } from '@/components/layout/site-footer';
// import { AuthProvider } from '@/providers/AuthProvider';
// import { CurrencyProvider } from '@/providers/CurrencyProvider';
// import { QueryProvider } from '@/providers/query-provider';
// import { CartProvider } from 'components/cart/cart-context';
// import { ThemeProvider } from 'components/theme-provider';
// import { GeistSans } from 'geist/font/sans';
// import { getCart, getMenu } from 'lib/shopify';
// import { Menu } from 'lib/shopify/types';
// import { cookies } from 'next/headers';
// import { ReactNode } from 'react';
// import { Toaster } from 'sonner';
// import './globals.css';

// const SITE_NAME = process.env.SITE_NAME || 'Simple Interior Ideas';
// const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : 'http://localhost:3000';

// export const viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
//   themeColor: '#ffffff'
// };

// export const metadata = {
//   metadataBase: new URL(baseUrl),
//   title: {
//     default: SITE_NAME,
//     template: `%s | ${SITE_NAME}`
//   },
//   icons: {
//     icon: '/images/favicon.svg',
//   },
//   description: 'Transform your space with our curated collection of minimalist, sustainable, and artisanal home furnishings. Discover pieces that blend modern aesthetics with mindful living.',
//   keywords: 'modern interior design, sustainable furniture, minimalist home decor, contemporary living, artisanal furnishings, luxury home accessories, eco-friendly decor, scandinavian design, natural materials, premium home furnishings',
//   robots: {
//     index: true,
//     follow: true,
//     'max-snippet': 155,
//     'max-image-preview': 'large',
//     'max-video-preview': -1
//   },
//   alternates: {
//     canonical: baseUrl
//   },
//   openGraph: {
//     type: 'website',
//     siteName: SITE_NAME,
//     images: [{
//       url: '/og-image.jpg',
//       width: 1200,
//       height: 630
//     }]
//   },
//   twitter: {
//     card: 'summary_large_image'
//   }
// };

// export default async function RootLayout({ children }: { children: ReactNode }) {
//   const cookieStore = cookies();
//   const cartId = cookieStore.get('cartId')?.value;
//   const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);
//   const menu = (await getMenu('next-js-frontend-header-menu')) as Menu[];

//   return (
//     <AuthProvider>
//       <html lang="en" className={GeistSans.variable}>
//         <head>
//         <link 
//           rel="preload" 
//           as="image"
//           href="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile-hero-image.webp?v=1736699557"
//           type="image/webp"
//           media="(max-width: 1023px)"
//           data-fetchpriority="high"
//         />
//         <link 
//           rel="preload" 
//           as="image"
//           href="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2_624ad208-26bc-4437-a2d2-857726a8a421.png?v=1738429094"
//           type="image/png"
//           media="(min-width: 1024px)"
//           data-fetchpriority="high"
//         />
//         <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
//         <link rel="dns-prefetch" href="https://cdn.shopify.com" />
//       </head>
//         <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
//           <ThemeProvider>
//             <QueryProvider>
//               <CurrencyProvider>
//                 <CartProvider cartPromise={cartPromise}>
//                   <LargeScreenNavBar />
//                   <MobileHeader/>
//                   <main>{children}</main>
//                   <Footer />
//                   <Toaster closeButton />
//                 </CartProvider>
//               </CurrencyProvider>
//             </QueryProvider>
//           </ThemeProvider>
//         </body>
//       </html>
//     </AuthProvider>
//   );
// }