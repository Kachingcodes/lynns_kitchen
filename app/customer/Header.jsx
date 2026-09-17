"use client";

import {
  Search,
  ShoppingBag,
  X,
  UserRound,
  ConciergeBell,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useOrder } from "../context/OrderContext";
import Link from "next/link";

export default function Header({ onSearch }) {
  const { totalItems } = useOrder();
  const [activeBtn, setActiveBtn] = useState("customer");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <header className="relative flex items-center justify-between overflow-hidden border-b bg-background p-3 sm:p-4">

      {/* Restaurant Info */}
      <div className="flex min-w-0 items-center gap-2 px-1 sm:px-2">

        <Image
          src="/images/lynn.png"
          alt="Lynn's Kitchen"
          width={60}
          height={50}
          priority
          sizes="60px"
          className="shrink-0 rounded-full"
        />

        <h1 className="flex min-w-0 flex-col truncate text-md font-semibold text-foreground lg:text-xl">
          <span className="truncate">
            Lynn's Kitchen
          </span>

          <span className="hidden text-sm font-normal text-primary sm:block">
            Fine dining
          </span>
        </h1>

      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 lg:gap-2">

        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-muted"
          aria-label="Search menu"
        >
          <Search size={18} />
        </button>

        {/* Shopping Bag */}
        <Link
          href="/customer/cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-muted"
          aria-label="View order"
        >
          <ShoppingBag size={18} />

          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Customer / Waiter Toggle */}
        <div className="flex items-center rounded-full border border-primary bg-foreground/5 p-1 backdrop-blur-md">

          {/* Customer */}
          <Link
            href="/customer"
            onClick={() => setActiveBtn("customer")}
            aria-label="Customer"
            title="Customer"
            className={`flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 sm:px-4 ${
              activeBtn === "customer"
                ? "bg-primary text-white shadow-lg"
                : "text-black hover:text-foreground"
            }`}
          >
            <UserRound size={17} className="sm:hidden" />

            <span className="hidden sm:block">
              Customer
            </span>
          </Link>

          {/* Waiter */}
          <Link
            href="/waiter"
            onClick={() => setActiveBtn("waiter")}
            aria-label="Waiter"
            title="Waiter"
            className={`flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 sm:px-4 ${
              activeBtn === "waiter"
                ? "bg-primary text-white shadow-lg"
                : "text-black hover:bg-gray-200"
            }`}
          >
            <ConciergeBell size={17} className="sm:hidden" />

            <span className="hidden sm:block">
              Waiter
            </span>
          </Link>

        </div>

      </div>

      {/* Sliding Search */}
      <div
        className={`absolute inset-y-0 right-0 z-20 flex w-full items-center border-l bg-background px-4 shadow-lg transition-transform duration-300 ease-in-out sm:w-[350px] ${
          isSearchOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex w-full items-center gap-3">

          <Search
            size={18}
            className="shrink-0 text-muted-foreground"
          />

          <input
            autoFocus={isSearchOpen}
            type="text"
            value={searchQuery}
            onChange={(e) =>
              handleSearchChange(e.target.value)
            }
            placeholder="Search the menu..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          <button
            onClick={closeSearch}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-muted"
            aria-label="Close search"
          >
            <X size={18} />
          </button>

        </div>
      </div>

    </header>
  );
}