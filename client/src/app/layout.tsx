import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import Providers from "@/components/providers";
import RouteLoader from "@/components/RouteLoader";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sharothee-wedding.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Incia & Arvin's Wedding",
    template: "%s | Incia & Arvin's Wedding",
  },
  description: "Join us in celebrating the love story of Incia & Arvin - from childhood friends to forever partners. Dhaka, Bangladesh with celebrations continuing in Phu Quoc, Vietnam.",
  keywords: ["wedding", "Incia", "Arvin", "Dhaka", "Vietnam", "celebration", "wedding website", "RSVP", "wedding events"],
  authors: [{ name: "CodeStorm Hub" }],
  creator: "CodeStorm Hub",
  applicationName: "Incia & Arvin's Wedding",
  openGraph: {
    title: "Incia & Arvin's Wedding",
    description: "Join us in celebrating the love story of Incia & Arvin - from childhood friends to forever partners",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Incia & Arvin's Wedding",
    images: [
      {
        url: '/images/gallery/gallery-1.jpg',
        width: 1200,
        height: 630,
        alt: "Incia & Arvin's Wedding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Incia & Arvin's Wedding",
    description: "Join us in celebrating the love story of Incia & Arvin",
    images: ['/images/gallery/gallery-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// Separate viewport export as required by Next.js 13+
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-cream-50 text-gray-800">
        <Providers>
          <ErrorBoundary>
            {/* Wrap components that read search params in Suspense to satisfy Next.js CSR bailout requirements */}
            <Suspense fallback={null}>
              <RouteLoader />
            </Suspense>
            {children}
          </ErrorBoundary>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
