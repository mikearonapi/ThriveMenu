"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Calendar,
  Heart,
  User,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/meal-plan", icon: Calendar, label: "Plan" },
  { href: "/favorites", icon: Heart, label: "Saved" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200",
                isActive
                  ? ""
                  : "text-gray-500 hover:text-gray-700"
              )}
              style={isActive ? { color: 'var(--teal-600)' } : {}}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-200"
                )}
                style={isActive ? { backgroundColor: 'var(--teal-100)' } : {}}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "stroke-[2.5px]"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
