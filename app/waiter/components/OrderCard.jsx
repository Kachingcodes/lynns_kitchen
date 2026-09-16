"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import {
  Clock,
  User,
  MessageSquare,
  Star,
  SquareExclamationPoint,
  ArrowRight,
  Check,
  CircleDot,
} from "lucide-react";


export default function OrderCard({
  order,
  onTakeOrder,
  loading,
  onViewComplaint,
  onViewRating,
}) {

  const isAssigned = Boolean(order.waiter_id);


  const [remainingSeconds, setRemainingSeconds] =
    useState(null);



  useEffect(() => {

    if (
      order.status !== "preparing" ||
      !order.preparing_started_at
    ) {

      setRemainingSeconds(null);

      return;

    }


    const updateCountdown = () => {

      const startedAt = new Date(
        order.preparing_started_at
      ).getTime();


      const durationMinutes =
        Number(order.actual_wait_minutes) ||
        Number(order.estimated_wait_minutes);


      if (
        Number.isNaN(startedAt) ||
        Number.isNaN(durationMinutes) ||
        durationMinutes <= 0
      ) {

        setRemainingSeconds(null);

        return;

      }


      const endTime =
        startedAt +
        durationMinutes * 60 * 1000;


      const remaining = Math.max(

        0,

        Math.floor(
          (endTime - Date.now()) / 1000
        )

      );


      setRemainingSeconds(remaining);

    };


    updateCountdown();


    const interval = setInterval(
      updateCountdown,
      1000
    );


    return () =>
      clearInterval(interval);


  }, [

    order.status,
    order.preparing_started_at,
    order.actual_wait_minutes,
    order.estimated_wait_minutes,

  ]);



  const formatCountdown = (seconds) => {

    if (
      seconds === null ||
      seconds === undefined ||
      Number.isNaN(seconds)
    ) {

      return "--:--";

    }


    const minutes =
      Math.floor(seconds / 60);


    const remaining =
      seconds % 60;


    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(
      2,
      "0"
    )}`;

  };



  return (

<article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

  {/* ========================================= */}
  {/* HEADER */}
  {/* ========================================= */}

  <div className="flex items-center justify-between px-6 py-5">

    <div>
      <Link
        href={`/order/${order.id}`}
        className="text-sm font-bold text-foreground transition hover:text-primary"
      >
        Order #{order.id}
      </Link>

      <p className="mt-1 text-xs text-muted-foreground">
        {order.customer_name}
      </p>
    </div>


    {/* STATUS */}

    {order.status === "served" ? (

      <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
        Ready for Payment
      </span>

    ) : order.status === "paid" ? (

      <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600">
        <Check className="h-3.5 w-3.5" />
        Paid
      </span>

    ) : isAssigned ? (

      <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
        Assigned
      </span>

    ) : (

      <span className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-600">
        <SquareExclamationPoint className="h-3.5 w-3.5" />
        Waiting
      </span>

    )}

  </div>


  {/* ========================================= */}
  {/* MAIN ORDER IDENTITY */}
  {/* ========================================= */}

  <div className="border-y border-border bg-secondary/20 px-6 py-7">

    <div className="flex items-center justify-between">

      {/* TABLE */}

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Table
        </p>

        <div className="mt-1 flex items-baseline gap-2">

          <span className="text-5xl font-bold tracking-tight text-foreground">
            {order.table_number}
          </span>

        </div>

      </div>


      {/* TIME */}

      <div className="text-right">

        <div className="flex items-center justify-end gap-2">

          <Clock className="h-4 w-4 text-primary" />

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {order.status === "preparing"
              ? "Remaining"
              : "Estimated"}
          </p>

        </div>

        <p className="mt-2 text-xl font-bold tabular-nums text-foreground">

          {order.status === "served" ? (

            "—"

          ) : order.status === "preparing" &&
            remainingSeconds !== null &&
            remainingSeconds <= 0 ? (

            "READY"

          ) : order.status === "preparing" ? (

            formatCountdown(remainingSeconds)

          ) : (

            `${order.estimated_wait_minutes} min`

          )}

        </p>

      </div>

    </div>

  </div>


  {/* ========================================= */}
  {/* ORDER PROGRESS */}
  {/* ========================================= */}

  <div className="px-6 py-6">

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">

          <Clock className="h-4 w-4 text-primary" />

        </div>

        <div>

          <p className="text-xs font-medium text-muted-foreground">
            Order Progress
          </p>

          <div className="mt-1">

            {order.status === "served" ? (

              <span className="font-bold text-green-600">
                Order Served
              </span>

            ) : order.status === "preparing" &&
              remainingSeconds !== null &&
              remainingSeconds <= 0 ? (

              <span className="cursor-pointer animate-pulse font-bold text-primary">
                READY FOR SERVICE
              </span>

            ) : order.status === "preparing" ? (

              <span className="font-bold text-primary">
                Preparing
              </span>

            ) : (

              <span className="font-bold text-foreground">
                Waiting to Prepare
              </span>

            )}

          </div>

        </div>

      </div>

    </div>


    {/* PROGRESS LINE */}

    <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">

      <div
        className={`h-full rounded-full transition-all duration-500 ${
          order.status === "served" ||
          order.status === "paid"
            ? "w-full bg-green-500"
            : order.status === "preparing"
            ? "w-2/3 bg-primary"
            : "w-1/3 bg-orange-500"
        }`}
      />

    </div>

  </div>


  {/* ========================================= */}
  {/* ASSIGNMENT + FEEDBACK */}
  {/* ========================================= */}

  <div className="border-t border-border px-6">

    {/* WAITER */}

    <div className="flex items-center justify-between py-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">

          <User className="h-4 w-4 text-muted-foreground" />

        </div>

        <div>

          <p className="text-xs text-muted-foreground">
            Assigned Waiter
          </p>

          <p className="mt-1 text-sm font-semibold text-foreground">
            {isAssigned
              ? order.waiter_name || "Assigned waiter"
              : "Not assigned"}
          </p>

        </div>

      </div>

    </div>


    {/* COMPLAINT */}

    <div className="flex items-center justify-between border-t border-border py-5">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            order.complaint_id
              ? "bg-red-500/10"
              : "bg-secondary"
          }`}
        >

          <MessageSquare
            className={`h-4 w-4 ${
              order.complaint_id
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          />

        </div>


        <div>

          <p className="text-xs text-muted-foreground">
            Customer Feedback
          </p>


          {!order.complaint_id ? (

            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              No complaints
            </p>

          ) : order.complaint_status === "resolved" ? (

            <button
              type="button"
              onClick={() =>
                onViewComplaint(order)
              }
              className="mt-1 text-sm font-bold text-green-600 transition hover:underline"
            >
              Complaint Resolved
            </button>

          ) : (

            <button
              type="button"
              onClick={() =>
                onViewComplaint(order)
              }
              className="mt-1 text-sm font-bold text-red-500 transition hover:underline"
            >
              View Complaint
            </button>

          )}

        </div>

      </div>


      {order.complaint_id && (
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      )}

    </div>

  </div>


  {/* ========================================= */}
  {/* ACTIONS */}
  {/* ========================================= */}

  <div className="border-t border-border bg-secondary/10 p-4">

    <div className="flex items-center gap-3">

      {/* RATING */}

      {order.rating_id ? (

        <button
          type="button"
          onClick={() =>
            onViewRating(order)
          }
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 text-sm font-bold text-yellow-600 transition hover:bg-yellow-400/20"
        >

          <Star
            className="h-4 w-4 fill-yellow-400"
          />

          Rating

        </button>

      ) : null}


      {/* PRIMARY ACTION */}

      {!isAssigned ? (

        <button
          type="button"
          onClick={() =>
            onTakeOrder(order)
          }
          disabled={loading}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading
            ? "Loading..."
            : "Take Order"}

          {!loading && (
            <ArrowRight className="h-4 w-4" />
          )}

        </button>

      ) : order.status === "served" ? (

        <Link
          href={`/waiter/orders/${order.id}/payment`}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-white transition hover:opacity-90"
        >

          Collect Payment

          <ArrowRight className="h-4 w-4" />

        </Link>

      ) : (

        <Link
          href={`/waiter/orders/${order.id}`}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-white transition hover:opacity-90"
        >
          View Order
          <ArrowRight className="h-4 w-4" />

        </Link>

      )}

    </div>

  </div>

</article>

  );

}