/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Link',
            value: '<https://cdn.shopify.com>; rel=preconnect; crossorigin, <https://cdn.shopify.com>; rel=dns-prefetch'
          }
        ]
      }
    ];
  },
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lodash']
  }
};

export default nextConfig;















// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     unoptimized: true,  // This will disable image optimization
//     formats: ['image/avif', 'image/webp'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'cdn.shopify.com',
//         pathname: '/s/files/**'
//       },
//       {
//         protocol: 'https',
//         hostname: 'cdn.shopify.com',
//         pathname: '/assets/**'
//       }
//     ]
//   },
//   transpilePackages: ['framer-motion'],
//   poweredByHeader: false,
//   reactStrictMode: true
// };

// export default nextConfig;