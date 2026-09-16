"use client";

import {
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useOrder } from "../context/OrderContext";

const categories = [
  { label: "All", value: "all" },
  { label: "Starters", value: "starter" },
  { label: "Main", value: "main" },
  { label: "Sides", value: "sides" },
  { label: "Desserts", value: "dessert" },
  { label: "Drinks", value: "drinks" },
];

export default function MenuNav({
  activeCategory,
  setActiveCategory,
  menuItems = [],
}) {
  const {
    totalItems,
    totalPrice,
  } = useOrder();

  const getCategoryCount = (category) => {
    if (category === "all") {
      return menuItems.length;
    }

    return menuItems.filter(
      (item) => item.category === category
    ).length;
  };

  return (
    <aside className="w-full lg:w-[260px] lg:shrink-0">

      {/* Desktop Label */}
      <span className="mb-2 px-7 hidden text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground lg:block">
        Browse
      </span>

      {/* Navigation */}
      <nav className="flex w-full gap-2 overflow-x-auto px-4 py-4 hide-scrollbar lg:flex-col lg:overflow-visible lg:px-6 lg:py-6"
      >
        {categories.map((category) => {
          const isActive =
            activeCategory === category.value;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() =>
                setActiveCategory(category.value)
              }
              className={`flex border border-primary shrink-0 items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm transition-all lg:w-full lg:shrink lg:px-4 lg:py-3 lg:text-left 
                ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <span className="">
                {category.label}
              </span>

              <span
                className={`
                  flex
                  min-w-6
                  items-center
                  justify-center
                  rounded-full
                  px-1.5
                  py-0.5
                  text-[10px]
                  font-semibold
                  lg:min-w-7
                  lg:px-2
                  lg:py-1
                  lg:text-xs
                  
                  ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {getCategoryCount(category.value)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Order Card — Desktop Only */}
      {totalItems > 0 && (
        <div className="mt-4 hidden px-6 lg:block">

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">

            {/* Order Header */}
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-foreground">
                  Your Order
                </p>

                <p className="text-sm text-muted-foreground">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}
                </p>
              </div>

            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between">

              <span className="text-sm text-muted-foreground">
                Total
              </span>

              <span className="text-lg font-bold text-foreground">
                ₦{totalPrice.toLocaleString()}
              </span>

            </div>

            {/* View Order */}
            <Link
                href="/customer/cart"
                className="mt-4 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                View Order

                <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      )}

    </aside>
  );
}