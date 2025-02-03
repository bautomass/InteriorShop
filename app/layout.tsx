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
import  LargeScreenNavBar  from '@/components/layout/navbar/LargeScreenNavBar';
import { Footer } from '@/components/layout/site-footer'; 
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);
  const menu = (await getMenu('next-js-frontend-header-menu')) as Menu[];

  return (
    <AuthProvider>
      <html lang="en" className={GeistSans.variable}>
        <head>
          <link 
            rel="preload" 
            href="https://cdn.shopify.com/s/files/1/0640/6868/1913/files/1_4a1ed1f2-1f28-465f-960a-8f58bcb22838.png?v=1738429093"
            as="image"
            data-fetchpriority="high"
            type="image/png"
          />
          <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://cdn.shopify.com" />
          
          <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        </head>
        <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
          <ThemeProvider>
            <QueryProvider>
              <CurrencyProvider>
                <CartProvider cartPromise={cartPromise}>
                  <LargeScreenNavBar />
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