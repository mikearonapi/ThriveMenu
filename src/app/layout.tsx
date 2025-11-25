import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/navigation/BottomNav";

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
  maximumScale: 1,
  userScalable: false,
  themeColor: "#87a878",
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
      <body className="antialiased bg-[var(--cream-100)] min-h-screen">
        <main className="safe-bottom">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
