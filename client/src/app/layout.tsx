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

export const metadata: Metadata = {
  title: "Incia & Arvin's Wedding",
  description: "Join us in celebrating the love story of Incia & Arvin - from childhood friends to forever partners. Dhaka, Bangladesh with celebrations continuing in Phu Quoc, Vietnam.",
  keywords: ["wedding", "Incia", "Arvin", "Dhaka", "Vietnam", "celebration"],
  authors: [{ name: "CodeStorm Hub" }],
  creator: "CodeStorm Hub",
  openGraph: {
    title: "Incia & Arvin's Wedding",
    description: "Join us in celebrating the love story of Incia & Arvin",
    type: "website",
    locale: "en_US",
    siteName: "Incia & Arvin's Wedding",
  },
  twitter: {
    card: "summary_large_image",
    title: "Incia & Arvin's Wedding",
    description: "Join us in celebrating the love story of Incia & Arvin",
  },
  robots: "index, follow",
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
