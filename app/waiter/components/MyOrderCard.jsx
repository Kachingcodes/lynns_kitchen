"use client";

import Link from "next/link";

import {
  Clock,
  User,
  CheckCircle2,
} from "lucide-react";

export default function MyOrderCard({
  order,
}) {
  return (
    <article className="rounded-2xl border border-primary/20 bg-primary/5 p-5">

      <div className="flex items-start justify-between">

        <div>

          <span className="text-sm text-muted-foreground">
            Order #{order.id}
          </span>

          <h3 className="mt-1 text-lg font-semibold text-foreground">
            Table {order.table_number}
          </h3>

        </div>

        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">

          <CheckCircle2 className="h-3.5 w-3.5" />

          My Order

        </span>

      </div>


      <div className="mt-5 space-y-3">

        {/* Customer */}
        <div className="flex items-center gap-3 text-sm">

          <User className="h-4 w-4 text-muted-foreground" />

          <span>
            {order.customer_name}
          </span>

        </div>


        {/* Prep Time */}
        <div className="flex items-center gap-3">

          <Clock className="h-4 w-4 text-primary" />

          <div>

            <p className="text-xs text-muted-foreground">
              Estimated prep time
            </p>

            <p className="font-bold text-primary">
              {order.estimated_wait_minutes} min
            </p>

          </div>

        </div>

      </div>


      {/* Manage Order */}
      <Link
        href={`/waiter/orders/${order.id}`}
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
      >
        Manage Order
      </Link>

    </article>
  );
}