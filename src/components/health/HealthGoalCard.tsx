"use client";

import { cn } from "@/lib/utils";

interface HealthGoalCardProps {
  title: string;
  subtitle: string;
  progress: number;
  icon: string;
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
        "flex-shrink-0 w-36 rounded-2xl p-4 transition-all hover:scale-[1.02]",
        styles.bg
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <p
            className={cn(
              "font-medium text-sm",
              styles.text
            )}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={cn("h-1.5 rounded-full overflow-hidden", styles.progressBg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", styles.progress)}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className={cn("text-xs mt-1 font-medium", styles.text)}>
        {progress}%
      </p>
    </div>
  );
}
