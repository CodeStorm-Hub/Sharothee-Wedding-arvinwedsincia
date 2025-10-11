import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRSVPToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < array.length; i++) {
    result += characters.charAt(array[i] % characters.length);
  }
  return result;
}

export function generateSecureToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(array[i] % characters.length);
  }
  return result;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Hotel amenities serialization
export function serializeAmenities(amenities: string[] | string | undefined): string | null {
  if (!amenities) return null;
  if (typeof amenities === 'string') {
    return amenities;
  }
  return Array.isArray(amenities) ? amenities.join(',') : null;
}

export function deserializeAmenities(amenities: string | null): string[] {
  if (!amenities) return [];
  return amenities.split(',').filter(Boolean).map(item => item.trim());
}

// Date formatting utilities
export function formatDateForInput(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function formatTimeForInput(time: string): string {
  // Convert time string to 24-hour format for input
  return time;
}

// Validation helpers
export function validateRSVPToken(token: string): boolean {
  return /^[A-Z0-9]{8}$/.test(token);
}

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Get the base path for the application
 * Returns the configured basePath in production, empty string in development
 */
export function getBasePath(): string {
  // Use the public environment variable set by Next.js config
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

/**
 * Create a basePath-aware asset URL
 * Use this for all static assets (images, videos, etc.)
 */
export function assetUrl(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
