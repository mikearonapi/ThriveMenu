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
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t"
      style={{
        borderColor: 'var(--cream-200)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto pt-1.5 pb-1">
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
                "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200",
                isActive
                  ? ""
                  : "text-gray-400 hover:text-gray-600"
              )}
              style={isActive ? { color: 'var(--teal-600)' } : {}}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-200"
                )}
                style={isActive ? { backgroundColor: 'var(--teal-50)' } : {}}
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
                  "text-[10px] font-medium leading-tight",
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
