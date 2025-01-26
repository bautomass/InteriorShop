// app/page.tsx
import AboutHero from '@/components/home/about-hero';
import AnturamStoolsCollection from '@/components/home/AnturamStoolsCollection';
import CanvasCollection from '@/components/home/CanvasCollection';
import CeramicVaseSection from '@/components/home/CeramicVaseSection';
import InfiniteProductBanner from '@/components/home/InfiniteProductBanner';
import InteriorTipsSection from '@/components/home/InteriorTipsSection';
import MaterialsStorySection from '@/components/home/MaterialsStorySection';
import NewArrivalsCollection from '@/components/home/NewArrivalsCollection';
import PendantLightSection from '@/components/home/PendantLightSection';
import { Footer } from '@/components/layout/site-footer';
import BackToTop from 'components/home/BackToTop';
import Hero from 'components/home/hero';
import LampsCollection from 'components/home/LampsCollection';
import WishboneChairSection from 'components/home/WishboneChairSection';
import LargeScreenNavBar from 'components/layout/navbar/LargeScreenNavBar';
import type { Metadata } from 'next';
import BlogSection from '@/components/home/BlogSection';
import InstagramBanner from '@/components/home/InstagramBanner';
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
      <LargeScreenNavBar />
      <Hero />
      <AboutHero />
      <div className="space-y-8 md:space-y-16">
        <PendantLightSection />
        <InfiniteProductBanner/>
        <LampsCollection />
        <MaterialsStorySection />
        <NewArrivalsCollection />
        <AnturamStoolsCollection />
        <CanvasCollection />
        <BlogSection />
        <CeramicVaseSection />
        <WishboneChairSection/>
        <InteriorTipsSection/>
        <InstagramBanner/>
        <Footer/>
        <BackToTop />
      </div>
    </>
  );
}