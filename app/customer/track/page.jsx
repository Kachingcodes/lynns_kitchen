"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Search,
  Utensils,
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

  /*
    BASIC FRONTEND VALIDATION
  */

  if (!customerName.trim() || !tableNumber.trim()) {
    setError(
      "Please enter your name and table number."
    );

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
    <main className="min-h-screen bg-background text-foreground">

      {/* HEADER */}

      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-6">


          {/* Back */}

          <button
            type="button"
            onClick={() => router.push("/customer")}
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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

          <div className="flex items-center gap-2">

            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/images/lynn.png"
                alt="Lynn"
                width={100}
                height={100}
                priority
                sizes="48px"
                className="object-contain"
              />
            </div>


            <span className="text-lg font-bold tracking-tight">
                Lynn's Kitchen
            </span>

          </div>

          {/* Spacer */}

          <div className="w-10 sm:w-24" />

        </div>

      </header>



      {/* MAIN */}

      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-5 py-6 sm:px-6">


        {/* Background Effects */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]" />


        <div className="relative z-10 w-full max-w-md">


          {/* Icon */}

          <div className="mb-7 flex justify-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-primary/20 bg-primary/10 text-primary shadow-lg">

              <ClipboardList size={34} />

            </div>

          </div>


          {/* Heading */}

          <div className="text-center">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">

              Order Tracking

            </p>


            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">

              Find your order

            </h1>


            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">

              Enter the name used for your order and your table number to continue tracking your order.

            </p>

          </div>

          {/* FORM CARD */}

          <div className="mt-6 rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">


            <form onSubmit={handleSubmit}>


              {/* CUSTOMER NAME */}

              <div>

                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Name
                </label>

                <div className="group flex items-center rounded-2xl border border-border bg-background px-4 transition-all duration-300 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">

                  <User
                    size={19}
                    className="mr-3 text-muted-foreground transition-colors group-focus-within:text-primary"
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
                    className="h-14 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
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


                <div className="group flex items-center rounded-2xl border border-border bg-background px-4 transition-all duration-300 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">


                  <Armchair
                    size={19}
                    className="mr-3 text-muted-foreground transition-colors group-focus-within:text-primary"
                  />


                  <input
                    id="tableNumber"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={tableNumber}
                    onChange={(event) => {
                      setTableNumber(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    className="h-14 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                  />

                </div>

              </div>



              {/* ERROR */}

              {error && (

                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3">

                  <p className="text-sm font-medium text-red-500">

                    {error}

                  </p>

                </div>

              )}



              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
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

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-muted/40 p-4">

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

          <div className="mt-7 text-center">

            <button
              type="button"
              onClick={() => router.push("/customer")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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