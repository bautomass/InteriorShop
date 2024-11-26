// app/page.tsx
import Carousel from 'components/carousel';
import ThreeItemGrid from 'components/grid/three-items';
import { Categories } from 'components/home/categories';
import { DesignShowcase } from 'components/home/design-showcase';
import FeaturedCollection from 'components/home/featured-collection';
import { Hero } from 'components/home/hero';
import { InstagramFeed } from 'components/home/instagram-feed';
import { MaterialStory } from 'components/home/material-story';
import { Newsletter } from 'components/home/newsletter';
import { Testimonials } from 'components/home/testimonials';
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
      <Hero />
      <div className="space-y-8 md:space-y-16">
        {/* @ts-expect-error Async Server Component */}
        <ThreeItemGrid />
        <MaterialStory />
        {/* @ts-expect-error Async Server Component */}
        <FeaturedCollection />
        <DesignShowcase />
        <Categories />
        {/* @ts-expect-error Async Server Component */}
        <Carousel />
        <Testimonials />
        <InstagramFeed />
        <Newsletter />
      </div>
    </>
  );
}

// import Carousel from 'components/carousel';
// import ThreeItemGrid from 'components/grid/three-items';
// import FeaturedCollection from 'components/home/featured-collection';
// import { Newsletter } from 'components/home/newsletter';
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
//     <div className="space-y-8">
//       {/* @ts-expect-error Async Server Component */}
//       <ThreeItemGrid />
//       {/* @ts-expect-error Async Server Component */}
//       <FeaturedCollection />
//       {/* @ts-expect-error Async Server Component */}
//       <Carousel />
//       <Newsletter />
//     </div>
//   );
// }
