/**
 * Image Optimization Configuration for Next.js
 * 
 * This file documents the image optimization strategy for the wedding website.
 * Next.js Image component automatically handles most optimizations.
 * 
 * Configuration in next.config.ts:
 * - Formats: AVIF (preferred), WebP (fallback)
 * - Device sizes: 640, 750, 828, 1080, 1200, 1920, 2048, 3840
 * - Image sizes: 16, 32, 48, 64, 96, 128, 256, 384
 * - Cache TTL: 60 seconds minimum
 * - Remote patterns: Cloudinary support
 */

export const imageConfig = {
  // Recommended image dimensions for different use cases
  dimensions: {
    hero: { width: 1920, height: 1080 },
    eventCard: { width: 800, height: 600 },
    gallery: { width: 1200, height: 800 },
    thumbnail: { width: 400, height: 300 },
    avatar: { width: 200, height: 200 },
    ogImage: { width: 1200, height: 630 },
  },

  // Image quality settings
  quality: {
    default: 85,
    thumbnail: 75,
    hero: 90,
  },

  // Accepted formats
  formats: ['image/avif', 'image/webp', 'image/jpeg', 'image/png'],

  // Cloudinary transformations
  cloudinary: {
    quality: 'auto:good',
    fetchFormat: 'auto',
    flags: 'progressive',
  },
};

export default imageConfig;
