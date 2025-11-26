"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickFilterChipProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export default function QuickFilterChip({
  label,
  icon: Icon,
  isActive,
  onClick,
}: QuickFilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        isActive
          ? "text-white shadow-md"
          : "bg-white text-gray-600 hover:text-gray-800"
      )}
      style={isActive ? {
        backgroundColor: 'var(--teal-600)',
      } : {
        border: '1px solid var(--cream-300)',
      }}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
