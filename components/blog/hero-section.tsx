// /components/blog/hero-section.tsx
export function BlogHero() {
    return (
      <div className="relative mb-12 text-center">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary-300 to-transparent dark:via-primary-700" />
        <div className="relative">
          <span className="mb-4 inline-block rounded-full bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-500">
            Our Blog
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-900 dark:text-primary-50 sm:text-5xl">
            Stories & Insights
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-600 dark:text-primary-300">
            Discover the latest trends, tips, and insights about modern living and design.
            Stay updated with our expert articles and guides.
          </p>
        </div>
      </div>
    );
  }