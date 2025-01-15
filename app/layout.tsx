// app/layout.tsx
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

const { SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

// Add viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);
  const menu = (await getMenu('next-js-frontend-header-menu')) as Menu[];

  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        {/* Preload critical hero image with high priority */}
        <link
          rel="preload"
          as="image"
          href="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/mobile-hero-image.webp?v=1736699557"
          type="image/webp"
          media="(max-width: 1024px)"
        />
        
        {/* Preconnect to Shopify CDN */}
        <link 
          rel="preconnect" 
          href="https://cdn.shopify.com"
          crossOrigin="anonymous"
        />
        <link 
          rel="dns-prefetch" 
          href="https://cdn.shopify.com"
        />

        {/* Add base styles for image fade-in */}
        <style dangerouslySetInnerHTML={{ 
          __html: `
            img {
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
            }
            img.opacity-100 {
              opacity: 1;
            }
            .mobile-hero-placeholder {
              background-color: #f5f5f5;
              min-height: 100vh;
            }
          ` 
        }} />
      </head>
      <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
        <ThemeProvider>
          <QueryProvider>
            <CartProvider cartPromise={cartPromise}>
              <main>{children}</main>
              <Toaster closeButton />
            </CartProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}













// // app/layout.tsx
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

// const { SITE_NAME } = process.env;
// const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : 'http://localhost:3000';

// export const metadata = {
//   metadataBase: new URL(baseUrl),
//   title: {
//     default: SITE_NAME!,
//     template: `%s | ${SITE_NAME}`
//   },
//   robots: {
//     follow: true,
//     index: true
//   }
// };

// export default async function RootLayout({ children }: { children: ReactNode }) {
//   const cartId = (await cookies()).get('cartId')?.value;
//   const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);
//   const menu = (await getMenu('next-js-frontend-header-menu')) as Menu[];

//   return (
//     <html lang="en" className={GeistSans.variable}>
//       <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
//         <ThemeProvider>
//           <QueryProvider>
//             <CartProvider cartPromise={cartPromise}>
//               <main>{children}</main>
//               <Toaster closeButton />
//             </CartProvider>
//           </QueryProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
