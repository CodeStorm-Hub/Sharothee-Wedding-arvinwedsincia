import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages deployment
  output: 'export',
  
  // Configure for GitHub Pages subdirectory deployment
  basePath: process.env.NODE_ENV === 'production' ? '/Sharothee-Wedding-arvinwedsincia' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Sharothee-Wedding-arvinwedsincia' : '',
  
  // Add trailing slash for GitHub Pages compatibility
  trailingSlash: true,
  
  // Output directory for static export
  distDir: '.next',
  
  // Optimize images - unoptimized for static export
  images: {
    unoptimized: true,
  },
  
  // Experimental features
  experimental: {
    // Remove esmExternals to avoid warnings
  },
};

export default nextConfig;
