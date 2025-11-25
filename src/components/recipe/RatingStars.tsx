"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface RatingStarsProps {
  recipeId: string;
  initialRating?: number | null;
  averageRating?: number;
  totalRatings?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export default function RatingStars({
  recipeId,
  initialRating = null,
  averageRating,
  totalRatings = 0,
  onRatingChange,
  interactive = true,
}: RatingStarsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(initialRating);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = async (rating: number) => {
    if (!interactive) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/recipe/${recipeId}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/recipes/${recipeId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        setUserRating(rating);
        onRatingChange?.(rating);
      } else {
        console.error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredStar || userRating || averageRating || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(null)}
            disabled={isSubmitting || !interactive}
            className={cn(
              "w-10 h-10 flex items-center justify-center transition-all",
              interactive && "hover:scale-110 cursor-pointer",
              (!interactive || isSubmitting) && "cursor-default"
            )}
            title={
              interactive
                ? isAuthenticated
                  ? `Rate ${star} star${star > 1 ? "s" : ""}`
                  : "Sign in to rate"
                : undefined
            }
          >
            <Star
              className={cn(
                "w-7 h-7 transition-colors",
                star <= displayRating
                  ? "text-terracotta-400 fill-current"
                  : "text-gray-300",
                interactive && !isAuthenticated && "opacity-60"
              )}
            />
          </button>
        ))}
      </div>
      {averageRating && totalRatings > 0 && (
        <p className="text-sm text-gray-600">
          {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
        </p>
      )}
    </div>
  );
}

