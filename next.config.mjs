import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', '@headlessui/react']
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize framer-motion - Updated path
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Updated framer-motion path to use the ESM bundle
        'framer-motion': 'framer-motion/dist/es/index.mjs',
      }
    }

    // Optimize large modules
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              reuseExistingChunk: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                if (!module.context) return 'npm.vendor';
                
                const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                const packageName = match ? match[1] : 'vendor';
                return `npm.${packageName.replace('@', '')}`;
              },
              chunks: 'all',
              priority: 1,
            },
          },
        },
      };
    }

    return config;
  },
  transpilePackages: ['framer-motion'],
  poweredByHeader: false,
  reactStrictMode: true,
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
//     unoptimized: false,  // This will disable image optimization
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