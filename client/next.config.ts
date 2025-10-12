import type { NextConfig } from "next";

// Determine if we're building for static GitHub Pages (only when explicitly set)
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

// Base path for GitHub Pages deployment
const basePath = isGitHubPages ? '/Sharothee-Wedding-arvinwedsincia' : '';

const nextConfig: NextConfig = {
  // Only enable static export for GitHub Pages deployment
  // For VPS/production deployment, we need server-side features (API routes, NextAuth)
  ...(isGitHubPages ? { output: 'export' as const } : {}),
  
  // Configure for GitHub Pages subdirectory deployment (only when needed)
  ...(isGitHubPages ? {
    basePath: basePath,
    assetPrefix: basePath,
    trailingSlash: true,
  } : {}),
  
  // Output directory
  distDir: '.next',
  
  // Optimize images - unoptimized only for static export
  images: {
    unoptimized: isGitHubPages,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_API_AVAILABLE: isGitHubPages ? 'false' : 'true',
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
