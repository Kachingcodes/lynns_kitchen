"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";

import { useOrder } from "../../context/OrderContext";
import { toast } from "react-toastify";

export default function Cart() {
  const router = useRouter();

  const {
    items,
    addToOrder,
    removeFromOrder,
    totalItems,
    totalPrice,
    totalPrepTime,
    clearOrder,
  } = useOrder();

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isCheckoutHydrated, setIsCheckoutHydrated] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState("");

  useEffect(() => {
    const loadAvailableTables = async () => {
      setTablesLoading(true);
      setTablesError("");

      try {
        const response = await fetch("/api/tables/available");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load available tables"
          );
        }

        setAvailableTables(data.availableTables || []);
      } catch (error) {
        console.error(error);

        setTablesError(
          error.message || "Unable to load available tables"
        );

        setAvailableTables([]);
      } finally {
        setTablesLoading(false);
      }
    };

    loadAvailableTables();
  }, []);

  const handleProceedToPrep = async () => {
    if (items.length === 0) {
      toast.info("Your Order is empty");
      return;
    }

    setShowCustomerForm(true);

    sessionStorage.setItem(
      "lynns-kitchen-checkout",
      "details"
    );

    setTablesLoading(true);
    setTablesError("");

    try {
      const response = await fetch("/api/tables/available");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load available tables"
        );
      }

      setAvailableTables(data.availableTables || []);
      setTableNumber("");
    } catch (error) {
      console.error(error);

      setTablesError(
        error.message || "Unable to load available tables"
      );

      setAvailableTables([]);
    } finally {
      setTablesLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!tableNumber) {
      toast.error("Please select your table number");
      return;
    }

    if (items.length === 0) {
      toast.error("Your order is empty");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: 3,
          customerName: customerName.trim(),
          tableNumber,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to place order"
        );
      }

      console.log("ORDER CREATED:", data.order);

      toast.success("Your order has been placed!");

      sessionStorage.removeItem(
      "lynns-kitchen-checkout"
      );

      clearOrder();

      setCustomerName("");
      setTableNumber("");

      router.push(`/order/${data.order.id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
  const savedCheckoutState =
    sessionStorage.getItem("lynns-kitchen-checkout");

  if (savedCheckoutState === "details") {
    setShowCustomerForm(true);
  }

  setIsCheckoutHydrated(true);
}, []);



  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">

          <div className="flex min-w-0 items-center gap-3">
            {showCustomerForm && (
              <button
                type="button"
                onClick={() => {
                  setShowCustomerForm(false);

                  sessionStorage.removeItem(
                    "lynns-kitchen-checkout"
                  );
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card transition hover:bg-secondary sm:h-10 sm:w-10"
                aria-label="Back to order"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl lg:text-2xl">
                {showCustomerForm ? "Your Details" : "Your Order"}
              </h1>

              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {showCustomerForm
                  ? "Tell us where to bring your order"
                  : `${totalItems} ${
                      totalItems === 1 ? "item" : "items"
                    }`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="shrink-0 rounded-full border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted sm:px-4 sm:text-sm"
          >
            <span className="hidden xs:inline">
              Continue browsing
            </span>
            <span className="xs:hidden">
              Browse
            </span>
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">

        {!showCustomerForm ? (
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1fr_350px]">

            {/* Cart Items */}
            <div>
              {items.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    Your order is empty
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Add something delicious to get started.
                  </p>

                  <button
                    onClick={() => router.push("/customer")}
                    className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-2xl border border-border bg-card p-3 sm:gap-4 sm:p-4"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                      />

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                          {item.prepTime}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-4">

                          <span className="text-sm font-semibold text-primary sm:text-base">
                            {item.price}
                          </span>

                          <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-1.5 py-1">

                            <button
                              type="button"
                              onClick={() =>
                                removeFromOrder(item.id)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                addToOrder(item)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              <Plus size={15} />
                            </button>

                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>

            {/* Order Summary */}
            {items.length > 0 && (
              <aside className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-6">

                <h2 className="text-lg font-semibold">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-4 sm:mt-6">

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Items
                    </span>

                    <span className="font-semibold">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Estimated prep time
                    </span>

                    <span className="font-semibold">
                      {totalPrepTime} min
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-lg font-bold text-primary sm:text-xl">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleProceedToPrep}
                  className="mt-5 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 sm:mt-6"
                >
                  Proceed to Prep
                </button>

              </aside>
            )}
          </div>
        ) : (

          /* Customer Details */
          <div className="mx-auto w-full max-w-xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-5 sm:space-y-6"
            >

              {/* Order Summary */}
              <div className="rounded-2xl bg-secondary p-4 sm:p-5">

                <h3 className="font-semibold text-foreground">
                  Order Summary
                </h3>

                <div className="mt-4 space-y-3">

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 flex-1">
                        {item.quantity} × {item.name}
                      </span>

                      <span className="shrink-0 font-medium">
                        {item.price}
                      </span>
                    </div>
                  ))}

                </div>

                <div className="mt-5 border-t border-border pt-4">

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Estimated prep time
                    </span>

                    <span className="shrink-0 font-semibold">
                      {totalPrepTime} min
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between gap-4">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="shrink-0 text-lg font-bold text-primary">
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>

                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              {/* Table */}
              <div>
                <label
                  htmlFor="tableNumber"
                  className="mb-2 block text-sm font-semibold"
                >
                  Table Number
                </label>

                <select
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(event) =>
                    setTableNumber(event.target.value)
                  }
                  disabled={
                    tablesLoading ||
                    availableTables.length === 0
                  }
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {tablesLoading
                      ? "Loading available tables..."
                      : availableTables.length === 0
                      ? "No tables currently available"
                      : "Select your table"}
                  </option>

                  {availableTables.map((table) => (
                    <option
                      key={table}
                      value={table}
                    >
                      Table {table}
                    </option>
                  ))}
                </select>

                {tablesError && (
                  <p className="mt-2 text-sm text-red-500">
                    {tablesError}
                  </p>
                )}

                {!tablesLoading &&
                  !tablesError &&
                  availableTables.length === 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      All tables are currently occupied.
                    </p>
                  )}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Place Order
              </button>

            </form>
          </div>
        )}
      </div>
    </main>
  );
}
