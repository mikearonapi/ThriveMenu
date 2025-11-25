"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-5 py-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            {/* Logo Icon */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <Leaf className="w-6 h-6 text-sage-600" />
              <h1
                className="text-2xl font-semibold text-forest-900"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                ThriveMenu
              </h1>
            </div>
            {/* Mission Statement */}
            <p className="text-xs text-gray-600 font-medium" style={{ fontFamily: "var(--font-sans)" }}>
              Nourishing your family, one meal at a time
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

