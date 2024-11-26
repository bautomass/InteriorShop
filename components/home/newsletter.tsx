// components/home/newsletter.tsx
'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // TODO: Implement your newsletter signup logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="bg-accent-50 dark:bg-accent-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-primary-900 dark:text-primary-50 text-3xl font-medium">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-primary-600 dark:text-primary-300 mt-4">
            Stay updated with our latest collections and design inspirations.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 justify-center sm:flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-primary-300 text-primary-900 placeholder-primary-500 focus:border-accent-500 focus:ring-accent-500 dark:border-primary-600 dark:bg-primary-900 dark:text-primary-50 dark:placeholder-primary-400 w-full rounded-lg border bg-white px-4 py-3 focus:outline-none focus:ring-2 sm:max-w-xs"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-accent-600 hover:bg-accent-700 focus:ring-accent-500 mt-3 w-full rounded-lg px-6 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 sm:ml-3 sm:mt-0 sm:w-auto"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && (
            <p className="text-accent-600 dark:text-accent-400 mt-4">Thank you for subscribing!</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-600">An error occurred. Please try again.</p>
          )}
        </div>
      </div>
    </section>
  );
}
