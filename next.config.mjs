/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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

// export default {
//   images: {
//     formats: ['image/avif', 'image/webp'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'cdn.shopify.com',
//         pathname: '/s/files/**'
//       }
//     ]
//   },
//   transpilePackages: ['framer-motion']
// };
