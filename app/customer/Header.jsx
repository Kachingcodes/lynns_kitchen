"use client";

import { Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useOrder } from "../context/OrderContext";
import Link from "next/link";


export default function Header({ onSearch }) {
  const { totalItems, openCart } = useOrder();
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
    <header className="relative flex items-center justify-between border-b bg-background p-4 overflow-hidden">

      {/* Restaurant Info */}
      <div className="flex items-center gap-2 px-2">
        <Image
          src="/images/lynn.png"
          alt="Meks Restaurant"
          width={60}
          height={50}
          priority
          sizes="60px"
          className=" rounded-full"
        />

        <h1 className="flex flex-col text-xl font-semibold text-foreground">
          Lynn's Kitchen

          <span className="text-sm text-primary">
            Fine dining
          </span>
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-2">

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

            <Link
              href={`/customer`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeBtn === "customer"
                  ? "bg-primary text-white shadow-lg"
                  : "text-black hover:text-foreground"
              }`}
            >
              Customer
            </Link>

            <Link
              href="/waiter"
              onClick={() => setActiveBtn("waiter")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeBtn === "waiter"
                  ? "bg-primary text-white shadow-lg"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              Waiter
            </Link>

          </div> 

      </div>

      {/* Sliding Search */}
      <div
        className={`absolute inset-y-0 right-0 z-20 flex w-[350px] items-center border-l bg-background px-4 shadow-lg transition-transform duration-300 ease-in-out ${
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