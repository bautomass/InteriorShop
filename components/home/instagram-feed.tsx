// components/home/instagram-feed.tsx
'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import Link from 'next/link';

interface PostProps extends HTMLMotionProps<'div'> {
  post: {
    id: number;
    image: string;
    likes: number;
    caption: string;
    link: string;
  };
  index: number;
}

const PostCard = ({ post, index, ...props }: PostProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    {...props}
  >
    <Link
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full"
    >
      <img
        src={post.image}
        alt={post.caption}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="bg-primary-900/70 absolute inset-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-primary-50 text-sm">{post.caption}</p>
        <div className="text-primary-50 absolute bottom-4 left-4 flex items-center gap-1">
          <span>❤️</span>
          <span className="text-sm">{post.likes}</span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const posts = [
  {
    id: 1,
    image: '/api/placeholder/600/600',
    likes: 824,
    caption: 'Handcrafted oak dining set in its new home #JapandiStyle',
    link: 'https://instagram.com'
  },
  {
    id: 2,
    image: '/api/placeholder/600/600',
    likes: 1293,
    caption: 'Morning light in our studio #WabiSabi',
    link: 'https://instagram.com'
  },
  {
    id: 3,
    image: '/api/placeholder/600/600',
    likes: 947,
    caption: 'Latest ceramic collection fresh from the kiln',
    link: 'https://instagram.com'
  },
  {
    id: 4,
    image: '/api/placeholder/600/600',
    likes: 1106,
    caption: 'Behind the scenes with our master craftsmen',
    link: 'https://instagram.com'
  }
];

export function InstagramFeed() {
  return (
    <section className="bg-primary-50 dark:bg-primary-900 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex items-center justify-center gap-2">
          <Instagram className="text-primary-900 dark:text-primary-50 h-6 w-6" />
          <h2 className="text-primary-900 dark:text-primary-50 text-2xl font-light">@yourstore</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              className="bg-primary-200 dark:bg-primary-800 group relative aspect-square overflow-hidden"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
