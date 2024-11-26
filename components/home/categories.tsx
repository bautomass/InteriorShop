// components/home/categories.tsx
import Link from 'next/link';

const categories = [
  {
    title: 'Living Room',
    image: '/api/placeholder/600/400',
    description: 'Minimalist seating and accent pieces',
    url: '/search/living-room'
  },
  {
    title: 'Dining',
    image: '/api/placeholder/600/400',
    description: 'Handcrafted tables and chairs',
    url: '/search/dining'
  },
  {
    title: 'Bedroom',
    image: '/api/placeholder/600/400',
    description: 'Natural textures and tones',
    url: '/search/bedroom'
  },
  {
    title: 'Decor',
    image: '/api/placeholder/600/400',
    description: 'Artisanal ceramics and textiles',
    url: '/search/decor'
  }
];

export function Categories() {
  return (
    <section className="bg-primary-50 dark:bg-primary-900 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-primary-900 dark:text-primary-50 mb-12 text-center text-3xl font-light">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.url}
              className="bg-primary-100 dark:bg-primary-800 group relative overflow-hidden rounded-lg"
            >
              <div className="relative aspect-[4/5]">
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="from-primary-900/70 absolute inset-0 bg-gradient-to-t to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-primary-50 text-xl font-medium">{category.title}</h3>
                  <p className="text-primary-200 mt-2 text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
