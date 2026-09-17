import {
  ClipboardList,
  UserRound,
  ConciergeBell,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

export default function WaiterHeader({ id, order }) {
  const [activeBtn, setActiveBtn] = useState("waiter");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-5">

        {/* Dashboard Info */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
            <ClipboardList size={19} className="sm:hidden" />
            <ClipboardList size={21} className="hidden sm:block" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-xl">
              Waiter Dashboard
            </h1>

            <p className="hidden text-sm text-muted-foreground sm:block">
              Manage incoming orders and customer requests
            </p>
          </div>

        </div>

        {/* Customer / Waiter Toggle */}
        <div className="ml-2 flex shrink-0 items-center rounded-full border border-primary bg-foreground/5 p-1 backdrop-blur-md">

          {/* Customer */}
          <Link
            href="/"
            onClick={() => setActiveBtn("customer")}
            aria-label="Customer"
            title="Customer"
            className={`flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 sm:px-4 ${
              activeBtn === "customer"
                ? "bg-primary text-white shadow-lg"
                : "text-black hover:bg-gray-200"
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
                : "text-black hover:bg-foreground/40"
            }`}
          >
            <ConciergeBell size={17} className="sm:hidden" />

            <span className="hidden sm:block">
              Waiter
            </span>
          </Link>

        </div>

      </div>

    </header>
  );
}