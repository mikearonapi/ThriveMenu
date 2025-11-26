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

export const metadata: Metadata = {
  title: "ThriveMenu - Nourishing Meals for Your Family",
  description:
    "A beautiful meal planning app designed for families with health-focused dietary needs. Mediterranean-inspired recipes for heart health, thyroid support, and blood sugar balance.",
  keywords: [
    "meal planning",
    "healthy recipes",
    "Mediterranean diet",
    "Graves disease diet",
    "heart healthy",
    "anti-inflammatory",
    "family meals",
  ],
  authors: [{ name: "ThriveMenu" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ThriveMenu",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#87a878",
  viewportFit: "cover", // For PWA safe areas
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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="antialiased min-h-screen safe-top safe-bottom" style={{ backgroundColor: 'var(--cream-100)' }}>
        <AuthProvider>
          <Header />
          <main className="safe-bottom min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
