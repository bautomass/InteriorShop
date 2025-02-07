// 'use client';

// import CartModal from 'components/cart/modal';
// import { motion } from 'framer-motion';
// import { Menu } from 'lib/shopify/types';
// import Link from 'next/link';
// import { Suspense } from 'react';
// import LogoSquare from '../../../components/logo-square';
// import ThemeToggle from '../../theme-toggle';
// import MobileMenu from './mobile-menu';
// import Search, { SearchSkeleton } from './search';
// import { TopHeader } from './top-header';

// interface NavbarProps {
//   menu: Menu[];
// }

// export function Navbar({ menu = [] }: NavbarProps) {
//   return (
//     <>
//       <TopHeader />
//       <motion.nav
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className="bg-primary-50/80 after:via-primary-200/80 dark:bg-primary-900/80 dark:after:via-primary-700/50 sticky top-0 z-50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] backdrop-blur-lg after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:to-transparent dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)]"
//       >
//         <div className="mx-auto max-w-[90vw] px-4 py-4">
//           <div className="flex items-center justify-between gap-8">
//             <div className="flex items-center gap-8">
//               <Link
//                 href="/"
//                 className="flex items-center gap-3 transition-opacity hover:opacity-90"
//                 aria-label="Home"
//               >
//                 <LogoSquare />
//                 <span className="text-primary-900 dark:text-primary-50 text-lg font-medium">
//                   {process.env.NEXT_PUBLIC_SITE_NAME}
//                 </span>
//               </Link>

//               {menu.length ? (
//                 <div className="hidden lg:block">
//                   <ul className="flex gap-8" role="navigation">
//                     {menu.map((item: Menu) => (
//                       <li key={item.title}>
//                         <Link
//                           href={item.path}
//                           className="text-primary-700 hover:text-primary-900 dark:text-primary-300 dark:hover:text-primary-50 group relative font-medium transition-all duration-300 ease-out"
//                         >
//                           <span className="relative">
//                             {item.title}
//                             <span className="bg-accent-500/80 absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 ease-out group-hover:w-full" />
//                           </span>
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : null}
//             </div>

//             <div className="flex items-center gap-6">
//               <div className="hidden lg:block">
//                 <Suspense fallback={<SearchSkeleton />}>
//                   <Search />
//                 </Suspense>
//               </div>

//               <div className="flex items-center gap-4">
//                 <ThemeToggle />
//                 <div className="bg-primary-200/80 dark:bg-primary-700/50 h-6 w-px" />
//                 <CartModal />
//               </div>

//               <div className="block lg:hidden">
//                 <Suspense fallback={null}>
//                   <MobileMenu menu={menu} />
//                 </Suspense>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.nav>
//     </>
//   );
// }

// export default Navbar;
