"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HealthGoalCardProps {
  title: string;
  subtitle: string;
  progress: number;
  icon: ReactNode;
  color: "teal" | "sage" | "forest" | "rose" | "terracotta";
}

const colorStyles = {
  teal: {
    bg: "var(--teal-50)",
    border: "var(--teal-100)",
    progress: "var(--teal-500)",
    progressBg: "var(--teal-200)",
    text: "var(--teal-700)",
    iconBg: "var(--teal-100)",
  },
  sage: {
    bg: "var(--sage-50)",
    border: "var(--sage-100)",
    progress: "var(--sage-500)",
    progressBg: "var(--sage-200)",
    text: "var(--sage-700)",
    iconBg: "var(--sage-100)",
  },
  forest: {
    bg: "var(--forest-50)",
    border: "var(--forest-100)",
    progress: "var(--forest-500)",
    progressBg: "var(--forest-200)",
    text: "var(--forest-700)",
    iconBg: "var(--forest-100)",
  },
  rose: {
    bg: "var(--rose-50)",
    border: "var(--rose-100)",
    progress: "var(--rose-500)",
    progressBg: "var(--rose-200)",
    text: "var(--rose-500)",
    iconBg: "var(--rose-100)",
  },
  terracotta: {
    bg: "var(--terracotta-50)",
    border: "var(--terracotta-100)",
    progress: "var(--terracotta-500)",
    progressBg: "var(--terracotta-200)",
    text: "var(--terracotta-700)",
    iconBg: "var(--terracotta-100)",
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
      className="w-full rounded-xl p-4 transition-all hover:shadow-md"
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: styles.iconBg }}
        >
          <div style={{ color: styles.text }}>
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm mb-0.5"
            style={{ fontFamily: "var(--font-serif)", color: styles.text }}
          >
            {title}
          </p>
          <p className="text-[11px] text-gray-500">{subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-1.5 rounded-full overflow-hidden mb-1.5"
        style={{ backgroundColor: styles.progressBg }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: styles.progress,
          }}
        />
      </div>
      <p 
        className="text-xs font-semibold"
        style={{ color: styles.text }}
      >
        {progress}%
      </p>
    </div>
  );
}
