"use client";

import Link from "next/link";
import { Search, Utensils } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 header-gradient">
      <div className="container-app py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
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

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/15 backdrop-blur-sm border border-white/20 rounded-full 
                         pl-12 pr-4 py-3 text-white placeholder-white/50
                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent
                         transition-all duration-200"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
