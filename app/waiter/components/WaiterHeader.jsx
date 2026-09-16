import {
  Bell,
  ClipboardList,
  User,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

export default function WaiterHeader({ id, order }) {
    const [activeBtn, setActiveBtn] = useState("waiter");
  

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardList size={21} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Waiter Dashboard
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage incoming orders and customer requests
            </p>
          </div>

        </div>

          {/* Customer / Waiter Toggle */}
          <div className="flex items-center rounded-full border border-primary bg-foreground/5 p-1 backdrop-blur-md">

            <Link
              href={`/`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeBtn === "customer"
                  ? "bg-primary text-white shadow-lg"
                  : "text-black hover:bg-gray-200"
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
                  : "text-black hover:bg-foreground/40"
              }`}
            >
              Waiter
            </Link>

          </div> 

      </div>

    </header>
  );
}