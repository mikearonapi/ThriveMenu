"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  ShoppingCart,
  Check,
  ArrowLeft,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ShoppingListItem {
  id: string;
  customName: string;
  amount: number;
  unit: string;
  category: string;
  isChecked: boolean;
  notes?: string;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
}

export default function ShoppingListPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function fetchShoppingList() {
      try {
        const response = await fetch(`/api/shopping-lists/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setShoppingList(data.shoppingList);
        }
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchShoppingList();
  }, [params.id, isAuthenticated]);

  const toggleItem = async (itemId: string) => {
    if (!shoppingList) return;

    const item = shoppingList.items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      const response = await fetch(`/api/shopping-lists/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isChecked: !item.isChecked }),
      });

      if (response.ok) {
        setShoppingList({
          ...shoppingList,
          items: shoppingList.items.map((i) =>
            i.id === itemId ? { ...i, isChecked: !i.isChecked } : i
          ),
        });
      }
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pb-24 bg-cream-100 flex items-center justify-center px-5">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-sage-600 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-forest-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Sign In to View Shopping List
          </h1>
          <button
            onClick={() => router.push("/login")}
            className="btn-primary mt-4"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 bg-cream-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
      </div>
    );
  }

  if (!shoppingList) {
    return (
      <div className="min-h-screen pb-24 bg-cream-100 flex items-center justify-center px-5">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-sage-600 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-forest-900 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Shopping List Not Found
          </h1>
          <button
            onClick={() => router.push("/meal-plan")}
            className="btn-primary mt-4"
          >
            Back to Meal Plan
          </button>
        </div>
      </div>
    );
  }

  const groupedItems = shoppingList.items.reduce((acc, item) => {
    const category = item.category || "OTHER";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const categoryOrder = ["PRODUCE", "MEAT", "DAIRY", "PANTRY", "FROZEN", "OTHER"];

  return (
    <div className="min-h-screen pb-24 bg-cream-100">
      {/* Header */}
      <header className="px-5 pt-12 pb-6 bg-gradient-to-b from-sage-50 to-cream-100">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1
            className="text-2xl font-medium text-forest-900 flex-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {shoppingList.name}
          </h1>
        </div>
      </header>

      {/* Shopping List Items */}
      <div className="px-5 py-4 space-y-6">
        {categoryOrder.map((category) => {
          const items = groupedItems[category] || [];
          if (items.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3",
                      item.isChecked && "opacity-60"
                    )}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        item.isChecked
                          ? "bg-sage-500 border-sage-500"
                          : "border-gray-300 hover:border-sage-400"
                      )}
                    >
                      {item.isChecked && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium text-forest-900",
                          item.isChecked && "line-through"
                        )}
                      >
                        {item.customName}
                      </p>
                      {item.amount > 0 && (
                        <p className="text-sm text-gray-500">
                          {item.amount} {item.unit}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-gray-400 mt-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-4">
        <Link
          href="/meal-plan"
          className="block w-full btn-primary text-center"
        >
          Back to Meal Plan
        </Link>
      </div>
    </div>
  );
}

