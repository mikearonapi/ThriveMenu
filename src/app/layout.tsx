import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Header } from "@/components/layout/Header";
import AuthProvider from "@/components/providers/AuthProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thrivemenu.vercel.app";

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "ThriveMenu - Nourishing Meals for Your Wellness Journey",
    template: "%s | ThriveMenu",
  },
  description:
    "Delicious, therapeutic recipes supporting thyroid health, heart protection, and blood sugar stability. Family-friendly meals that nourish your body and delight your taste buds.",
  keywords: [
    "healthy recipes",
    "meal planning",
    "thyroid support recipes",
    "heart healthy meals",
    "blood sugar friendly",
    "anti-inflammatory diet",
    "Graves disease diet",
    "Mediterranean recipes",
    "family meals",
    "wellness recipes",
    "low glycemic recipes",
    "omega-3 rich meals",
    "selenium rich foods",
  ],
  authors: [{ name: "ThriveMenu" }],
  creator: "ThriveMenu",
  publisher: "ThriveMenu",

  // Canonical URL
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },

  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ThriveMenu",
    title: "ThriveMenu - Nourishing Meals for Your Wellness Journey",
    description:
      "Delicious, therapeutic recipes supporting thyroid health, heart protection, and blood sugar stability. Every recipe is designed to nourish your body while delighting your taste buds.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ThriveMenu - Nourishing meals for your wellness journey",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "ThriveMenu - Nourishing Meals for Your Wellness Journey",
    description:
      "Delicious recipes supporting thyroid health, heart protection, and blood sugar stability.",
    images: ["/opengraph-image"],
    creator: "@thrivemenu",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },

  // PWA manifest
  manifest: "/manifest.json",

  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ThriveMenu",
  },

  // Verification (add your IDs when ready)
  // verification: {
  //   google: "your-google-verification-code",
  // },

  // Category
  category: "food & cooking",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#26a69a",
  viewportFit: "cover",
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ThriveMenu",
  description:
    "Delicious, therapeutic recipes supporting thyroid health, heart protection, and blood sugar stability.",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/explore?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "ThriveMenu",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/apple-icon`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased min-h-screen safe-top safe-bottom"
        style={{ backgroundColor: "var(--cream-100)" }}
      >
        <AuthProvider>
          <Header />
          <main className="pb-24 min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
