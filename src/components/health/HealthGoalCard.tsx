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
    bg: "bg-[var(--sage-50)]",
    progress: "bg-[var(--sage-500)]",
    progressBg: "bg-[var(--sage-200)]",
    text: "text-[var(--sage-700)]",
  },
  forest: {
    bg: "bg-[var(--forest-50)]",
    progress: "bg-[var(--forest-500)]",
    progressBg: "bg-[var(--forest-200)]",
    text: "text-[var(--forest-700)]",
  },
  rose: {
    bg: "bg-[var(--rose-50)]",
    progress: "bg-[var(--rose-500)]",
    progressBg: "bg-[var(--rose-200)]",
    text: "text-[var(--rose-700)]",
  },
  terracotta: {
    bg: "bg-[var(--terracotta-50)]",
    progress: "bg-[var(--terracotta-500)]",
    progressBg: "bg-[var(--terracotta-200)]",
    text: "text-[var(--terracotta-700)]",
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
          <div className={cn("text-[var(--sage-600)]", styles.text)}>
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
          <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
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
