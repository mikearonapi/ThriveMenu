"use client";

import Link from "next/link";
import { Utensils } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 header-gradient">
      <div className="container-app py-4 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link href="/" className="flex-shrink-0">
            <h1
              className="text-xl sm:text-2xl font-bold text-white italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              ThriveMenu
            </h1>
            <p className="text-[11px] sm:text-xs text-white/80 font-medium">
              Nourishing meals for your wellness journey
            </p>
          </Link>

          {/* Fork/Knife Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
          </div>
        </div>
      </div>
    </header>
  );
}
