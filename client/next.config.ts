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
  },
  
  // Experimental features
  experimental: {
    // Remove esmExternals to avoid warnings
  },
  
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_API_AVAILABLE: isGitHubPages ? 'false' : 'true',
  },
};

export default nextConfig;
