/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // This will disable image optimization
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/assets/**'
      }
    ]
  },
  transpilePackages: ['framer-motion'],
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;