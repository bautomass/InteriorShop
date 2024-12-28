import { QueryProvider } from '@/providers/query-provider';
import { CartProvider } from 'components/cart/cart-context';
import { ThemeProvider } from 'components/theme-provider';
import { WelcomeToast } from 'components/welcome-toast';
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
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-primary-50 text-primary-900 selection:bg-accent-200 dark:bg-primary-900 dark:text-primary-50 dark:selection:bg-accent-700">
        <ThemeProvider>
          <QueryProvider>
            <CartProvider cartPromise={cartPromise}>
              <main>
                {children}
                <Toaster closeButton />
                <WelcomeToast />
              </main>
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
// // import { Navbar } from 'components/layout/navbar';
// import { ThemeProvider } from 'components/theme-provider';
// import { WelcomeToast } from 'components/welcome-toast';
// import { GeistSans } from 'geist/font/sans';
// import { getCart, getMenu } from 'lib/shopify';
// import { Menu } from 'lib/shopify/types';
// import { ensureStartsWith } from 'lib/utils';
// import { cookies } from 'next/headers';
// import { ReactNode } from 'react';
// import { Toaster } from 'sonner';
// import './globals.css';

// const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
// const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : 'http://localhost:3000';
// const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
// const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

// export const metadata = {
//   metadataBase: new URL(baseUrl),
//   title: {
//     default: SITE_NAME!,
//     template: `%s | ${SITE_NAME}`
//   },
//   robots: {
//     follow: true,
//     index: true
//   },
//   ...(twitterCreator &&
//     twitterSite && {
//       twitter: {
//         card: 'summary_large_image',
//         creator: twitterCreator,
//         site: twitterSite
//       }
//     })
// };

// export default async function RootLayout({ children }: { children: ReactNode }) {
//   const cartId = (await cookies()).get('cartId')?.value;
//   const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);
//   const menu = (await getMenu('next-js-frontend-header-menu')) as Menu[];

//   return (
//     <html lang="en" className={GeistSans.variable}>
//       <body className="bg-primary-50 text-primary-900 selection:bg-accent-200 dark:bg-primary-900 dark:text-primary-50 dark:selection:bg-accent-700">
//         <ThemeProvider>
//           <QueryProvider>
//             <CartProvider cartPromise={cartPromise}>
//               {/* <Navbar menu={menu} /> */}
//               <main>
//                 {children}
//                 <Toaster closeButton />
//                 <WelcomeToast />
//               </main>
//             </CartProvider>
//           </QueryProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }










// // // app/layout.tsx
// // import { QueryProvider } from '@/providers/query-provider';
// // import { CartProvider } from 'components/cart/cart-context';
// // import { ThemeProvider } from 'components/theme-provider';
// // import { WelcomeToast } from 'components/welcome-toast';
// // import { GeistSans } from 'geist/font/sans';
// // import { getCart } from 'lib/shopify';
// // import { ensureStartsWith } from 'lib/utils';
// // import { cookies } from 'next/headers';
// // import { ReactNode } from 'react';
// // import { Toaster } from 'sonner';
// // import './globals.css';

// // const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
// // const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
// //   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
// //   : 'http://localhost:3000';
// // const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
// // const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

// // export const metadata = {
// //   metadataBase: new URL(baseUrl),
// //   title: {
// //     default: SITE_NAME!,
// //     template: `%s | ${SITE_NAME}`
// //   },
// //   robots: {
// //     follow: true,
// //     index: true
// //   },
// //   ...(twitterCreator &&
// //     twitterSite && {
// //       twitter: {
// //         card: 'summary_large_image',
// //         creator: twitterCreator,
// //         site: twitterSite
// //       }
// //     })
// // };

// // export default async function RootLayout({ children }: { children: ReactNode }) {
// //   const cartId = cookies().get('cartId')?.value;
// //   const cartPromise = cartId ? getCart(cartId) : Promise.resolve(undefined);

// //   return (
// //     <html lang="en" className={GeistSans.variable}>
// //       <body>
// //         <ThemeProvider>
// //           <QueryProvider>
// //             <CartProvider cartPromise={cartPromise}>
// //               <main>
// //                 {children}
// //                 <Toaster closeButton />
// //                 <WelcomeToast />
// //               </main>
// //             </CartProvider>
// //           </QueryProvider>
// //         </ThemeProvider>
// //       </body>
// //     </html>
// //   );
// // }