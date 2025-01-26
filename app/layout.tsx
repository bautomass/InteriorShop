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
          <script crossOrigin="" src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" />
          <script crossOrigin="" src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" />
        </head>
        <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
          <ThemeProvider>
            <QueryProvider>
              <CurrencyProvider>
                <CartProvider cartPromise={cartPromise}>
                  <main>{children}</main>
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
//     <AuthProvider>
//       <html lang="en" className={GeistSans.variable}>
//         <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
//           <ThemeProvider>
//             <QueryProvider>
//               <CurrencyProvider>
//                 <CartProvider cartPromise={cartPromise}>
//                   <main>{children}</main>
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




















// // // app/layout.tsx
// // import { QueryProvider } from '@/providers/query-provider';
// // import { CartProvider } from 'components/cart/cart-context';
// // import { ThemeProvider } from 'components/theme-provider';
// // import { GeistSans } from 'geist/font/sans';
// // import { getCart, getMenu } from 'lib/shopify';
// // import { Menu } from 'lib/shopify/types';
// // import { cookies } from 'next/headers';
// // import { ReactNode } from 'react';
// // import { Toaster } from 'sonner';
// // import './globals.css';

// // const { SITE_NAME } = process.env;
// // const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
// //   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
// //   : 'http://localhost:3000';

// // export const metadata = {
// //   metadataBase: new URL(baseUrl),
// //   title: {
// //     default: SITE_NAME!,
// //     template: `%s | ${SITE_NAME}`
// //   },
// //   robots: {
// //     follow: true,
// //     index: true
// //   }
// // };

// // export default async function RootLayout({ children }: { children: ReactNode }) {
// //   const cartId = (await cookies()).get('cartId')?.value;
// //   const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);
// //   const menu = (await getMenu('next-js-frontend-header-menu')) as Menu[];

// //   return (
// //     <html lang="en" className={GeistSans.variable}>
// //       <body className="bg-primary-50 text-primary-900 selection:bg-accent-200">
// //         <ThemeProvider>
// //           <QueryProvider>
// //             <CartProvider cartPromise={cartPromise}>
// //               <main>{children}</main>
// //               <Toaster closeButton />
// //             </CartProvider>
// //           </QueryProvider>
// //         </ThemeProvider>
// //       </body>
// //     </html>
// //   );
// // }
