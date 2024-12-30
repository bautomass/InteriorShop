// app/page.tsx
import AboutHero from '@/components/home/about-hero';
import AnturamStoolsCollection from '@/components/home/AnturamStoolsCollection';
import CanvasCollection from '@/components/home/CanvasCollection';
import CeramicVaseSection from '@/components/home/CeramicVaseSection';
import { GiftBuilderSection } from '@/components/home/gift-builder-section';
import InfiniteProductBanner from '@/components/home/InfiniteProductBanner';
import NewArrivalsCollection from '@/components/home/NewArrivalsCollection';
import PendantLightSection from '@/components/home/PendantLightSection';
// import SaleProductsSection from '@/components/home/SaleProductsSection';
import { Footer } from '@/components/layout/site-footer';
import Hero from 'components/home/hero';
import LampsCollection from 'components/home/LampsCollection';
import WishboneChairSection from 'components/home/WishboneChairSection';
import { TopHeader } from 'components/layout/navbar/top-header';

import InteriorTipsSection from '@/components/home/InteriorTipsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modern Interior Design & Home Decor',
  description:
    'Discover our curated collection of Japandi and Wabi-Sabi inspired furniture and home decor.',
  openGraph: {
    type: 'website',
    title: 'Modern Interior Design & Home Decor',
    description:
      'Discover our curated collection of Japandi and Wabi-Sabi inspired furniture and home decor.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern Interior Design'
      }
    ]
  }
};

export default function HomePage() {
  return (
    <>
      <TopHeader />
      <Hero />
      <AboutHero />
      <div className="space-y-8 md:space-y-16">
        <PendantLightSection />
        <InfiniteProductBanner/>
        <LampsCollection />
        <GiftBuilderSection />
        <NewArrivalsCollection />
        <AnturamStoolsCollection />
        <CanvasCollection />
        <CeramicVaseSection />
        <WishboneChairSection/>
        <InteriorTipsSection/>
        {/* <SaleProductsSection/> */}
        <Footer/>
      </div>
    </>
  );
}









// // app/page.tsx
// // import DesignConsultation from '@/components/home/DesignConsultation';
// // import FurnitureCollection from 'components/home/FurnitureCollection';
// // import WishboneChairSection from 'components/home/WishboneChairSection';

// // import SeasonalRhythm from '@/components/home/SeasonalRhythm';
// import AboutHero from '@/components/home/about-hero';
// import { GiftBuilderSection } from '@/components/home/gift-builder-section';
// import PendantLightSection from '@/components/home/PendantLightSection';
// import Hero from 'components/home/hero';
// import LampsCollection from 'components/home/LampsCollection';
// import { TopHeader } from 'components/layout/navbar/top-header';
// // import { InfiniteImageBanner } from '@/components/shared/InfiniteImageBanner';
// // import StoolsCollection from 'components/home/StoolsCollection';



// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Modern Interior Design & Home Decor',
//   description:
//     'Discover our curated collection of Japandi and Wabi-Sabi inspired furniture and home decor.',
//   openGraph: {
//     type: 'website',
//     title: 'Modern Interior Design & Home Decor',
//     description:
//       'Discover our curated collection of Japandi and Wabi-Sabi inspired furniture and home decor.',
//     images: [
//       {
//         url: '/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Modern Interior Design'
//       }
//     ]
//   }
// };

// export default function HomePage() {
//   return (
//     <>
//     <TopHeader/>
//       <Hero />
//     <AboutHero/>
//       <div className="space-y-8 md:space-y-16">
//       {/* <StoolsCollection /> */}
//         {/* <MaterialStory /> */}
//         <PendantLightSection />
//         {/* <InfiniteImageBanner /> */}
//         <LampsCollection />
//         <GiftBuilderSection />
//         {/* <FurnitureCollection/> */}
//         {/* <WishboneChairSection/> */}
//         {/* <DesignShowcase /> */}
//         {/* <DesignConsultation/> */}
//         {/* <Categories /> */}
//         {/* <CraftStory /> */}
//         {/* <SeasonalRhythm /> */}
//         {/* <MaterialExperience /> */}
//         {/* <Testimonials /> */}
//         {/* <InstagramFeed /> */}
//         {/* <Footer /> */}
//       </div>
//     </>
//   );
// }

