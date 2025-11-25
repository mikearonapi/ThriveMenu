"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HealthGoalCardProps {
  title: string;
  subtitle: string;
  progress: number;
  icon: ReactNode;
  color: "sage" | "forest" | "rose" | "terracotta";
}

const colorStyles = {
  sage: {
    bg: "bg-sage-50",
    progress: "bg-sage-500",
    progressBg: "bg-sage-200",
    text: "text-sage-700",
  },
  forest: {
    bg: "bg-forest-50",
    progress: "bg-forest-500",
    progressBg: "bg-forest-200",
    text: "text-forest-700",
  },
  rose: {
    bg: "bg-rose-50",
    progress: "bg-rose-500",
    progressBg: "bg-rose-200",
    text: "text-rose-700",
  },
  terracotta: {
    bg: "bg-terracotta-50",
    progress: "bg-terracotta-500",
    progressBg: "bg-terracotta-200",
    text: "text-terracotta-700",
  },
};

export default function HealthGoalCard({
  title,
  subtitle,
  progress,
  icon,
  color,
}: HealthGoalCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        "flex-shrink-0 w-[280px] rounded-2xl p-5 transition-all hover:scale-[1.02] hover:shadow-lg",
        styles.bg,
        "border border-white/50 shadow-sm"
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
          styles.progressBg
        )}>
          <div className={cn("text-sage-600", styles.text)}>
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-semibold text-base mb-0.5",
              styles.text
            )}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={cn("h-2 rounded-full overflow-hidden mb-2", styles.progressBg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", styles.progress)}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className={cn("text-sm font-semibold", styles.text)}>
        {progress}%
      </p>
    </div>
  );
}
