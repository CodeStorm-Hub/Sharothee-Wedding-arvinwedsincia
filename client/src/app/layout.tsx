import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import Providers from "@/components/providers";
import RouteLoader from "@/components/RouteLoader";
import { Suspense } from "react";

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

export const metadata: Metadata = {
  title: "Incia & Arvin's Wedding - December 16, 2025",
  description: "Join us in celebrating the love story of Incia & Arvin - from childhood friends at AISD to forever partners. Wedding ceremony in Dhaka, Bangladesh on December 16, 2025, with celebrations continuing in Phu Quoc, Vietnam.",
  keywords: ["wedding", "Incia", "Arvin", "Dhaka", "Vietnam", "celebration", "AISD", "love story", "December 2025"],
  authors: [{ name: "Incia & Arvin" }],
  creator: "Incia & Arvin",
  openGraph: {
    title: "Incia & Arvin's Wedding - December 16, 2025",
    description: "Join us in celebrating the love story of Incia & Arvin - from childhood friends to forever partners",
    type: "website",
    locale: "en_US",
    siteName: "Incia & Arvin's Wedding",
    images: [
      {
        url: "/images/og-wedding-image.jpg",
        width: 1200,
        height: 630,
        alt: "Incia & Arvin's Wedding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Incia & Arvin's Wedding - December 16, 2025",
    description: "Join us in celebrating the love story of Incia & Arvin",
    images: ["/images/og-wedding-image.jpg"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://arvinwedsincia.com",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Incia & Arvin's Wedding Ceremony",
    "description": "Join us in celebrating the love story of Incia & Arvin - from childhood friends at American International School of Dhaka to forever partners.",
    "startDate": "2025-12-16T18:00:00+06:00",
    "endDate": "2025-12-16T23:00:00+06:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Wedding Venue Dhaka",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "Bangladesh",
        "addressRegion": "Dhaka Division"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "23.8103",
        "longitude": "90.4125"
      }
    },
    "organizer": [
      {
        "@type": "Person",
        "name": "Incia",
        "givenName": "Incia"
      },
      {
        "@type": "Person", 
        "name": "Arvin",
        "givenName": "Arvin"
      }
    ],
    "performer": {
      "@type": "Person",
      "name": "Incia & Arvin"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InviteOnly",
      "price": "0",
      "priceCurrency": "USD"
    },
    "image": [
      "https://arvinwedsincia.com/images/og-wedding-image.jpg"
    ],
    "url": "https://arvinwedsincia.com",
    "subEvent": [
      {
        "@type": "Event",
        "name": "After-party in Phu Quoc, Vietnam",
        "location": {
          "@type": "Place",
          "name": "Phu Quoc, Vietnam",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Phu Quoc",
            "addressCountry": "Vietnam"
          }
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        {/* Enhanced structured data for wedding event */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Additional meta tags for better SEO and accessibility */}
        <meta name="theme-color" content="#d4a574" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
      </body>
    </html>
  );
}
