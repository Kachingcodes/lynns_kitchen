"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Search,
  User,
  Armchair,
} from "lucide-react";

export default function TrackOrderPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!customerName.trim() || !tableNumber.trim()) {
      setError("Please enter your name and table number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/customer/track-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: customerName.trim(),
            tableNumber: tableNumber.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to find order"
        );
      }

      router.push(`/order/${data.order.id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "We couldn't find an order with those details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-background text-foreground">

      {/* HEADER */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">

          {/* Back */}
          <button
            type="button"
            onClick={() => router.push("/customer")}
            className="group flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span className="hidden sm:inline">
              Back to Menu
            </span>
          </button>


          {/* Brand */}
          <div className="flex min-w-0 items-center gap-2">

            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
              <Image
                src="/images/lynn.png"
                alt="Lynn"
                width={100}
                height={100}
                priority
                sizes="(max-width: 640px) 36px, 48px"
                className="object-contain"
              />
            </div>

            <span className="truncate text-sm font-bold tracking-tight sm:text-lg">
              Lynn's Kitchen
            </span>

          </div>


          {/* Spacer */}
          <div className="w-8 shrink-0 sm:w-24" />

        </div>

      </header>


      {/* MAIN */}
      <section className="relative flex h-[calc(100dvh-64px)] items-center justify-center overflow-hidden px-4 sm:h-[calc(100dvh-80px)] sm:px-6">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[130px]" />


        <div className="relative z-10 w-full max-w-md">

          {/* Icon */}
          <div className="mb-5 flex justify-center sm:mb-7">

            <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-primary/20 bg-primary/10 text-primary shadow-lg sm:h-20 sm:w-20 sm:rounded-[1.75rem]">

              <ClipboardList
                size={20}
                className="sm:hidden"
              />

              <ClipboardList
                size={28}
                className="hidden sm:block"
              />

            </div>

          </div>


          {/* Heading */}
          <div className="text-center">

            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.25em]">
              Order Tracking
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:mt-4 sm:text-4xl">
              Find your order
            </h1>

            <p className="mx-auto mt-3 max-w-sm px-2 text-sm leading-6 text-muted-foreground sm:mt-4 sm:px-0">
              Enter the name used for your order and your table number to continue tracking your order.
            </p>

          </div>


          {/* FORM CARD */}
          <div className="mt-6 rounded-[1.75rem] border border-border/60 bg-card/80 p-4 shadow-2xl backdrop-blur-xl sm:mt-7 sm:rounded-[2rem] sm:p-8">

            <form onSubmit={handleSubmit}>

              {/* CUSTOMER NAME */}
              <div>

                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Name
                </label>

                <div className="group flex min-w-0 items-center rounded-2xl border border-border bg-background px-3 transition-all duration-300 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 sm:px-4">

                  <User
                    size={18}
                    className="mr-3 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary"
                  />

                  <input
                    id="customerName"
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(event) => {
                      setCustomerName(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    autoComplete="name"
                    className="h-13 min-w-0 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50 sm:h-14"
                  />

                </div>

              </div>


              {/* TABLE NUMBER */}
              <div className="mt-5">

                <label
                  htmlFor="tableNumber"
                  className="mb-2 block text-sm font-semibold"
                >
                  Table Number
                </label>

                <div className="group flex min-w-0 items-center rounded-2xl border border-border bg-background px-3 transition-all duration-300 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 sm:px-4">

                  <Armchair
                    size={18}
                    className="mr-3 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary"
                  />

                  <input
                    id="tableNumber"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    value={tableNumber}
                    onChange={(event) => {
                      setTableNumber(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    className="h-13 min-w-0 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50 sm:h-14"
                  />

                </div>

              </div>


              {/* ERROR */}
              {error && (
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 sm:mt-5">

                  <p className="text-xs font-medium leading-5 text-red-500 sm:text-sm">
                    {error}
                  </p>

                </div>
              )}


              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6 sm:h-14"
              >

                {loading
                  ? "Finding your order..."
                  : "Find My Order"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>


            {/* Helper */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-muted/40 p-3.5 sm:mt-6 sm:p-4">

              <Search
                size={17}
                className="mt-0.5 shrink-0 text-primary"
              />

              <p className="text-xs leading-5 text-muted-foreground">
                Make sure you enter the same name and table number used when placing your order.
              </p>

            </div>

          </div>


          {/* Footer */}
          <div className="mt-6 pb-2 text-center sm:mt-7 sm:pb-0">

            <button
              type="button"
              onClick={() => router.push("/customer")}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm"
            >
              Want to place a new order?

              <span className="ml-1 text-primary">
                View Menu
              </span>
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
