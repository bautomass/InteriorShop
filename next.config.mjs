//next.config.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
 enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
   unoptimized: true,
   formats: ['image/webp', 'image/avif'],
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
//  reactStrictMode: true
};

export default withBundleAnalyzer(nextConfig);