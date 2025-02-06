'use client';

export function BlogHero() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="relative mx-auto max-w-3xl text-center">
        {/* Tag */}
        <span className="mb-8 inline-block rounded-full bg-accent-500/10 px-5 py-2 text-sm font-medium text-accent-500">
          Our Blog
        </span>

        {/* Heading */}
        <h1 className="mb-8 bg-gradient-to-b from-primary-900 to-primary-800 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-primary-50 dark:to-primary-200 sm:text-7xl">
          Stories & Insights
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-600 dark:text-primary-300">
          Discover the latest trends, tips, and insights about modern living and design.
          <span className="block mt-2 text-primary-500 dark:text-primary-400">
            Stay updated with our expert articles and guides.
          </span>
        </p>

        {/* Simple Lines */}
        <div className="absolute left-0 right-0 top-2/3 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent dark:via-primary-800" />
      </div>
    </div>
  );
}