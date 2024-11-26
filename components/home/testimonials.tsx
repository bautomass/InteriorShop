// components/home/testimonials.tsx
'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Interior Designer at Studio Nordic',
    image: '/api/placeholder/100/100',
    content:
      "As a professional interior designer, I'm incredibly selective about sourcing furniture. The craftsmanship of their oak dining table exceeded my expectations. The natural grain patterns are stunning, and my clients constantly ask about it.",
    rating: 5,
    location: 'Copenhagen, Denmark',
    purchasedItem: 'Handcrafted Oak Dining Table'
  },
  {
    id: 2,
    name: 'James Wright',
    role: 'Architect',
    image: '/api/placeholder/100/100',
    content:
      "The ceramic vases I ordered have this beautiful, imperfect quality that perfectly embodies wabi-sabi aesthetics. Each piece tells a story through its unique glaze patterns. They've become focal points in my latest residential project.",
    rating: 5,
    location: 'Stockholm, Sweden',
    purchasedItem: 'Artisan Ceramic Collection'
  },
  {
    id: 3,
    name: 'Yuki Tanaka',
    role: 'Home Owner',
    image: '/api/placeholder/100/100',
    content:
      'After renovating our home, we wanted furniture that balanced minimalism with warmth. The linen sofa we purchased is incredibly comfortable and the natural fabric has developed such a beautiful patina over the past year.',
    rating: 5,
    location: 'Kyoto, Japan',
    purchasedItem: 'Natural Linen Sofa'
  }
];

export function Testimonials() {
  return (
    <section className="bg-primary-100 dark:bg-primary-800 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary-900 dark:text-primary-50 mb-16 text-center text-3xl font-light"
        >
          Client Stories
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary-50 dark:bg-primary-900 rounded-lg p-8"
            >
              <div className="mb-6 flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-primary-900 dark:text-primary-50 font-medium">
                    {review.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-300 text-sm">{review.role}</p>
                </div>
              </div>

              <div className="mb-4 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="fill-accent-500 text-accent-500 h-4 w-4" />
                ))}
              </div>

              <p className="text-primary-700 dark:text-primary-200 mb-4">{review.content}</p>

              <div className="text-primary-600 dark:text-primary-400 text-sm">
                <p className="font-medium">Purchased: {review.purchasedItem}</p>
                <p>{review.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
