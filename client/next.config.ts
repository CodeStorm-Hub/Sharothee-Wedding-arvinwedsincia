import type { NextConfig } from "next";

// Determine if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';

// Base path for GitHub Pages deployment
const basePath = isGitHubPages ? '/Sharothee-Wedding-arvinwedsincia' : '';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages deployment
  output: 'export',
  
  // Configure for GitHub Pages subdirectory deployment
  basePath: basePath,
  assetPrefix: basePath,
  
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
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
