"use client";

import Link from "next/link";
import { Utensils } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 header-gradient">
      <div className="container-app py-2.5 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link href="/" className="flex-shrink-0">
            <h1
              className="text-lg sm:text-xl md:text-2xl font-bold text-white italic leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              ThriveMenu
            </h1>
            <p className="text-[10px] sm:text-xs text-white/80 font-medium leading-tight">
              Nourishing meals for your wellness journey
            </p>
          </Link>

          {/* Fork/Knife Icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
          </div>
        </div>
      </div>
    </header>
  );
}
