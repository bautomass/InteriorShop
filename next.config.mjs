import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
  webpack: (config) => {
    config.externals = [...(config.externals || []), {
      'react': 'React',
      'react-dom': 'ReactDOM'
    }];
    return config;
  }
};

export default withBundleAnalyzer(nextConfig);








// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

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

// export default withBundleAnalyzer(nextConfig);









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