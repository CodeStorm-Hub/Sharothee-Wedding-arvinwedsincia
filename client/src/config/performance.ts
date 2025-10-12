/**
 * Web Vitals Configuration and Reporting
 * 
 * This file provides configuration for monitoring Core Web Vitals
 * and other performance metrics in production.
 * 
 * Already integrated:
 * - @vercel/speed-insights (automatic RUM)
 * - @vercel/analytics (page views and custom events)
 * 
 * Usage in layout.tsx:
 * import { SpeedInsights } from '@vercel/speed-insights/next';
 * import { Analytics } from '@vercel/analytics/react';
 */

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

// Core Web Vitals thresholds (in milliseconds)
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // First Input Delay
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // Cumulative Layout Shift
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  // Interaction to Next Paint
  INP: {
    good: 200,
    needsImprovement: 500,
  },
};

/**
 * Custom Web Vitals reporter
 * This can be used in _app.tsx or layout.tsx
 * 
 * Example:
 * export function reportWebVitals(metric: WebVitalsMetric) {
 *   console.log(metric);
 *   // Send to analytics service
 * }
 */
export function getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Performance Budget Configuration
 * Used for build-time and runtime monitoring
 */
export const PERFORMANCE_BUDGETS = {
  // JavaScript bundle sizes (in KB)
  javascript: {
    initial: 170, // First Load JS
    total: 300,
  },
  
  // CSS bundle sizes (in KB)
  css: {
    initial: 50,
    total: 100,
  },
  
  // Image sizes (in KB)
  images: {
    thumbnail: 50,
    medium: 200,
    large: 500,
  },
  
  // API response times (in ms)
  api: {
    fast: 200,
    acceptable: 500,
    slow: 1000,
  },
};

/**
 * Performance Monitoring Integration
 * Already configured in the application:
 * 
 * 1. Vercel Analytics (@vercel/analytics)
 *    - Automatic page view tracking
 *    - Custom event tracking
 *    - User journey analytics
 * 
 * 2. Vercel Speed Insights (@vercel/speed-insights)
 *    - Real User Monitoring (RUM)
 *    - Core Web Vitals tracking
 *    - Performance scores
 *    - Geographic distribution
 * 
 * 3. Lighthouse CI (lighthouserc.json)
 *    - Automated performance audits
 *    - CI/CD integration
 *    - Performance budgets
 *    - Score thresholds
 */

const performanceConfig = {
  WEB_VITALS_THRESHOLDS,
  PERFORMANCE_BUDGETS,
  getMetricRating,
};

export default performanceConfig;
